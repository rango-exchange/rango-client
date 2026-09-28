import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import {
  CONNECTION_ERROR_MESSAGES,
  ConnectionErrorType,
  getErrorMessage,
  isUserRejectionError,
  WalletConnectionError,
} from '@hub3js/std/utils';
import { type TronActions, utils } from '@hub3js/tron';
import { actions, builders } from '@hub3js/tron';

import { tronActions } from '../actions/tron.js';
import { tronBuilders } from '../builders/tron.js';
import { TronOKRequestCode, WALLET_ID } from '../constants.js';
import { tronBitget } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = tronBuilders
  .changeAccountSubscriber(tronBitget)
  .build();

const connect = builders
  .connect()
  .action(async () => {
    try {
      const instance = tronBitget();
      const accountsResult = await instance.request({
        method: 'tron_requestAccounts',
      });
      if (!accountsResult) {
        throw new Error('Please unlock your Bitget extension first.');
      }

      if (
        !!accountsResult?.code &&
        !!accountsResult.message &&
        accountsResult.code !== TronOKRequestCode
      ) {
        throw new Error(accountsResult.message);
      }
      return utils.formatAccountsToCAIP([
        instance.tronWeb.defaultAddress.base58,
      ]);
    } catch (error) {
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

const disconnect = commonBuilders
  .disconnect<TronActions>()
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(tronActions.canEagerConnectAction)
  .build();

const getAllowance = builders
  .getAllowance()
  .action(actions.getAllowance(tronBitget))
  .build();

const buildApproveTransaction = builders
  .buildApproveTransaction()
  .action(actions.buildApproveTransaction(tronBitget))
  .build();

const getTransactionInfo = builders
  .getTransactionInfo()
  .action(actions.getTransactionInfo(tronBitget))
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
