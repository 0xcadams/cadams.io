import { z } from "zod";

export const PRESENCE_NAME_EVENT = "cursor-presence-name";
export const ROOM_FULL_CLOSE_CODE = 4001;

const unitNumberSchema = z.number().min(0).max(1);

const cursorPositionSchema = z.object({
  x: unitNumberSchema,
  y: unitNumberSchema,
  anchor: z.string().nullable(),
  anchorX: unitNumberSchema,
  anchorY: unitNumberSchema,
});

const presenceCursorSchema = cursorPositionSchema.extend({
  id: z.string(),
  name: z.string(),
});

const moveMessageSchema = cursorPositionSchema.extend({
  type: z.literal("move"),
  anchor: z
    .string()
    .max(96)
    .regex(/^\d+(?:\.\d+)*$/)
    .nullable(),
});

const inactiveMessageSchema = z.object({
  type: z.literal("inactive"),
});

const clientMessageSchema = z.discriminatedUnion("type", [
  moveMessageSchema,
  inactiveMessageSchema,
]);

const serverMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hello"),
    self: z.object({ id: z.string(), name: z.string() }),
    cursors: z.array(presenceCursorSchema),
  }),
  z.object({
    type: z.literal("moves"),
    cursors: z.array(presenceCursorSchema),
  }),
  z.object({
    type: z.literal("leave"),
    id: z.string(),
  }),
]);

export type CursorPosition = z.infer<typeof cursorPositionSchema>;
export type PresenceCursor = z.infer<typeof presenceCursorSchema>;
export type MoveMessage = z.infer<typeof moveMessageSchema>;
export type InactiveMessage = z.infer<typeof inactiveMessageSchema>;
export type ClientMessage = z.infer<typeof clientMessageSchema>;
export type ServerMessage = z.infer<typeof serverMessageSchema>;

function parseJsonMessage<Schema extends z.ZodType>(
  rawMessage: string,
  schema: Schema,
): z.infer<Schema> | null {
  let value: unknown;

  try {
    value = JSON.parse(rawMessage);
  } catch {
    return null;
  }

  const result = schema.safeParse(value);
  return result.success ? result.data : null;
}

export const parseClientMessage = (rawMessage: string): ClientMessage | null =>
  parseJsonMessage(rawMessage, clientMessageSchema);

export const parseServerMessage = (rawMessage: string): ServerMessage | null =>
  parseJsonMessage(rawMessage, serverMessageSchema);
