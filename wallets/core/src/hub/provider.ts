import type { EvmActions, RemoveThisParameter } from '../actions/evm/interface';
import type { State as V1State } from '../wallet';

type State = Omit<V1State, 'reachable'>;
type SetState = <K extends keyof State>(name: K, value: State[K]) => void;
type GetState = <K extends keyof State>(name: K) => State[K];

type Browsers = 'FIREFOX' | 'CHROME' | 'EDGE' | 'BRAVE' | 'DEFAULT';
interface CommonBlockchains {
  evm: RemoveThisParameter<EvmActions>;
  solana: any;
  cosmos: string;
}

// Record<'evm', EvmActions> | Record<'solana', any>;

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
  private providers = new Map();
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

  add<K extends keyof CommonBlockchains>(
    id: K,
    blockchain: CommonBlockchains[K]
  ) {
    this.providers.set(id, blockchain);
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

  get<K extends keyof CommonBlockchains>(id: K): CommonBlockchains[K] {
    return this.providers.get(id);
  }
}

export { Provider };
