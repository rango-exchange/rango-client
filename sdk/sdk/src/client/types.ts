import type { ActionContext } from '../execution/context';
import type { EngineEvent } from '../execution/engine';
import type { Store } from '../execution/store';
import type { HistoryEvent } from '../history/mod';

export interface RangoSdkConfig {
  apiKey: string;
  baseUrl?: string;
  /** The hub provider behind a wallet type, or `undefined` when the host has none for it. */
  getProvider: ActionContext['getProvider'];
  /**
   * Rango's meta, or at least its blockchains. The engine reads chain ids and
   * switch details from it; `confirm` prices fees from its tokens when present.
   */
  getMeta: ActionContext['getMeta'];
  /**
   * Where executions are kept between turns of the loop and across reloads.
   * In memory when omitted, so nothing survives a reload. Read once, when the
   * client is created; `setConfig` does not replace it.
   */
  store?: Store;
}

/**
 * What `subscribe` delivers: a committed transition with the record after
 * it, or an execution leaving the store.
 */
export type ClientEvent = ({ type: 'transition' } & EngineEvent) | HistoryEvent;

export type ClientListener = (event: ClientEvent) => void;
