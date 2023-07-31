import { MockProvider } from 'ethereum-waffle';

type ProviderSetup = {
  address: string;
  privateKey: string;
  networkVersion: number;
  debug?: boolean;
  manualConfirmEnable?: boolean;
};

interface IMockProvider {
  request(args: {
    method: 'eth_accounts';
    params: string[];
  }): Promise<string[]>;
  request(args: {
    method: 'eth_requestAccounts';
    params: string[];
  }): Promise<string[]>;

  request(args: { method: 'net_version' }): Promise<number>;
  request(args: { method: 'eth_chainId'; params: string[] }): Promise<string>;

  request(args: { method: 'personal_sign'; params: string[] }): Promise<string>;
  request(args: {
    method: 'eth_sendTransaction';
    params: string[];
  }): Promise<{ hash: string }>;

  request(args: {
    method: 'eth_blockNumber';
    params: string[];
  }): Promise<number>;

  request(args: { method: string; params?: any[] }): Promise<any>;
}

export class MockEvmProvider implements IMockProvider {
  private setup: ProviderSetup;
  public isMetaMask = true;

  private acceptEnable?: (value: unknown) => void;

  private rejectEnable?: (value: unknown) => void;

  constructor(setup: ProviderSetup) {
    this.setup = setup;
  }

  private log = (...args: (any | null)[]) =>
    this.setup.debug && console.log('🦄', ...args);

  get selectedAddress(): string {
    return this.setup.address;
  }

  get networkVersion(): number {
    return this.setup.networkVersion;
  }

  get chainId(): string {
    return `0x${this.setup.networkVersion.toString(16)}`;
  }

  answerEnable(acceptance: boolean) {
    if (acceptance) this.acceptEnable!('Accepted');
    else this.rejectEnable!('User rejected');
  }

  async request({ method, params }: any): Promise<any> {
    this.log(`request[${method}]`);
    const [walletFrom] = new MockProvider().getWallets();

    switch (method) {
      case 'eth_requestAccounts':
      case 'eth_accounts':
        if (this.setup.manualConfirmEnable) {
          return new Promise((resolve, reject) => {
            this.acceptEnable = resolve;
            this.rejectEnable = reject;
          }).then(() => [this.selectedAddress]);
        }
        return Promise.resolve([this.selectedAddress]);

      case 'net_version':
        return Promise.resolve(this.setup.networkVersion);

      case 'eth_chainId':
        return Promise.resolve(this.chainId);

      case 'personal_sign': {
        const signed: string = await walletFrom.signMessage(params[0]);
        return Promise.resolve(signed);
      }

      case 'eth_sendTransaction': {
        const { gas, ...rest } = params[0];
        return Promise.resolve(
          walletFrom.sendTransaction({
            gasLimit: gas,
            ...rest,
          })
        );
      }

      case 'eth_blockNumber':
        return Promise.resolve(1);

      default:
        this.log(`requesting missing method ${method}`);
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(
          `The method ${method} is not implemented by the mock provider.`
        );
    }
  }

  sendAsync(props: { method: string }, cb: any) {
    switch (props.method) {
      case 'eth_accounts':
        cb(null, { result: [this.setup.address] });
        break;

      case 'net_version':
        cb(null, { result: this.setup.networkVersion });
        break;

      default:
        this.log(`Method '${props.method}' is not supported yet.`);
    }
  }

  on(props: string) {
    this.log('registering event:', props);
  }

  removeAllListeners() {
    this.log('removeAllListeners', null);
  }
}
