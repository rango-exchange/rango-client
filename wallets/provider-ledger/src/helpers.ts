import type { ProviderConnectResult } from '@rango-dev/wallets-shared';

import AppEth from '@ledgerhq/hw-app-eth';
import TransportU2F from '@ledgerhq/hw-transport-webhid';

export const ETH_BIP32_PATH = "44'/60'/0'/0/0";

export async function getLedgerInstance() {
  const isLedgerSupported = await TransportU2F.isSupported();

  if (isLedgerSupported) {
    const transport = await TransportU2F.create();

    const eth = new AppEth(transport);
    return { eth, transport };
  }

  return null;
}

export async function getLedgerAccounts(
  instance: any
): Promise<ProviderConnectResult[]> {
  const accounts = [];

  try {
    const address = await instance.eth?.getAddress(ETH_BIP32_PATH, false, true);
    accounts.push(address.address);
  } catch (error) {
    console.log(error);
  }
  console.log(accounts);

  return [];
}
