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

import { WALLET_ID } from '../constants.js';

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
  .build();

export { xrpl };
