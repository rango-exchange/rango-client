type CaipNamespace = string;
type CaipChainId = string;
type CaipAccountAddress = string;

export type CaipAccount =
  `${CaipNamespace}:${CaipChainId}:${CaipAccountAddress}`;

export type Accounts = CaipAccount[];
export type AccountsWithDerivationPath = {
  accounts: Accounts;
  derivationPath?: string;
};
export type AccountsWithActiveChain = {
  accounts: Accounts;
  network: string;
} & AccountsWithDerivationPath;
