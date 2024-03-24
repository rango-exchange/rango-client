// TODO: I guess TS could evaluate a pattern on string as well.
export type Accounts = string[];
export interface EvmActions {
  // TODO: it's disabling `action` type infer.

  // [k: string]: (...args: any[]) => any;
  init: () => void;
  connect: (chain: string) => Accounts;
  disconnect: (chain: string) => void;
  suggest: (chain: string) => void;
}

export type AnyFunction = (...args: any[]) => any;

export type FunctionWithContext<T, C> = T extends (...args: infer P) => infer R
  ? (context: C, ...args: P) => R
  : never;
