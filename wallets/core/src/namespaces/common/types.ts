import type { SpecificMethods } from '../../hub/namespace.js';
import type { NamespacesWithDiscoverMode } from '../../legacy/types.js';

export enum Namespaces {
  Solana = 'solana',
  Evm = 'evm',
  Cosmos = 'cosmos',
  Utxo = 'utxo',
  Starknet = 'starknet',
  Tron = 'tron',
}

interface NamespaceNetworkType {
  [Namespaces.Evm]: string;
  [Namespaces.Solana]: undefined;
  [Namespaces.Cosmos]: string;
  [Namespaces.Utxo]: string;
  [Namespaces.Starknet]: string;
  [Namespaces.Tron]: string;
}

export type NetworkTypeForNamespace<T extends NamespacesWithDiscoverMode> =
  T extends 'DISCOVER_MODE'
    ? string
    : T extends Namespaces
    ? NamespaceNetworkType[T]
    : never;

export type AnyFunction = (...args: any[]) => any;
export type AnyPromiseFunction = (...args: any[]) => Promise<any>;

export type AndFunction<
  T extends Record<string, AnyPromiseFunction>,
  K extends keyof T
> = (result: Awaited<ReturnType<T[K]>>) => Awaited<ReturnType<T[K]>>;

export type FunctionWithContext<T, C> = T extends (...args: infer P) => infer R
  ? (context: C, ...args: P) => R
  : never;

export type VoidReturn<T> = T extends (...args: infer P) => any
  ? (...args: P) => void
  : never;

export type Task<T extends SpecificMethods<T>> = readonly [
  keyof T,
  FunctionWithContext<T[keyof T], unknown>
];

export type TaskWithVoidReturn<T extends SpecificMethods<T>> = readonly [
  keyof T,
  VoidReturn<FunctionWithContext<T[keyof T], any>>
];

type CaipNamespace = string;
type CaipChainId = string;
type CaipAccountAddress = string;

export type CaipAccount =
  `${CaipNamespace}:${CaipChainId}:${CaipAccountAddress}`;

export type Accounts = CaipAccount[];
export type AccountsWithActiveChain = {
  accounts: Accounts;
  network: string;
};

export interface CommonActions {
  init: () => void;
}

export interface AutoImplementedActionsByRecommended {
  disconnect: () => void;
}
