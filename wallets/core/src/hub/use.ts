// Some helpers to simplify the code.

import type { Context } from './namespace';
import type { EvmActions } from '../actions/evm/interface';
import type { SolanaActions } from '../actions/solana/interface';

// TODO: it should be imported.
type ConnectResult = string[];

export function useConnect(context: Context, accounts: ConnectResult) {
  console.log({ accounts, uThis: context });
  // TODO: Address Verification (CAIP)
  const [, setState] = context.state();
  setState('accounts', accounts);
  return accounts;
}

export const evm: { name: keyof EvmActions; cb: any }[] = [
  { name: 'connect', cb: useConnect },
];

export const solana: { name: keyof SolanaActions; cb: any }[] = [
  { name: 'connect', cb: useConnect },
];
