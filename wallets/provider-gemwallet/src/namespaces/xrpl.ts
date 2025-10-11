import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type { XRPLActions } from '@rango-dev/wallets-core/namespaces/xrpl';

import { getAddress } from '@gemwallet/api';
import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders,
  CAIP_NAMESPACE,
  CAIP_XRPL_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/xrpl';
import { CAIP } from '@rango-dev/wallets-core/utils';
import { Client } from 'xrpl';

import { WALLET_ID, XRPL_PUBLIC_SERVER } from '../constants.js';

const connect = builders
  .connect()
  .action(async function () {
    const response = await getAddress();
    const address = response.result?.address || '';

    const formattedAccount = CAIP.AccountId.format({
      address,
      chainId: {
        namespace: CAIP_NAMESPACE,
        reference: CAIP_XRPL_CHAIN_ID,
      },
    }) as CaipAccount;

    return [formattedAccount];
  })
  .build();

const xrpl = new NamespaceBuilder<XRPLActions>('XRPL', WALLET_ID)
  .action(connect)
  .action('accountLines', async (_, account, options) => {
    const client = new Client(XRPL_PUBLIC_SERVER);
    await client.connect();

    const response = await client.request({
      command: 'account_lines',
      ledger_index: 'current',
      account: account,
      peer: options?.peer,
    });

    await client.disconnect();
    return response.result.lines;
  })
  .build();

export { xrpl };
