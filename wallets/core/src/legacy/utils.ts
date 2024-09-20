export async function eagerConnectHandler(params: {
  canEagerConnect: () => Promise<boolean>;
  connectHandler: () => Promise<unknown>;
  providerName: string;
}) {
  // Check if we can eagerly connect to the wallet
  if (await params.canEagerConnect()) {
    // Connect to wallet as usual
    return await params.connectHandler();
  }
  throw new Error(`can't restore connection for ${params.providerName}.`);
}
