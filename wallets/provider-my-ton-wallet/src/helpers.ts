export function myTonWallet() {
  if (window.mytonwallet) {
    const instance = window.mytonwallet?.tonconnect;
    return instance ?? null;
  }
  return null;
}
