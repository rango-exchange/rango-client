import type { XRPLActions } from '@hub3js/xrpl';

import { getAddress } from '@gemwallet/api';
import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { builders, utils } from '@hub3js/xrpl';
import { Client } from 'xrpl';

import { WALLET_ID, XRPL_PUBLIC_SERVER } from '../../constants.js';

import { changeAccountSubscriberBuilder } from './hooks.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  changeAccountSubscriberBuilder();

const connect = builders
  .connect()
  .action(async function () {
    try {
      const response = await getAddress();

      if (response.type === 'reject') {
        throw new WalletConnectionError('User has rejected the request.', {
          type: ConnectionErrorType.Rejected,
          cause: response,
        });
      }
      if (!response.result?.address) {
        throw new Error(`Couldn't access to your wallet address.`);
      }

      return [utils.formatAddressToCAIP(response.result.address)];
    } catch (error) {
      if (error instanceof WalletConnectionError) {
        throw error;
      }
      const type = isUserRejectionError(error)
        ? ConnectionErrorType.Rejected
        : ConnectionErrorType.Unknown;
      throw new WalletConnectionError(
        getErrorMessage(error) ?? CONNECTION_ERROR_MESSAGES[type],
        { type, cause: error }
      );
    }
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
