import { Address } from '@ton/core';

export function myTonWallet() {
  return window.mytonwallet?.tonconnect ?? null;
}

export function parseAddress(rawAddress: string): string {
  return Address.parse(rawAddress).toString({ bounceable: false });
}
