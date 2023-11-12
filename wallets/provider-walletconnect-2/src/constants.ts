import { Networks } from '@rango-dev/wallets-shared';

export const DEFAULT_NETWORK = Networks.ETHEREUM;
export const PING_TIMEOUT = 10_000;

export enum NAMESPACES {
  ETHEREUM = 'eip155',
  SOLANA = 'solana',
  COSMOS = 'cosmos',
  POLKADOT = 'polkadot',
  CARDANO = 'cip34',
  ERLOND = 'elrond',
  MULTIVERSX = 'multiversx',
}

export const CHAIN_ID_STORAGE = 'wc@2:client//namespaces';

// Refrence: https://docs.walletconnect.com/2.0/advanced/rpc-reference/solana-rpc
export enum SolanaRPCMethods {
  GET_ACCOUNTS = 'solana_getAccounts',
  REQUEST_ACCOUNTS = 'solana_requestAccounts',
  SIGN_TRANSACTION = 'solana_signTransaction',
  SIGN_MESSAGE = 'solana_signMessage',
}

// Refrence: https://docs.walletconnect.com/2.0/advanced/rpc-reference/cosmos-rpc
export enum CosmosRPCMethods {
  GET_ACCOUNTS = 'cosmos_getAccounts',
  SIGN_DIRECT = 'cosmos_signDirect',
  SIGN_AMINO = 'cosmos_signAmino',
}

// Refrence: https://docs.walletconnect.com/2.0/advanced/rpc-reference/ethereum-rpc
export enum EthereumRPCMethods {
  PERSONAL_SIGN = 'personal_sign',
  SIGN = 'eth_sign',
  SIGN_TYPED_DATA = 'eth_signTypedData',
  SIGN_TRANSACTION = 'eth_signTransaction',
  SEND_TRANSACTION = 'eth_sendTransaction',
  SEND_RAW_TRANSACTION = 'eth_sendRawTransaction',
  SWITCH_CHAIN = 'wallet_switchEthereumChain',
  ADD_CHAIN = 'wallet_addEthereumChain',
  GET_CHAIN = 'eth_chainId',
}

export enum StarknetRPCMethods {
  REQUEST_ADD_INVOKE_TRANSACTION = 'starknet_requestAddInvokeTransaction',
  SIGN_TYPED_DATA = 'starknet_signTypedData',
}

export enum EthereumEvents {
  CHAIN_CHANGED = 'chainChanged',
  ACCOUNTS_CHANGED = 'accountsChanged',
}

export const DEFAULT_ETHEREUM_EVENTS: EthereumEvents[] = [
  EthereumEvents.CHAIN_CHANGED,
  EthereumEvents.ACCOUNTS_CHANGED,
];

export const DEFAULT_ETHEREUM_METHODS = [
  EthereumRPCMethods.PERSONAL_SIGN,
  EthereumRPCMethods.SEND_TRANSACTION,
  EthereumRPCMethods.SIGN_TRANSACTION,
  EthereumRPCMethods.SWITCH_CHAIN,
  EthereumRPCMethods.ADD_CHAIN,
  EthereumRPCMethods.GET_CHAIN,
];

export const DEFAULT_SOLANA_METHODS = [
  SolanaRPCMethods.SIGN_TRANSACTION,
  SolanaRPCMethods.SIGN_MESSAGE,
];

export const DEFAULT_COSMOS_METHODS = [
  CosmosRPCMethods.GET_ACCOUNTS,
  CosmosRPCMethods.SIGN_AMINO,
  CosmosRPCMethods.SIGN_DIRECT,
];

// refrence: https://github.com/ChainAgnostic/namespaces/blob/main/solana/caip2.md
export const DEFAULT_SOLANA_CHAIN_ID = '4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ';

export const DEFAULT_APP_METADATA = {
  name: 'Rango Exchange',
  description: 'The Ultimate Cross-Chain Solution',
  url: 'https://app.rango.exchange/',
  icons: ['https://app.rango.exchange/logo-rounded.png'],
};

export const RELAY_URL = 'wss://relay.walletconnect.com';
