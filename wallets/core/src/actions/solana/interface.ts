import type { Accounts } from '../evm/interface';

export interface SolanaActions {
  connect: () => Accounts;
}
