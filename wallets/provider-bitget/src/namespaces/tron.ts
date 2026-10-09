import { getErrorMessage, Hub3Error, NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
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
    const instance = tronBitget();
    const accountsResult = await instance.request({
      method: 'tron_requestAccounts',
    });

    if (!!accountsResult?.code && accountsResult.code !== TronOKRequestCode) {
      throw new Hub3Error(
        'PROVIDER_UNEXPECTED',
        getErrorMessage(accountsResult),
        { cause: accountsResult }
      );
    }
    return utils.formatAccountsToCAIP([instance.tronWeb.defaultAddress.base58]);
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
