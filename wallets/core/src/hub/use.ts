// Some helpers to simplify the code.

import type { Context } from './namespace';
import type { EvmActions } from '../namespaces/evm/types';
import type { SolanaActions } from '../namespaces/solana/types';

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
