export function trustWallet() {
  const { trustwallet } = window;
  
  if (!!trustwallet && (trustwallet?.isTrust || trustwallet?.isTrustWallet)) {
    return trustwallet;
  }
  return null;
}
