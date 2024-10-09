import type {
  NamespaceInputForConnect,
  NamespaceInputWithDiscoverMode,
} from './types.js';

import { Namespace } from './types.js';

export async function eagerConnectHandler<R = unknown>(params: {
  canEagerConnect: () => Promise<boolean>;
  connectHandler: () => Promise<R>;
  providerName: string;
}) {
  // Check if we can eagerly connect to the wallet
  if (await params.canEagerConnect()) {
    // Connect to wallet as usual
    return await params.connectHandler();
  }
  throw new Error(`can't restore connection for ${params.providerName}.`);
}

export function isNamespaceDiscoverMode(
  namespace: NamespaceInputForConnect
): namespace is NamespaceInputWithDiscoverMode {
  return namespace.namespace === 'DISCOVER_MODE';
}

export function isEvmNamespace(
  namespace: NamespaceInputForConnect
): namespace is NamespaceInputForConnect<Namespace.Evm> {
  return namespace.namespace === Namespace.Evm;
}
