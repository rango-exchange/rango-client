import type { Provider } from '@hub3js/core';
import type { DefaultNamespaces } from '@hub3js/namespaces';
import type { Token } from 'rango-sdk';
import type { BlockchainMeta } from 'rango-types';

/**
 * The part of Rango's meta the SDK reads. A full `MetaResponse` satisfies it.
 * The engine reads chain ids and switch details from `blockchains`; `confirm`
 * prices fees from `tokens` when they are there, and from the API otherwise.
 */
export type SdkMeta = {
  blockchains: BlockchainMeta[];
  tokens?: Token[];
};

/**
 * What the host lends the actions: the hub provider behind a wallet type, and
 * the chain metadata. Both are callbacks, so the host hands over what it has
 * at the time of the call and the engine never holds a stale copy.
 */
export type ActionContext = {
  getProvider: (type: string) => Provider<DefaultNamespaces> | undefined;
  getMeta: () => SdkMeta;
};
