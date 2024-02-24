/* eslint-disable @typescript-eslint/no-magic-numbers */
export enum Level {
  Off = 99,
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
}

export const EventType = 'logger-message-event';

export interface Layer {
  handler(payload: EventPayload): void;
}

export type Message = Error;
export type Context = Record<string, unknown>;
export type Tags = Record<string, unknown>;
export type Data = { tags?: Tags; context?: Context } & Record<string, unknown>;

export interface EventPayload {
  level: Level;
  message: Message;
  data?: Data;
}
