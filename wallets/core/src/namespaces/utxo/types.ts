import type { Accounts } from '../../types/accounts.js';
import type {
  AutoImplementedActionsByRecommended,
  CommonActions,
} from '../common/types.js';

export interface UtxoActions
  extends AutoImplementedActionsByRecommended,
    CommonActions {
  connect: (options?: ConnectOptions) => Promise<Accounts>;
  canEagerConnect: () => Promise<boolean>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProviderAPI = Record<string, any>;

/*
 * Hardware wallets (e.g. Trezor) need to know which derivation path / address type to
 * connect. Injected UTXO wallets ignore this. Optional so existing providers are
 * unaffected.
 */
export type ConnectOptions = {
  derivationPath?: string;
};
