import type { ClientListener, RangoSdkConfig } from './types';
import type {
  ConfirmQuoteParams,
  ConfirmQuoteResult,
} from '../confirmation/types';
import type { WalletEvent } from '../execution/events';
import type { SwapExecution, SwapExecutionResult } from '../execution/types';
import type {
  BestRouteRequest,
  BestRouteResponse,
  MultiRouteRequest,
  MultiRouteResponse,
  RequestOptions,
} from 'rango-sdk';

import { RangoClient } from 'rango-sdk';

import { confirmQuote } from '../confirmation/confirm';
import { Engine } from '../execution/engine';
import { MemoryStore } from '../execution/store';
import { History } from '../history/mod';

export class RangoSdkClient {
  /** The executions on record: list and read them, cancel or delete one, clear the finished ones. */
  readonly history: History;
  #config: RangoSdkConfig;
  #httpClient: RangoClient;
  #engine: Engine;

  constructor(config: RangoSdkConfig) {
    this.#config = config;
    this.#httpClient = new RangoClient(config.apiKey, config.baseUrl);
    // One store for the engine and the history, so they see the same records.
    const store = config.store ?? new MemoryStore();
    // Read through the current config, so `setConfig` reaches the engine too.
    this.#engine = new Engine({
      httpClient: this.#httpClient,
      store,
      getProvider: (type) => this.#config.getProvider(type),
      getMeta: () => this.#config.getMeta(),
    });
    this.history = new History({ store, engine: this.#engine });
  }

  get isPaused(): boolean {
    return this.#engine.isPaused;
  }

  setConfig(config: RangoSdkConfig) {
    if (
      config.apiKey !== this.#config.apiKey ||
      config.baseUrl !== this.#config.baseUrl
    ) {
      this.#httpClient = new RangoClient(config.apiKey, config.baseUrl);
    }
    this.#config = config;
  }

  async quote(
    params: BestRouteRequest,
    options?: RequestOptions
  ): Promise<BestRouteResponse> {
    return this.#httpClient.getBestRoute(params, options);
  }

  async quotes(
    params: MultiRouteRequest,
    options?: RequestOptions
  ): Promise<MultiRouteResponse> {
    return this.#httpClient.getAllRoutes(params, options);
  }

  async confirm(
    params: ConfirmQuoteParams,
    options?: RequestOptions
  ): Promise<ConfirmQuoteResult> {
    return confirmQuote(
      { httpClient: this.#httpClient, getMeta: () => this.#config.getMeta() },
      params,
      options
    );
  }

  async execute(exec: SwapExecution): Promise<SwapExecutionResult> {
    return await this.#engine.execute(exec);
  }

  /** Tells the engine a wallet changed, so executions parked on it run again. */
  async notify(event: WalletEvent) {
    await this.#engine.notify(event);
  }

  /**
   * Puts the engine in read-only mode: nothing starts or goes on, while
   * history, cancel, delete and subscribe keep working. For a tab that is not
   * the active one; see `resume`.
   */
  pause(): void {
    this.#engine.pause();
  }

  /**
   * Lets the engine run and continues every execution still on record, which
   * is also how a host resumes after a reload. Call it on the active tab once
   * wallets have reconnected, and again whenever the tab becomes active.
   */
  async resume(): Promise<void> {
    await this.#engine.resume();
  }

  /**
   * Registers a listener for every change to an execution: each committed
   * transition, with the record after it, and each deletion. Returns what
   * removes it. Events fire in this process only; another tab sharing the
   * store hears nothing.
   */
  subscribe(listener: ClientListener): () => void {
    const unsubscribeEngine = this.#engine.subscribe((event) =>
      listener({ type: 'transition', ...event })
    );
    const unsubscribeHistory = this.history.subscribe(listener);
    return () => {
      unsubscribeEngine();
      unsubscribeHistory();
    };
  }
}

export function createClient(config: RangoSdkConfig): RangoSdkClient {
  if (!client) {
    client = new RangoSdkClient(config);
  } else {
    client.setConfig(config);
  }
  return client;
}

export function getClient(): RangoSdkClient {
  if (!client) {
    throw new Error(
      'RangoKit client is not created yet. call `createClient` first.'
    );
  }

  return client;
}

let client: RangoSdkClient | undefined = undefined;
