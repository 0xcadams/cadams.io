"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PRESENCE_NAME_EVENT,
  ROOM_FULL_CLOSE_CODE,
  parseServerMessage,
  type CursorPosition,
  type PresenceCursor,
} from "../presence-protocol";

const SEND_INTERVAL_MS = 50;
const DEPARTURE_DURATION_MS = 60_000;
const PRODUCTION_ENDPOINT = "wss://presence.cadams.io/v1/connect";
const SESSION_STORAGE_KEY = "cursor-presence-session";
const NAME_STORAGE_KEY = "cursor-presence-name";

interface PeerIdentity {
  id: string;
  name: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const roundCoordinate = (value: number) => Math.round(value * 10_000) / 10_000;

const getEndpoint = (): string | null => {
  if (process.env.NEXT_PUBLIC_PRESENCE_URL) {
    return process.env.NEXT_PUBLIC_PRESENCE_URL;
  }

  if (window.location.hostname === "cadams.io") {
    return PRODUCTION_ENDPOINT;
  }

  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "ws://localhost:8787/v1/connect";
  }

  return null;
};

const getScrollRoot = () =>
  document.querySelector<HTMLElement>("[data-page-scroll]");

const getSessionId = () => {
  try {
    const storedId = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (storedId) {
      return storedId;
    }

    const id = crypto.randomUUID();

    window.sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
};

const getElementAnchor = (
  target: EventTarget | null,
  root: HTMLElement,
): string | null => {
  if (!(target instanceof Element) || target === root || !root.contains(target)) {
    return null;
  }

  const indices: number[] = [];
  let element: Element | null = target;

  while (element && element !== root) {
    const parent: Element | null = element.parentElement;

    if (!parent) {
      return null;
    }

    const index = Array.prototype.indexOf.call(parent.children, element) as number;

    if (index < 0) {
      return null;
    }

    indices.push(index);
    element = parent;
  }

  if (element !== root) {
    return null;
  }

  const path = indices.reverse().join(".");
  const bounds = target.getBoundingClientRect();

  if (!path || path.length > 96 || bounds.width <= 0 || bounds.height <= 0) {
    return null;
  }

  return path;
};

const getPointerPosition = (
  event: PointerEvent,
  root: HTMLElement,
): CursorPosition => {
  const rootBounds = root.getBoundingClientRect();
  const width = Math.max(root.scrollWidth, 1);
  const height = Math.max(root.scrollHeight, 1);
  const anchor = getElementAnchor(event.target, root);
  let anchorX = 0;
  let anchorY = 0;

  if (anchor && event.target instanceof Element) {
    const bounds = event.target.getBoundingClientRect();

    anchorX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    anchorY = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
  }

  return {
    x: roundCoordinate(
      clamp((event.clientX - rootBounds.left + root.scrollLeft) / width, 0, 1),
    ),
    y: roundCoordinate(
      clamp((event.clientY - rootBounds.top + root.scrollTop) / height, 0, 1),
    ),
    anchor,
    anchorX: roundCoordinate(anchorX),
    anchorY: roundCoordinate(anchorY),
  };
};

const resolveAnchor = (root: HTMLElement, path: string): Element | null => {
  let element: Element = root;

  for (const part of path.split(".")) {
    const index = Number(part);
    const child = element.children.item(index);

    if (!Number.isInteger(index) || index < 0 || !child) {
      return null;
    }

    element = child;
  }

  return element;
};

export function RemoteEmbers() {
  const pathname = usePathname();
  const [peers, setPeers] = useState<PeerIdentity[]>([]);
  const cursorsRef = useRef(new Map<string, PresenceCursor>());
  const elementsRef = useRef(new Map<string, HTMLDivElement>());
  const departureTimersRef = useRef(new Map<string, number>());
  const schedulePositionRef = useRef(() => {});

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(PRESENCE_NAME_EVENT, { detail: null }),
    );

    const endpoint = getEndpoint();

    if (!endpoint) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const scrollRoot = getScrollRoot();
    const sessionId = getSessionId();
    let preferredName: string | null = null;

    try {
      preferredName = window.sessionStorage.getItem(NAME_STORAGE_KEY);
    } catch {
      // Presence still works when session storage is unavailable.
    }

    if (!scrollRoot) {
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimer = 0;
    let sendTimer = 0;
    let positionFrame = 0;
    let retryCount = 0;
    let stopped = false;
    let roomUnavailable = false;
    let selfId: string | null = null;
    let lastSentAt = 0;
    let pendingPosition: CursorPosition | null = null;

    const clearPeers = () => {
      for (const timer of departureTimersRef.current.values()) {
        window.clearTimeout(timer);
      }

      departureTimersRef.current.clear();
      cursorsRef.current.clear();
      elementsRef.current.clear();
      setPeers([]);
    };

    const positionEmbers = () => {
      positionFrame = 0;
      const rootBounds = scrollRoot.getBoundingClientRect();

      for (const [id, cursor] of cursorsRef.current) {
        const element = elementsRef.current.get(id);

        if (!element) {
          continue;
        }

        let x =
          rootBounds.left + cursor.x * scrollRoot.scrollWidth - scrollRoot.scrollLeft;
        let y =
          rootBounds.top + cursor.y * scrollRoot.scrollHeight - scrollRoot.scrollTop;

        if (cursor.anchor) {
          const anchor = resolveAnchor(scrollRoot, cursor.anchor);

          if (anchor) {
            const anchorBounds = anchor.getBoundingClientRect();

            x = anchorBounds.left + cursor.anchorX * anchorBounds.width;
            y = anchorBounds.top + cursor.anchorY * anchorBounds.height;
          }
        }

        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
        element.dataset.visible = "true";
      }
    };

    const schedulePosition = () => {
      if (!positionFrame) {
        positionFrame = window.requestAnimationFrame(positionEmbers);
      }
    };

    schedulePositionRef.current = schedulePosition;

    const clearDeparture = (id: string) => {
      const timer = departureTimersRef.current.get(id);

      if (timer !== undefined) {
        window.clearTimeout(timer);
        departureTimersRef.current.delete(id);
      }

      const element = elementsRef.current.get(id);

      if (element) {
        element.dataset.departed = "false";
      }
    };

    const setCursor = (cursor: PresenceCursor) => {
      if (cursor.id === selfId) {
        return;
      }

      const existingCursor = cursorsRef.current.get(cursor.id);
      const isNew = !existingCursor;

      clearDeparture(cursor.id);
      cursorsRef.current.set(cursor.id, cursor);

      if (isNew) {
        setPeers((currentPeers) => [
          ...currentPeers,
          { id: cursor.id, name: cursor.name },
        ]);
      } else if (existingCursor.name !== cursor.name) {
        setPeers((currentPeers) =>
          currentPeers.map((peer) =>
            peer.id === cursor.id ? { id: cursor.id, name: cursor.name } : peer,
          ),
        );
      }

      schedulePosition();
    };

    const removeCursor = (id: string) => {
      clearDeparture(id);

      if (!cursorsRef.current.delete(id)) {
        return;
      }

      elementsRef.current.delete(id);
      setPeers((currentPeers) => currentPeers.filter((peer) => peer.id !== id));
    };

    const departCursor = (id: string) => {
      if (
        !cursorsRef.current.has(id) ||
        departureTimersRef.current.has(id)
      ) {
        return;
      }

      const element = elementsRef.current.get(id);

      if (element) {
        element.dataset.departed = "true";
      }

      const timer = window.setTimeout(() => {
        departureTimersRef.current.delete(id);
        removeCursor(id);
      }, DEPARTURE_DURATION_MS);

      departureTimersRef.current.set(id, timer);
    };

    const departAllCursors = () => {
      for (const id of cursorsRef.current.keys()) {
        departCursor(id);
      }
    };

    const shouldConnect = () =>
      !stopped &&
      !document.hidden &&
      navigator.onLine &&
      !reducedMotion.matches &&
      !roomUnavailable;

    const scheduleReconnect = () => {
      if (!shouldConnect() || reconnectTimer) {
        return;
      }

      const delay = Math.min(500 * 2 ** retryCount, 30_000);
      const jitter = Math.round(Math.random() * Math.min(delay * 0.25, 1_000));

      retryCount += 1;
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = 0;
        connect();
      }, delay + jitter);
    };

    const connect = () => {
      if (
        !shouldConnect() ||
        socket?.readyState === WebSocket.OPEN ||
        socket?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      const url = new URL(endpoint);

      url.searchParams.set("room", pathname);
      url.searchParams.set("session", sessionId);

      if (preferredName) {
        url.searchParams.set("name", preferredName);
      }

      const nextSocket = new WebSocket(url);

      socket = nextSocket;

      nextSocket.addEventListener("open", () => {
        retryCount = 0;
      });
      nextSocket.addEventListener("message", (event) => {
        if (typeof event.data !== "string") {
          return;
        }

        const message = parseServerMessage(event.data);

        if (!message) {
          return;
        }

        if (message.type === "hello") {
          selfId = message.self.id;
          preferredName = message.self.name;
          window.dispatchEvent(
            new CustomEvent(PRESENCE_NAME_EVENT, {
              detail: message.self.name,
            }),
          );

          try {
            window.sessionStorage.setItem(NAME_STORAGE_KEY, message.self.name);
          } catch {
            // The assigned name only needs in-memory persistence for this visit.
          }

          const activeIds = new Set(message.cursors.map((cursor) => cursor.id));

          for (const id of cursorsRef.current.keys()) {
            if (!activeIds.has(id)) {
              departCursor(id);
            }
          }

          for (const cursor of message.cursors) {
            setCursor(cursor);
          }

          return;
        }

        if (message.type === "moves") {
          for (const cursor of message.cursors) {
            setCursor(cursor);
          }

          return;
        }

        if (message.type === "leave") {
          departCursor(message.id);
        }
      });
      nextSocket.addEventListener("close", (event) => {
        if (socket === nextSocket) {
          socket = null;
          selfId = null;
          departAllCursors();

          if (event.code === ROOM_FULL_CLOSE_CODE) {
            roomUnavailable = true;
            window.dispatchEvent(
              new CustomEvent(PRESENCE_NAME_EVENT, { detail: null }),
            );
          }

          if (!roomUnavailable) {
            scheduleReconnect();
          }
        }
      });
      nextSocket.addEventListener("error", () => {
        nextSocket.close();
      });
    };

    const disconnect = () => {
      window.clearTimeout(reconnectTimer);
      reconnectTimer = 0;
      selfId = null;

      if (socket) {
        const activeSocket = socket;

        socket = null;
        activeSocket.close(1000, "Presence paused");
      }

      departAllCursors();
    };

    const sendPosition = (position: CursorPosition) => {
      if (socket?.readyState !== WebSocket.OPEN) {
        return;
      }

      lastSentAt = performance.now();
      socket.send(JSON.stringify({ type: "move", ...position }));
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) {
        return;
      }

      pendingPosition = getPointerPosition(event, scrollRoot);

      const elapsed = performance.now() - lastSentAt;

      if (elapsed >= SEND_INTERVAL_MS) {
        window.clearTimeout(sendTimer);
        sendTimer = 0;
        sendPosition(pendingPosition);
        pendingPosition = null;
        return;
      }

      if (!sendTimer) {
        sendTimer = window.setTimeout(() => {
          sendTimer = 0;

          if (pendingPosition) {
            sendPosition(pendingPosition);
            pendingPosition = null;
          }
        }, SEND_INTERVAL_MS - elapsed);
      }
    };

    const handleAvailabilityChange = () => {
      if (shouldConnect()) {
        connect();
      } else {
        disconnect();
      }
    };

    const resizeObserver = new ResizeObserver(schedulePosition);

    resizeObserver.observe(scrollRoot);
    for (const child of scrollRoot.children) {
      resizeObserver.observe(child);
    }

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleAvailabilityChange);
    document.addEventListener("load", schedulePosition, true);
    scrollRoot.addEventListener("scroll", schedulePosition, { passive: true });
    window.addEventListener("resize", schedulePosition, { passive: true });
    window.addEventListener("online", handleAvailabilityChange);
    window.addEventListener("offline", handleAvailabilityChange);
    reducedMotion.addEventListener("change", handleAvailabilityChange);

    connect();

    return () => {
      stopped = true;
      window.clearTimeout(reconnectTimer);
      window.clearTimeout(sendTimer);
      window.cancelAnimationFrame(positionFrame);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleAvailabilityChange);
      document.removeEventListener("load", schedulePosition, true);
      scrollRoot.removeEventListener("scroll", schedulePosition);
      window.removeEventListener("resize", schedulePosition);
      window.removeEventListener("online", handleAvailabilityChange);
      window.removeEventListener("offline", handleAvailabilityChange);
      reducedMotion.removeEventListener("change", handleAvailabilityChange);
      resizeObserver.disconnect();
      schedulePositionRef.current = () => {};

      if (socket) {
        socket.close(1000, "Page changed");
      }

      clearPeers();
      window.dispatchEvent(
        new CustomEvent(PRESENCE_NAME_EVENT, { detail: null }),
      );
    };
  }, [pathname]);

  return (
    <div aria-hidden="true" className="remote-embers">
      {peers.map((peer) => (
        <div
          className="remote-ember"
          data-visible="false"
          key={peer.id}
          ref={(element) => {
            if (element) {
              elementsRef.current.set(peer.id, element);
              element.dataset.departed = departureTimersRef.current.has(peer.id)
                ? "true"
                : "false";
              schedulePositionRef.current();
            } else {
              elementsRef.current.delete(peer.id);
            }
          }}
        >
          <span className="remote-ember-core" />
          <span className="remote-ember-label">{peer.name}</span>
        </div>
      ))}
    </div>
  );
}
