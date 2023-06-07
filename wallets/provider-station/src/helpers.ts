import type { NetworkInfo } from '@terra-money/wallet-controller';
import { WalletController } from '@terra-money/wallet-controller';

export const TERRA_STATION_WALLET_ID = 'station';

const classic: NetworkInfo = {
  name: 'classic',
  chainID: 'columbus-5',
  lcd: 'https://lcd.terra.dev',
  walletconnectID: 1,
};
const mainnet: NetworkInfo = {
  name: 'mainnet',
  chainID: 'phoenix-1',
  lcd: 'https://phoenix-lcd.terra.dev',
  walletconnectID: 2,
};

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: classic,
  1: mainnet,
};

let controller: any;

export function station() {
  const terra = window.terraWallets;
  if (!controller) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    controller = new WalletController({
      defaultNetwork: mainnet,
      walletConnectChainIds,
    });
  }

  if (terra) {
    return controller;
  }

  return null;
}
