import { type ConnectEvent, isTonAddressItemReply } from './types.js';

export function myTonWallet() {
  return window.mytonwallet?.tonconnect ?? null;
}

export async function getTonCoreModule() {
  const tonCore = await import('@ton/core');
  return tonCore;
}

export async function parseAddress(rawAddress: string): Promise<string> {
  const tonCore = await getTonCoreModule();
  return tonCore.Address.parse(rawAddress).toString({ bounceable: false });
}

export async function getAccounts(
  event: ConnectEvent
): Promise<string[] | null> {
  if ('items' in event.payload) {
    const accountPromises = event.payload.items
      ?.filter(isTonAddressItemReply)
      .map(async (item) => parseAddress(item.address));
    return Promise.all(accountPromises);
  }
  return null;
}
