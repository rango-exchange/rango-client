import type { LegacyProviderInterface } from '@arlert-dev/wallets-core/legacy';
import type { BlockchainMeta, GenericSigner } from 'rango-types';
import type { EvmTransaction } from 'rango-types/mainApi';

import { DefaultSignerFactory, TransactionType } from 'rango-types';

export const legacyAddress = '0x000000000000000000000000000000000000dead';

export class MockEvmSigner implements GenericSigner<EvmTransaction> {
  async signMessage(
    _msg: string,
    _address: string,
    _chainId: string | null
  ): Promise<string> {
    return '0x';
  }
  async signAndSendTx(
    _tx: EvmTransaction,
    _address: string,
    _chainId: string | null
  ): Promise<{ hash: string; response?: any }> {
    return {
      hash: '0x',
    };
  }
}

export const legacyProvider: LegacyProviderInterface = {
  config: {
    type: 'legacy-garbage',
  },
  async connect({ network }) {
    // we added a timeout to simulate requesting to extension for connection.
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        // This is useful for simulating error scenarios.
        if (network === 'When Airdrop?') {
          reject(
            'please stay tuned we shall announce the detailed information soon.'
          );
        } else {
          resolve([
            {
              accounts: [legacyAddress],
              chainId: network || '',
            },
          ]);
        }
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      }, 10);
    });
  },
  getInstance() {
    return {};
  },
  async getSigners() {
    const signers = new DefaultSignerFactory();
    signers.registerSigner(TransactionType.EVM, new MockEvmSigner());
    return signers;
  },
  getWalletInfo() {
    return {
      name: 'legacy garbage wallet',
      color: '#000',
      img: 'https://...',
      installLink: 'https://...',
      supportedChains: [],
    };
  },
};

export const blockchainsMeta: BlockchainMeta[] = [
  {
    name: 'BTC',
    defaultDecimals: 8,
    addressPatterns: [
      '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1)[0-9A-Za-z]{39,59}$',
    ],
    feeAssets: [
      {
        blockchain: 'BTC',
        symbol: 'BTC',
        address: null,
      },
    ],
    logo: 'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/BTC/icon.svg',
    displayName: 'Bitcoin',
    shortName: 'BTC',
    sort: 12,
    color: '#F7931A',
    enabled: true,
    type: TransactionType.TRANSFER,
    chainId: null,
    info: {
      infoType: 'TransferMetaInfo',
      blockExplorerUrls: ['https://www.blockchain.com/btc/'],
      addressUrl: 'https://www.blockchain.com/btc/address/{wallet}',
      transactionUrl: 'https://www.blockchain.com/btc/tx/{txHash}',
    },
  },
  {
    name: 'ETH',
    defaultDecimals: 18,
    addressPatterns: ['^(0x)[0-9A-Fa-f]{40}$'],
    feeAssets: [
      {
        blockchain: 'ETH',
        symbol: 'ETH',
        address: null,
      },
    ],
    logo: 'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/ETH/icon.svg',
    displayName: 'Ethereum',
    shortName: 'ETH',
    sort: 0,
    color: '#ecf0f1',
    enabled: true,
    type: TransactionType.EVM,
    chainId: '0x1',
    info: {
      infoType: 'EvmMetaInfo',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://rpc.ankr.com/eth'],
      blockExplorerUrls: ['https://etherscan.io'],
      addressUrl: 'https://etherscan.io/address/{wallet}',
      transactionUrl: 'https://etherscan.io/tx/{txHash}',
      enableGasV2: true,
    },
  },
  {
    name: 'SOLANA',
    defaultDecimals: 9,
    addressPatterns: ['^[1-9A-HJ-NP-Za-km-z]{32,44}$'],
    feeAssets: [
      {
        blockchain: 'SOLANA',
        symbol: 'SOL',
        address: null,
      },
    ],
    logo: 'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/SOLANA/icon.svg',
    displayName: 'Solana',
    shortName: 'Solana',
    sort: 20,
    color: '#708DD2',
    enabled: true,
    type: TransactionType.SOLANA,
    chainId: 'mainnet-beta',
    info: {
      infoType: 'SolanaMetaInfo',
      blockExplorerUrls: ['https://solscan.io/'],
      addressUrl: 'https://solscan.io/account/{wallet}',
      transactionUrl: 'https://solscan.io/tx/{txHash}',
    },
  },
  {
    name: 'COSMOS',
    defaultDecimals: 6,
    addressPatterns: ['^(cosmos1)[0-9a-z]{38}$'],
    feeAssets: [
      {
        blockchain: 'COSMOS',
        symbol: 'ATOM',
        address: null,
      },
    ],
    logo: 'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/COSMOS/icon.svg',
    displayName: 'Cosmos',
    shortName: 'Cosmos',
    sort: 15,
    color: '#2E3148',
    enabled: true,
    type: TransactionType.COSMOS,
    chainId: 'cosmoshub-4',
    info: {
      infoType: 'CosmosMetaInfo',
      experimental: false,
      rpc: 'https://cosmos-rpc.polkachu.com',
      rest: 'https://lcd-cosmoshub.blockapsis.com',
      cosmostationLcdUrl: 'https://lcd-cosmoshub.blockapsis.com',
      cosmostationApiUrl: 'https://cosmos-rpc.polkachu.com',
      cosmostationDenomTracePath: '/ibc/apps/transfer/v1/denom_traces/',
      mintScanName: 'cosmos',
      chainName: 'Cosmos',
      stakeCurrency: {
        coinDenom: 'ATOM',
        coinMinimalDenom: 'uatom',
        coinDecimals: 6,
        coinGeckoId: 'cosmos',
        coinImageUrl: '/tokens/blockchain/cosmos.svg',
      },
      bip44: {
        coinType: 118,
      },
      bech32Config: {
        bech32PrefixAccAddr: 'cosmos',
        bech32PrefixAccPub: 'cosmospub',
        bech32PrefixValAddr: 'cosmosvaloper',
        bech32PrefixValPub: 'cosmosvaloperpub',
        bech32PrefixConsAddr: 'cosmosvalcons',
        bech32PrefixConsPub: 'cosmosvalconspub',
      },
      currencies: [
        {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: '/tokens/blockchain/cosmos.svg',
        },
      ],
      feeCurrencies: [
        {
          coinDenom: 'ATOM',
          coinMinimalDenom: 'uatom',
          coinDecimals: 6,
          coinGeckoId: 'cosmos',
          coinImageUrl: '/tokens/blockchain/cosmos.svg',
        },
      ],
      features: ['stargate', 'ibc-transfer'],
      explorerUrlToTx: 'https://www.mintscan.io/cosmos/txs/{txHash}',
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
      blockExplorerUrls: ['https://www.mintscan.io/cosmos/'],
      addressUrl: 'https://www.mintscan.io/cosmos/account/{wallet}',
      transactionUrl: 'https://www.mintscan.io/cosmos/txs/{txHash}',
    },
  },
];
