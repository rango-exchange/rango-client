import type { NamespaceInputForConnect } from './types.js';

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

export function isEvmNamespace(
  namespace: NamespaceInputForConnect
): namespace is NamespaceInputForConnect<'EVM'> {
  return namespace.namespace === 'EVM';
}
