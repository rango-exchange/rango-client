import type { SuiActions } from './types.js';

import { ActionBuilder } from '../../mod.js';
import { CAIP } from '../../utils/mod.js';
import {
  type CaipAccount,
  connectAndUpdateStateForSingleNetwork,
  intoConnecting,
  intoConnectionFinished,
} from '../common/mod.js';

import { CAIP_NAMESPACE, CAIP_SUI_CHAIN_ID } from './constants.js';
import { getInstanceOrThrow } from './utils.js';

interface ConnectParams {
  name: string;
}

export const connect = (params: ConnectParams) =>
  new ActionBuilder<SuiActions, 'connect'>('connect')
    .action(async function () {
      const wallet = getInstanceOrThrow(params.name);
      const features = wallet.features;

      const result = await features['standard:connect'].connect();

      const accounts = result.accounts.map((account) => {
        return CAIP.AccountId.format({
          address: account.address,
          chainId: {
            namespace: CAIP_NAMESPACE,
            reference: CAIP_SUI_CHAIN_ID,
          },
        }) as CaipAccount;
      });

      return accounts;
    })
    .and(connectAndUpdateStateForSingleNetwork)
    .before(intoConnecting)
    .after(intoConnectionFinished);

export const canEagerConnect = () =>
  new ActionBuilder<SuiActions, 'canEagerConnect'>('canEagerConnect');
