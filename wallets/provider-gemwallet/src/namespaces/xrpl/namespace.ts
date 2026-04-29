import type { XRPLActions } from '@rango-dev/wallets-core/namespaces/xrpl';

import { getAddress } from '@gemwallet/api';
import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { builders, utils } from '@rango-dev/wallets-core/namespaces/xrpl';
import { Client } from 'xrpl';

import { WALLET_ID, XRPL_PUBLIC_SERVER } from '../../constants.js';

import { changeAccountSubscriberBuilder } from './hooks.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  changeAccountSubscriberBuilder();

const connect = builders
  .connect()
  .action(async function () {
    const response = await getAddress();

    if (response.type === 'reject') {
      throw new Error('User has rejected the request.');
    }
    if (!response.result?.address) {
      throw new Error(`Couldn't access to your wallet address.`);
    }

    return [utils.formatAddressToCAIP(response.result.address)];
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const accountLines = new ActionBuilder<XRPLActions, 'accountLines'>(
  'accountLines'
)
  .action(async (_, account, options) => {
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
const disconnect = commonBuilders
  .disconnect<XRPLActions>()
  .after(changeAccountCleanup)
  .build();
export const namespace = new NamespaceBuilder<XRPLActions>('XRPL', WALLET_ID)
  .action(connect)
  .action(accountLines)
  .action(disconnect)
  .build();
