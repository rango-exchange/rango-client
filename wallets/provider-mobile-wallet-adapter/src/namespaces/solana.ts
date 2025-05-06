import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

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

    const account = phantomInstance.publicKey?.toString();
    if (!account) {
      throw new Error('Connected account is not found!');
    }
    return [
      CAIP.AccountId.format({
        address: account,
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: CAIP_SOLANA_CHAIN_ID,
        },
      }) as CaipAccount,
    ];
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
