import type { EvmActions, RemoveThisParameter } from '../actions/evm/interface';
import type { SolanaActions } from '../actions/solana/interface';
import type { State as V1State } from '../wallet';

type State = Omit<V1State, 'reachable'>;
type SetState = <K extends keyof State>(name: K, value: State[K]) => void;
type GetState = <K extends keyof State>(name: K) => State[K];

type Browsers = 'firefox' | 'chrome' | 'edge' | 'brave' | 'homepage';
interface CommonBlockchains {
  // TODO: I think we don't need `RemoveThisParameter`, because we went the opposite.
  evm: RemoveThisParameter<EvmActions>;
  solana: RemoveThisParameter<SolanaActions>;
  cosmos: string;
}

type Info = {
  name: string;
  icon: string;
  extensions: Partial<Record<Browsers, string>>;
};

interface Config {
  info: Info;
}

export class Provider {
  public id: string;
  /*
   * TODO:
   * It has some ts erros when I try to type it:
   * Map<keyof CommonBlockchains,CommonBlockchains[keyof CommonBlockchains]>
   */
  private blockchainProviders: Map<any, any>;
  private _state: State;
  private _configs: Map<keyof Config, Config[keyof Config]>;

  constructor(
    id: string,
    blockchains: Map<
      keyof CommonBlockchains,
      CommonBlockchains[keyof CommonBlockchains]
    >,
    configs: Provider['_configs']
  ) {
    this.id = id;
    this._configs = configs;
    this.blockchainProviders = blockchains;

    this._state = {
      connected: false,
      connecting: false,
      installed: false,
      accounts: null,
      network: null,
    };
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
    return this.blockchainProviders;
  }

  get<K extends keyof CommonBlockchains>(id: K): CommonBlockchains[K] {
    return this.blockchainProviders.get(id);
  }

  info(): Info | undefined {
    return this._configs.get('info');
  }
}

export class ProviderBuilder {
  private id: string;
  private blockchainProviders = new Map();
  private configs = new Map<keyof Config, Config[keyof Config]>();

  constructor(id: string) {
    this.id = id;
  }

  add<K extends keyof CommonBlockchains>(
    id: K,
    blockchain: CommonBlockchains[K]
  ) {
    this.blockchainProviders.set(id, blockchain);
    return this;
  }

  config<K extends keyof Config>(name: K, value: Config[K]) {
    this.configs.set(name, value);
    return this;
  }

  build(): Provider {
    // TODO: add some validations here.
    return new Provider(this.id, this.blockchainProviders, this.configs);
  }
}
