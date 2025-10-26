import type { XRPLActions } from '@rango-dev/wallets-core/namespaces/xrpl';

import { getAddress } from '@gemwallet/api';
import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders, utils } from '@rango-dev/wallets-core/namespaces/xrpl';
import { Client } from 'xrpl';

import { WALLET_ID, XRPL_PUBLIC_SERVER } from '../../constants.js';
import { checkInstallationOnLoad } from '../../utils.js';

import { changeAccountSubscriberBuilder } from './hooks.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  changeAccountSubscriberBuilder();

const connect = builders
  .connect()
  .action(async function () {
    const response = await getAddress();
    if (!response.result?.address) {
      throw new Error(`Couldn't access to your wallet address.`);
    }

    return [utils.formatAddressToCAIP(response.result.address)];
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .build();

const canEagerConnect = new ActionBuilder<XRPLActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(async () => {
    const isInstalled = await checkInstallationOnLoad();
    if (!isInstalled) {
      throw new Error(
        'Trying to eagerly connect to your EVM wallet, but seems its instance is not available.'
      );
    }

    try {
      const response = await getAddress();
      const address = response.result?.address;

      return !!address;
    } catch {
      return false;
    }
  })
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

export const namespace = new NamespaceBuilder<XRPLActions>('XRPL', WALLET_ID)
  .action(connect)
  .action(canEagerConnect)
  .action(accountLines)
  .build();
