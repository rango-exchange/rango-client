/**
 * WalletConnect protocol constants shared across the hub path (session/,
 * adapter/, signers/, namespaces/). Kept separate from `constants.ts` (which
 * holds the hub provider identity/metadata) so this module stays a dependency
 * leaf and importing it never pulls in the signer/provider graph (the
 * `WalletConnectNamespace` import below is type-only, so it is erased at runtime).
 */
import type { WalletConnectNamespace } from './types.js';

export const PING_TIMEOUT = 10_000;

export enum NAMESPACES {
  ETHEREUM = 'eip155',
  BITCOIN = 'bip122',
  POLKADOT = 'polkadot',
  CARDANO = 'cip34',
  ERLOND = 'elrond',
  MULTIVERSX = 'multiversx',
}

/**
 * Single source of truth for the namespace-alias -> CAIP-2 prefix relationship
 * (`evm -> eip155`, `utxo -> bip122`). `proposals` and `lookup` read from this
 * instead of re-encoding it. `Record<WalletConnectNamespace, …>` makes a new
 * alias a compile error until it's mapped.
 */
export const WC_NAMESPACE_TO_CAIP: Record<WalletConnectNamespace, string> = {
  evm: NAMESPACES.ETHEREUM,
  utxo: NAMESPACES.BITCOIN,
};

export const CHAIN_ID_STORAGE = 'wc@2:client//namespaces';

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

// Reference: https://docs.reown.com/advanced/multichain/rpc-reference/bitcoin-rpc
export enum BitcoinRPCMethods {
  SIGN_PSBT = 'signPsbt',
  GET_ACCOUNT_ADDRESSES = 'getAccountAddresses',
  SIGN_MESSAGE = 'signMessage',
  SEND_TRANSFER = 'sendTransfer',
}

export enum BitcoinEvents {
  ADDRESSES_CHANGED = 'bip122_addressesChanged',
}

export const DEFAULT_BITCOIN_EVENTS: BitcoinEvents[] = [
  BitcoinEvents.ADDRESSES_CHANGED,
];

export const DEFAULT_BITCOIN_METHODS = [
  BitcoinRPCMethods.SIGN_PSBT,
  BitcoinRPCMethods.GET_ACCOUNT_ADDRESSES,
];

export const DEFAULT_APP_METADATA = {
  name: 'Rango Exchange',
  description: 'The Ultimate Cross-Chain Solution',
  url: 'https://app.rango.exchange/',
  icons: ['https://app.rango.exchange/logo-rounded.png'],
};

export const RELAY_URL = 'wss://relay.walletconnect.com';
