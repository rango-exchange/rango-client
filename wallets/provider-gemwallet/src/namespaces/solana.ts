import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { getAddress } from '@gemwallet/api';
import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders,
  CAIP_NAMESPACE,
  CAIP_SOLANA_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/solana';
import { CAIP } from '@rango-dev/wallets-core/utils';

import { WALLET_ID } from '../constants.js';

const connect = builders
  .connect()
  .action(async function () {
    const response = await getAddress();
    const address = response.result?.address || '';
    console.log({ response });

    const formattedAccount = CAIP.AccountId.format({
      address,
      chainId: {
        namespace: CAIP_NAMESPACE,
        reference: CAIP_SOLANA_CHAIN_ID,
      },
    }) as CaipAccount;
    return [formattedAccount];
  })
  .build();

const solana = new NamespaceBuilder<SolanaActions>('Solana', WALLET_ID)
  .action(connect)
  .build();

export { solana };
