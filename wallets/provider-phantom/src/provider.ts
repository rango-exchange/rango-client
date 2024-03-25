import { ProviderBuilder } from '@rango-dev/wallets-core';

import { info, WALLET_ID } from './constants';
import { phantom as phantomInstance } from './legacy/helpers';
import { solana } from './namespaces/solana';

const provider = new ProviderBuilder(WALLET_ID)
  .init(function () {
    const [, setState] = this.state();

    if (phantomInstance()) {
      setState('installed', true);
      console.debug('[phantom] instance detected.', this);
    }
  })
  .config('info', info)
  .add('solana', solana)
  .build();

export { provider };
