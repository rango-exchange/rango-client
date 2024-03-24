import type { SolanaActions } from '@rango-dev/wallets-core';
import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  BlockchainProviderBuilder,
  ProviderBuilder,
  solanaUse,
} from '@rango-dev/wallets-core';
import {
  getSolanaAccounts,
  Networks,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { solanaBlockchain } from 'rango-types';

import { phantom as phantom_instance } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.PHANTOM;

export const config = {
  type: WALLET,
};

export const getInstance = phantom_instance;
export const connect: Connect = getSolanaAccounts;

export const subscribe: Subscribe = ({ instance, updateAccounts, connect }) => {
  const handleAccountsChanged = async (publicKey: string) => {
    const network = Networks.SOLANA;
    if (publicKey) {
      const account = publicKey.toString();
      updateAccounts([account]);
    } else {
      connect(network);
    }
  };
  instance?.on('accountChanged', handleAccountsChanged);

  return () => {
    instance?.off('accountChanged', handleAccountsChanged);
  };
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance }) => {
  try {
    const result = await instance.connect({ onlyIfTrusted: true });
    return !!result;
  } catch (error) {
    return false;
  }
};

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Phantom',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      DEFAULT: 'https://phantom.app/',
    },
    color: '#4d40c6',
    supportedChains: solana,
  };
};

const solana = new BlockchainProviderBuilder<SolanaActions>()
  .config('namespace', 'solana')
  .action('init', () => {
    console.log('[phantom]init called from solana cb');
  })
  .action('connect', async () => {
    const instance = phantom_instance();
    const result = await getSolanaAccounts({
      instance,
      meta: [],
    });
    if (Array.isArray(result)) {
      throw new Error("It shouldn't be array");
    }
    console.log('you are a trader?', result);
    return result.accounts;
  })
  .use(solanaUse)
  .build();

const phantom = new ProviderBuilder('Phantom')
  .init(function () {
    const [, setState] = this.state();

    if (phantom_instance()) {
      setState('installed', true);
      console.debug('[phantom] instance detected.', this);
    }
  })
  .config('info', {
    name: 'Phantom',
    icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
    extensions: {
      chrome:
        'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',

      homepage: 'https://phantom.app/',
    },
  })
  .add('solana', solana)
  .build()
  .before('connect', function (this: any) {
    console.log('------ before connect');
    const [, setState] = this.state();
    setState('connecting', true);
  })
  .after('connect', function (this: any) {
    console.log('------ after connect');
    const [, setState] = this.state();
    setState('connecting', false);
    setState('connected', true);
  });
export { phantom as provider };
