import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';
import type { PublicKey } from '@solana/web3.js';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/solana';
import { CAIP } from '@rango-dev/wallets-core/utils';
import {
  type WalletError,
  WalletReadyState,
} from '@solana/wallet-adapter-base';

import { WALLET_ID } from '../constants.js';
import { mobileWalletAdapter } from '../utils.js';

const connect = builders
  .connect()
  .action(async function () {
    const adapterInstance = mobileWalletAdapter();

    const connectHandler = new Promise((resolve, reject) => {
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
      adapterInstance.on('connect', handleConnect);
      adapterInstance.on('error', handleError);
    });

    if (
      adapterInstance.readyState === WalletReadyState.Loadable ||
      adapterInstance.connected === true
    ) {
      await adapterInstance.disconnect();
    }
    await adapterInstance.connect();
    return connectHandler;
  })
  .build();

const disconnect = commonBuilders
  .disconnect<SolanaActions>()
  .before(async () => {
    const adapterInstance = mobileWalletAdapter();
    await adapterInstance.disconnect();
  })
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { solana };
