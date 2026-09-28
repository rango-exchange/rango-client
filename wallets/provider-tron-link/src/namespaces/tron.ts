import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  CONNECTION_ERROR_MESSAGES,
  getErrorMessage,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { type TronActions, utils } from '@hub3js/tron';
import { actions, builders } from '@hub3js/tron';

import { tronActions } from '../actions/tron.js';
import { tronBuilders } from '../builders/tron.js';
import { WALLET_ID } from '../constants.js';
import { classifyTronLinkConnectionError, tronTronlink } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = tronBuilders
  .changeAccountSubscriber(tronTronlink)
  .build();

const connect = builders
  .connect()
  .action(async () => {
    try {
      const instance = tronTronlink();
      const accounts: string[] = await instance.request({
        method: 'eth_requestAccounts',
      });
      return utils.formatAccountsToCAIP(accounts);
    } catch (error) {
      const type = classifyTronLinkConnectionError(error);
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

const canEagerConnect = builders
  .canEagerConnect()
  .action(tronActions.canEagerConnectAction)
  .build();

const disconnect = commonBuilders
  .disconnect<TronActions>()
  .after(changeAccountCleanup)
  .build();

const getAllowance = builders
  .getAllowance()
  .action(actions.getAllowance(tronTronlink))
  .build();

const buildApproveTransaction = builders
  .buildApproveTransaction()
  .action(actions.buildApproveTransaction(tronTronlink))
  .build();

const getTransactionInfo = builders
  .getTransactionInfo()
  .action(actions.getTransactionInfo(tronTronlink))
  .build();

const tron = new NamespaceBuilder<TronActions>('Tron', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .action(getAllowance)
  .action(buildApproveTransaction)
  .action(getTransactionInfo)
  .build();

export { tron };
