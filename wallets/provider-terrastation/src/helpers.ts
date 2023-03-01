import { NetworkInfo, WalletController } from '@terra-money/wallet-controller';

export const TERRA_STATION_WALLET_ID = 'station';

const testnet: any = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};
const mainnet: any = {
  name: 'mainnet',
  chainID: 'columbus-5',
  lcd: 'https://lcd.terra.dev',
};

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: testnet,
  1: mainnet,
};

let controller: any;

export function terraStation() {
  const terra = window.terraWallets;
  if (!controller) {
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
