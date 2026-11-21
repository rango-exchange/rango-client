import type { ModeStrategy } from './types';

import { i18n } from '@lingui/core';

export const swapStrategy: ModeStrategy = {
  allowCustomTokens: true,
  blockchains: ({ store, type }) => store.blockchains({ type }),
  tokenSections: ({ store, type, blockchain, searchFor }) => [
    {
      id: 'all',
      tokens: store.tokens({
        type,
        blockchain: blockchain?.name ?? '',
        searchFor,
        getBalanceFor: store.getBalanceFor,
      }),
    },
  ],
  tokenItem: () => null,
  title: ({ store }) => store.config.title || i18n.t('Swap'),
  chainLabel: ({ blockchain }) => blockchain?.displayName || '',
};

export const refuelStrategy: ModeStrategy = {
  ...swapStrategy,
  title: ({ store }) => store.config.title || i18n.t('Refuel'),
};
