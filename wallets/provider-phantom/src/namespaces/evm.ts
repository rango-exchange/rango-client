import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { NamespaceBuilder } from '@rango-dev/wallets-core';
import { utils } from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  after,
  and,
  before,
} from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmPhantom } from '../legacy/helpers.js';

const evm = new NamespaceBuilder<EvmActions>()
  .config('namespace', 'evm')
  .config('providerId', WALLET_ID)
  .action('init', () => {
    console.log('[phantom]init called from evm cb');
  })
  .action([...actions.recommended, actions.connect(evmPhantom)])
  .subscriber(actions.changeAccountSubscriber(evmPhantom))
  .use(and.recommended)
  .build();

utils.apply('before', before.recommended, evm);
utils.apply('after', after.recommended, evm);

export { evm };
