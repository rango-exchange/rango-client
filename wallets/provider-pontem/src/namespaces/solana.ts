import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';

import { NamespaceBuilder } from '@rango-dev/wallets-core';

import { WALLET_ID } from '../constants.js';

export const solana = new NamespaceBuilder<SolanaActions>(
  'Solana',
  WALLET_ID
).build();
