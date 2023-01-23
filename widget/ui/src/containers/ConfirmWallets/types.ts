export type ActiveWalletsType = {
  blockchain: string;
  id: string;
  type: string;
  options: Wallet[];
};

export type Wallet = {
  walletType: string;
  address: string;
  logo: string;
};

