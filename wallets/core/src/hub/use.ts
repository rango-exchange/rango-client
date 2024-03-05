// Some helpers to simplify the code.

import type { Context } from './blockchain';

// TODO: it should be imported.
type ConnectResult = string[];

export function useConnect(this: Context, accounts: ConnectResult) {
  console.log({ accounts, uThis: this });
  // TODO: Address Verification (CAIP)
  const [, setState] = this.state();
  setState('accounts', accounts);
  return accounts;
}

export const evm = [{ name: 'connect', cb: useConnect }];
