import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';
import type { WalletError } from '@solana/wallet-adapter-base';
import type { PublicKey } from '@solana/web3.js';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/solana';
import { CAIP } from '@rango-dev/wallets-core/utils';

import { WALLET_ID } from '../constants.js';
import { mobileWalletAdapter } from '../utils.js';

const connect = builders
  .connect()
  .action(async function () {
    const phantomInstance = mobileWalletAdapter();
    await phantomInstance.connect();
    return new Promise((resolve, reject) => {
      const handleConnect = (publicKey: PublicKey) => {
        const account = publicKey?.toString();

        if (!account) {
          return reject(new Error('Connected account is not found!'));
        }
        return resolve([
          CAIP.AccountId.format({
            address: account,
            chainId: {
              namespace: CAIP_NAMESPACE,
              reference: CAIP_SOLANA_CHAIN_ID,
            },
          }) as CaipAccount,
        ]);
      };
      const handleError = (error: WalletError) => {
        return reject(error);
      };
      phantomInstance.on('connect', handleConnect);
      phantomInstance.on('error', handleError);
    });
  })
  .build();

const disconnect = commonBuilders.disconnect<SolanaActions>().build();

export const canEagerConnectAction = async () => {
  const phantomInstance = mobileWalletAdapter();
  try {
    await phantomInstance.autoConnect();
  } catch {
    return false;
  }
};

const canEagerConnect = new ActionBuilder<SolanaActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(canEagerConnectAction)
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { solana };
