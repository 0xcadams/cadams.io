import { DurableObject } from "cloudflare:workers";
import {
  ROOM_FULL_CLOSE_CODE,
  parseClientMessage,
  type CursorPosition,
  type PresenceCursor,
  type ServerMessage,
} from "../../src/presence-protocol";

const MAX_CONNECTIONS = 64;
const MAX_MESSAGE_LENGTH = 512;
const MIN_MOVE_INTERVAL_MS = 40;
const MAX_RATE_VIOLATIONS = 5;
const BATCH_INTERVAL_MS = 50;
const ROOM_PATTERN = /^\/(?:[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*)?$/;
const SESSION_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const FIRE_NAMES = [
  "Fire",
  "Flame",
  "Ember",
  "Cinder",
  "Fuego",
  "Llama",
  "Brasa",
  "Feu",
  "Flamme",
  "Braise",
  "Fuoco",
  "Fiamma",
  "Brace",
  "Fogo",
  "Chama",
  "Faísca",
  "Feuer",
  "Glut",
  "Funke",
  "Vuur",
  "Vlam",
  "Vonk",
  "Eld",
  "Låga",
  "Gnista",
  "Tuli",
  "Liekki",
  "Kipinä",
  "Eldur",
  "Logi",
  "Neisti",
  "Ignis",
  "Flamma",
  "Favilla",
  "Fotiá",
  "Flóga",
  "Spítha",
  "Ateş",
  "Alev",
  "Kor",
  "Nār",
  "Lahab",
  "Jamra",
  "Esh",
  "Lehava",
  "Nitzotz",
  "Aag",
  "Jwala",
  "Chingari",
  "Hi",
  "Honō",
  "Hibana",
  "Bul",
  "Bulkkot",
  "Bulssi",
  "Huǒ",
  "Huǒyàn",
  "Huǒxīng",
  "Api",
  "Bara",
  "Nyala",
  "Apoy",
  "Alab",
  "Baga",
] as const;

const FIRE_NAME_SET = new Set<string>(FIRE_NAMES);

interface CursorAttachment {
  id: string;
  name: string;
  cursor: CursorPosition | null;
  lastAcceptedAt: number;
  rateViolations: number;
}

const getAttachment = (socket: WebSocket) =>
  socket.deserializeAttachment() as CursorAttachment | null;

const toPublicCursor = (
  attachment: CursorAttachment,
): PresenceCursor | null =>
  attachment.cursor
    ? {
        id: attachment.id,
        name: attachment.name,
        ...attachment.cursor,
      }
    : null;

export class CursorRoom extends DurableObject<Env> {
  private pendingCursors = new Map<string, PresenceCursor>();
  private batchTimer: ReturnType<typeof setTimeout> | null = null;

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("Expected a WebSocket upgrade", { status: 426 });
    }

    const peers = this.ctx.getWebSockets();
    const attachments = peers
      .map(getAttachment)
      .filter((attachment): attachment is CursorAttachment => Boolean(attachment));

    if (attachments.length >= MAX_CONNECTIONS) {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      server.accept();
      setTimeout(() => {
        server.close(ROOM_FULL_CLOSE_CODE, "Room full");
      }, BATCH_INTERVAL_MS);

      return new Response(null, { status: 101, webSocket: client });
    }

    const url = new URL(request.url);
    const names = new Set(attachments.map((attachment) => attachment.name));
    const ids = new Set(attachments.map((attachment) => attachment.id));
    const requestedId = url.searchParams.get("session");
    const preferredName = url.searchParams.get("name");
    const availableNames = FIRE_NAMES.filter((name) => !names.has(name));
    const name =
      preferredName && FIRE_NAME_SET.has(preferredName)
        ? preferredName
        : availableNames[Math.floor(Math.random() * availableNames.length)];

    const attachment: CursorAttachment = {
      id:
        requestedId && SESSION_PATTERN.test(requestedId) && !ids.has(requestedId)
          ? requestedId
          : crypto.randomUUID(),
      name,
      cursor: null,
      lastAcceptedAt: 0,
      rateViolations: 0,
    };
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);
    server.serializeAttachment(attachment);

    const cursors = attachments
      .map(toPublicCursor)
      .filter((cursor): cursor is PresenceCursor => Boolean(cursor));

    server.send(
      JSON.stringify({
        type: "hello",
        self: { id: attachment.id, name: attachment.name },
        cursors,
      } satisfies ServerMessage),
    );

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(
    socket: WebSocket,
    rawMessage: ArrayBuffer | string,
  ): Promise<void> {
    const attachment = getAttachment(socket);

    if (!attachment) {
      socket.close(1011, "Missing connection state");
      return;
    }

    if (
      typeof rawMessage !== "string" ||
      rawMessage.length > MAX_MESSAGE_LENGTH
    ) {
      socket.close(1008, "Invalid message");
      return;
    }

    const parsed = parseClientMessage(rawMessage);

    if (!parsed) {
      socket.close(1008, "Invalid message");
      return;
    }

    if (parsed.type === "inactive") {
      if (attachment.cursor) {
        attachment.cursor = null;
        socket.serializeAttachment(attachment);
        this.pendingCursors.delete(attachment.id);
        this.broadcast({ type: "leave", id: attachment.id }, socket);
      }

      return;
    }

    const now = Date.now();

    if (now - attachment.lastAcceptedAt < MIN_MOVE_INTERVAL_MS) {
      attachment.rateViolations += 1;
      socket.serializeAttachment(attachment);

      if (attachment.rateViolations >= MAX_RATE_VIOLATIONS) {
        socket.close(1008, "Message rate exceeded");
      }

      return;
    }

    attachment.cursor = {
      x: parsed.x,
      y: parsed.y,
      anchor: parsed.anchor,
      anchorX: parsed.anchorX,
      anchorY: parsed.anchorY,
    };
    attachment.lastAcceptedAt = now;
    attachment.rateViolations = 0;
    socket.serializeAttachment(attachment);

    const cursor = toPublicCursor(attachment)!;

    this.pendingCursors.set(cursor.id, cursor);
    this.scheduleBatch();
  }

  async webSocketClose(
    socket: WebSocket,
    code: number,
    reason: string,
  ): Promise<void> {
    const attachment = getAttachment(socket);

    if (attachment) {
      this.pendingCursors.delete(attachment.id);
      this.broadcast({ type: "leave", id: attachment.id }, socket);
    }

    socket.close(code, reason);
  }

  async webSocketError(socket: WebSocket): Promise<void> {
    const attachment = getAttachment(socket);

    if (attachment) {
      this.pendingCursors.delete(attachment.id);
      this.broadcast({ type: "leave", id: attachment.id }, socket);
    }

    socket.close(1011, "WebSocket error");
  }

  private scheduleBatch(): void {
    if (this.batchTimer) {
      return;
    }

    this.batchTimer = setTimeout(() => {
      this.batchTimer = null;

      if (this.pendingCursors.size === 0) {
        return;
      }

      const cursors = [...this.pendingCursors.values()];

      this.pendingCursors.clear();
      this.broadcast({ type: "moves", cursors });
    }, BATCH_INTERVAL_MS);
  }

  private broadcast(message: ServerMessage, sender?: WebSocket): void {
    const serialized = JSON.stringify(message);

    for (const peer of this.ctx.getWebSockets()) {
      if (peer === sender) {
        continue;
      }

      try {
        peer.send(serialized);
      } catch {
        // Cloudflare will deliver a close/error event for stale sockets.
      }
    }
  }
}

