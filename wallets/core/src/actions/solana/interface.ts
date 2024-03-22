import type { Accounts } from '../evm/interface';

export interface SolanaActions {
  init: () => void;
  connect: () => Accounts;
}
