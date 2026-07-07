export type UserDetailsItem = {
  time: number;
  user: string;
  action: {
    type: string;
    signatureChainId: `0x${string}`;
    hyperliquidChain: 'Mainnet';
    destination: string;
    amount: string;
    time: number;
  };
  block: number;
  hash: string;
  error: null;
};

export type UserDetailsResponse = {
  type: 'userDetails';
  txs: UserDetailsItem[];
};