const getRoomName = (url: URL): string | null => {
  const room = url.searchParams.get("room");

  if (!room || room.length > 160) {
    return null;
  }

  const canonicalRoom = room.length > 1 ? room.replace(/\/+$/, "") : room;

  return ROOM_PATTERN.test(canonicalRoom) ? canonicalRoom : null;
};

const isAllowedOrigin = (request: Request, url: URL): boolean => {
  const origin = request.headers.get("Origin");
  const isLocal = url.protocol === "http:";

  if (isLocal) {
    if (origin === null || origin === "null") {
      return true;
    }

    try {
      const originUrl = new URL(origin);

      return (
        originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1"
      );
    } catch {
      return false;
    }
  }

  return origin === "https://cadams.io";
};

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json(
        { ok: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    if (request.method !== "GET" || url.pathname !== "/v1/connect") {
      return new Response("Not found", { status: 404 });
    }

    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("Expected a WebSocket upgrade", { status: 426 });
    }

    if (!isAllowedOrigin(request, url)) {
      return new Response("Origin not allowed", { status: 403 });
    }

    const room = getRoomName(url);

    if (!room) {
      return new Response("Invalid room", { status: 400 });
    }

    return env.CURSOR_ROOMS.getByName(room).fetch(request);
  },
} satisfies ExportedHandler<Env>;
