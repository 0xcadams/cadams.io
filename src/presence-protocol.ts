export const PRESENCE_NAME_EVENT = "cursor-presence-name";
export const ROOM_FULL_CLOSE_CODE = 4001;

export interface CursorPosition {
  x: number;
  y: number;
  anchor: string | null;
  anchorX: number;
  anchorY: number;
}

export interface PresenceCursor extends CursorPosition {
  id: string;
  name: string;
}

export interface MoveMessage extends CursorPosition {
  type: "move";
}

export interface InactiveMessage {
  type: "inactive";
}

export type ClientMessage = MoveMessage | InactiveMessage;

export type ServerMessage =
  | {
      type: "hello";
      self: { id: string; name: string };
      cursors: PresenceCursor[];
    }
  | { type: "moves"; cursors: PresenceCursor[] }
  | { type: "leave"; id: string };

const isUnitNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;

const isPresenceCursor = (value: unknown): value is PresenceCursor => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const cursor = value as Record<string, unknown>;

  return (
    typeof cursor.id === "string" &&
    typeof cursor.name === "string" &&
    isUnitNumber(cursor.x) &&
    isUnitNumber(cursor.y) &&
    (cursor.anchor === null || typeof cursor.anchor === "string") &&
    isUnitNumber(cursor.anchorX) &&
    isUnitNumber(cursor.anchorY)
  );
};

export const isClientMessage = (value: unknown): value is ClientMessage => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Record<string, unknown>;
  const anchor = message.anchor;

  if (message.type === "inactive") {
    return true;
  }

  return (
    message.type === "move" &&
    isUnitNumber(message.x) &&
    isUnitNumber(message.y) &&
    (anchor === null ||
      (typeof anchor === "string" &&
        anchor.length <= 96 &&
        /^\d+(?:\.\d+)*$/.test(anchor))) &&
    isUnitNumber(message.anchorX) &&
    isUnitNumber(message.anchorY)
  );
};

export const parseServerMessage = (rawMessage: string): ServerMessage | null => {
  let value: unknown;

  try {
    value = JSON.parse(rawMessage);
  } catch {
    return null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const message = value as Record<string, unknown>;

  if (
    message.type === "hello" &&
    message.self &&
    typeof message.self === "object" &&
    typeof (message.self as Record<string, unknown>).id === "string" &&
    typeof (message.self as Record<string, unknown>).name === "string" &&
    Array.isArray(message.cursors) &&
    message.cursors.every(isPresenceCursor)
  ) {
    return value as ServerMessage;
  }

  if (
    message.type === "moves" &&
    Array.isArray(message.cursors) &&
    message.cursors.every(isPresenceCursor)
  ) {
    return value as ServerMessage;
  }

  if (message.type === "leave" && typeof message.id === "string") {
    return value as ServerMessage;
  }

  return null;
};
