export type Provider = Map<string, unknown>;
export function trustWallet() {
  const { trustwallet } = window;

  if (!!trustwallet && (trustwallet?.isTrust || trustwallet?.isTrustWallet)) {
    return trustwallet;
  }
  return null;
}
