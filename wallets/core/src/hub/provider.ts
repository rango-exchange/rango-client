import type { State as V1State } from '../wallet';

import { BlockchainProvider } from './blockchain';

type State = Omit<V1State, 'reachable'>;
type SetState = <K extends keyof State>(name: K, value: State[K]) => void;
type GetState = <K extends keyof State>(name: K) => State[K];

type Browsers = 'FIREFOX' | 'CHROME' | 'EDGE' | 'BRAVE' | 'DEFAULT';

type _WalletInfo = {
  name: string;
  img: string;
  installLink: Record<Browsers, string> | string;
  color: string;
  /*
   *   supportedChains: BlockchainMeta[];
   *   showOnMobile?: boolean;
   *   isContractWallet?: boolean;
   *   mobileWallet?: boolean;
   */
};

class Provider {
  public id: string;
  private providers: Map<string, typeof BlockchainProvider> = new Map();
  private _state: State;

  constructor(id: string) {
    this.id = id;

    this._state = {
      connected: false,
      connecting: false,
      installed: false,
      accounts: null,
      network: null,
    };
  }

  add(blockchain: BlockchainProvider) {
    this.providers.set(blockchain.id, BlockchainProvider);
    return this;
  }

  state(): [GetState, SetState] {
    const setState: SetState = (name, value) => {
      this._state[name] = value;
    };

    const getState: GetState = (name) => {
      return this._state[name];
    };

    return [getState, setState];
  }

  getAll() {
    return this.providers;
  }

  get(blockchainId: string) {
    return this.providers.get(blockchainId);
  }
}

export { Provider };
