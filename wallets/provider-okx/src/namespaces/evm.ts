import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  utils,
} from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmOKX } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(evmOKX)
  /*
   * Okx wallet may call the `changeAccount` event with `null` value
   * but we shouldn't disconnect in this case.
   */
  .onSwitchAccount((event) => {
    if (!event.payload.length) {
      event.preventDefault();
    }
  })
  .format(async (instance, event) => {
    const chainId = await instance.request({ method: 'eth_chainId' });
    // The wallet may emit a `null` value in its `sent` event.
    return utils.formatAccountsToCAIP(event.filter(Boolean), chainId);
  })
  .build();
const connect = builders
  .connect()
  .action(actions.connect(evmOKX))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .before(() => {
    evmOKX().disconnect();
  })
  .after(changeAccountCleanup)
  .build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmOKX))
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmOKX))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .action(canSwitchNetwork)
  .action(getChainId)
  .build();

export { evm };
