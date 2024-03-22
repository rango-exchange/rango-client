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

export type RemoveThisParameter<T> = {
  [K in keyof T]: T[K] extends (this: any, ...args: infer P) => infer R
    ? (...args: P) => R
    : T[K];
};

export type AddThisParameter<T, C> = {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? (this: C, ...args: P) => R
    : T[K];
};

export type AnyFunction = (...args: any[]) => any;
