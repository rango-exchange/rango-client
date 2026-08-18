import type { ProviderMetadata } from '@hub3js/core';

import {
  CAIP_ARBITRUM_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
  CAIP_BOBA_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_CRONOS_CHAIN_ID,
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_FANTOM_CHAIN_ID,
  CAIP_GNOSIS_CHAIN_ID,
  CAIP_HARMONY_CHAIN_ID,
  CAIP_MOONBEAM_CHAIN_ID,
  CAIP_MOONRIVER_CHAIN_ID,
  CAIP_OPTIMISM_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  isEvmNamespace,
} from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';
import { isSuiNamespace } from '@hub3js/sui';
import { isTvmNamespace } from '@hub3js/tvm';
import { isTronNamespace } from '@rango-dev/wallets-core/namespaces/tron';
import {
  CAIP_BITCOIN_CHAIN_ID,
  isUtxoNamespace,
} from '@rango-dev/wallets-core/namespaces/utxo';

import getSigners from './signer.js';
import { getInstanceOrThrow } from './utils.js';

export const WALLET_ID = 'okx';

export const TON_CONNECT_PROTOCOL_VERSION = 2;
export const TON_CONNECT_USER_REJECTED_CODE = 300;

export const TRON_OK_REQUEST_CODE = 200;
// EIP-1193 user-rejected-request code returned by `tron_requestAccounts`.
export const TRON_USER_REJECTION_CODE = 4001;

export const WALLET_NAME_IN_WALLET_STANDARD = 'OKX Wallet';

export const EVM_SUPPORTED_CHAINS = [
  CAIP_ETHEREUM_CHAIN_ID,
  CAIP_BSC_CHAIN_ID,
  CAIP_POLYGON_CHAIN_ID,
  CAIP_FANTOM_CHAIN_ID,
  CAIP_ARBITRUM_CHAIN_ID,
  CAIP_OPTIMISM_CHAIN_ID,
  CAIP_CRONOS_CHAIN_ID,
  CAIP_BOBA_CHAIN_ID,
  CAIP_GNOSIS_CHAIN_ID,
  CAIP_MOONBEAM_CHAIN_ID,
  CAIP_MOONRIVER_CHAIN_ID,
  CAIP_HARMONY_CHAIN_ID,
  CAIP_AVAX_CHAIN_ID,
];

export const metadata: ProviderMetadata = {
  name: 'OKX',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/okx/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    brave:
      'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/okexwallet',
    homepage: 'https://www.okx.com/web3',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'EVM',
            value: 'EVM',
            id: 'ETH',
            isChainSupported: (chainId: string) =>
              isEvmNamespace(chainId) &&
              EVM_SUPPORTED_CHAINS.includes(
                getChainIdFromCaip2ChainId(chainId)
              ),
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            isChainSupported: isSolanaNamespace,
          },
          {
            label: 'BTC',
            value: 'UTXO',
            id: 'BTC',
            isChainSupported: (chainId: string) =>
              isUtxoNamespace(chainId) &&
              getChainIdFromCaip2ChainId(chainId) === CAIP_BITCOIN_CHAIN_ID,
          },
          {
            label: 'Ton',
            value: 'Ton',
            id: 'TON',
            isChainSupported: isTvmNamespace,
          },
          {
            label: 'Tron',
            value: 'Tron',
            id: 'TRON',
            isChainSupported: isTronNamespace,
          },
          {
            label: 'Sui',
            value: 'Sui',
            id: 'SUI',
            isChainSupported: isSuiNamespace,
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners(getInstanceOrThrow()) },
    },
  ],
};
