import { NetworkInfo, WalletController ,getChainOptions} from '@terra-money/wallet-controller';

export const TERRA_STATION_WALLET_ID = 'station';

const testnet: NetworkInfo = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
  walletconnectID: 0,
};
const mainnet: NetworkInfo = {
  name: 'mainnet',
  chainID: 'columbus-5',
  lcd: 'https://lcd.terra.dev',
  walletconnectID: 1,
};
const terra: NetworkInfo = {
  name: 'terra',
  chainID: 'phoenix-1',
  lcd: 'https://phoenix-lcd.terra.dev',
  walletconnectID: 2,
};

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: testnet,
  1: mainnet,
  2: terra,
};

let controller: any;

export function terraStation() {
  const terra = window.terraWallets;
  if (!controller) {
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
