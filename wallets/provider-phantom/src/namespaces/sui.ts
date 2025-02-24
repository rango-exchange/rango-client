import type { CaipAccount } from '@rango-dev/wallets-core/namespaces/common';
import type {
  ProviderAPI,
  SuiActions,
} from '@rango-dev/wallets-core/namespaces/sui';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { builders as commonBuilders } from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  CAIP_NAMESPACE,
  CAIP_SUI_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/sui';
import { CAIP } from '@rango-dev/wallets-core/utils';

import { WALLET_ID } from '../constants.js';
import { suiPhantom } from '../utils.js';

async function getSuiAccount({ instance }: { instance: ProviderAPI }) {
  // Asking for account from wallet if not connected or no public key available.
  const solanaResponse = await instance.requestAccount();
  const account = solanaResponse.address;

  // TODO: do we need to throe error on empty string?

  return account;
}

const [changeAccountSubscriber, changeAccountCleanup] =
  actions.changeAccountSubscriber(suiPhantom);

const connect = builders
  .connect()
  .action(async function () {
    const suiInstance = suiPhantom();
    const result = await getSuiAccount({
      instance: suiInstance,
    });

    console.log({ result });

    return [
      CAIP.AccountId.format({
        address: result,
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: CAIP_SUI_CHAIN_ID,
        },
      }) as CaipAccount,
    ];
  })
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .build();

const disconnect = commonBuilders
  .disconnect<SuiActions>()
  .after(changeAccountCleanup)
  .build();

const sui = new NamespaceBuilder<SuiActions>('Sui', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .build();

export { sui };
