import type { Provider } from './provider';

/*
 *
 * Adapter:
 *
 * connect
 * disconnect, disconnectAll
 * suggestAndConnect
 * state
 * canSwitchNetwork
 * providers
 * getWalletInfo
 * getSigners
 *
 * onUpdateState is deprecated, probably by using .use() we can handle it somehow.
 *
 */

export class Hub {
  private providers = new Map<string, Provider>();

  constructor() {
    /*
     * TODO:
     * config:
     * isEagerConnectEnabled? (warning if explicitly calls eagerConnect)
     *
     */
    this.init();
  }

  eagerConnect() {
    /*
     * TODO: run eagerConnect on all instances.
     *
     * use runAll
     */
    throw new Error('Not Implemented');
  }
  disconnect() {
    /*
     * TODO run eagerConnect on all instances.
     * use runAll
     */
    throw new Error('Not Implemented');
  }

  runAll() {
    // run action on all providers eagerConnect, disconnect
    throw new Error('Not Implemented');
  }

  add(id: string, blockchain: Provider) {
    this.providers.set(id, blockchain);
    return this;
  }

  get(providerId: string) {
    return this.providers.get(providerId);
  }

  private init() {
    // TODO
    this.eagerConnect();
    throw new Error('Not Implemented');
  }
}
