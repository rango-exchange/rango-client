import { WalletsAndSupportedChains } from "@rangodev/wallets-core";
import {
  BlockchainMeta,
  CosmosBlockchainMeta,
  EvmBlockchainMeta,
  GenericTransactionType,
  Network,
  SolanaBlockchainMeta,
  WalletType,
} from "@rangodev/wallets-shared";

export const API_URL = "https://api.rango.exchange";
export const API_KEY = "c6381a79-2817-4602-83bf-6a641a409e32";

export const WALLET_LINKS = {
  [WalletType.XDEFI]:
    "https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf",
  [WalletType.META_MASK]:
    "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en",
  [WalletType.TRUST_WALLET]:
    "https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph/",
  [WalletType.TERRA_STATION]:
    "https://chrome.google.com/webstore/detail/terra-station/aiifbnbfobpmeekipheeijimdpnlpgpp",
  [WalletType.KEPLR]:
    "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap",
  [WalletType.BINANCE_CHAIN]:
    "https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp",
  [WalletType.LEAP]:
    "https://chrome.google.com/webstore/detail/leap-wallet/aijcbedoijmgnlmjeegjaglmepbmpkpi",
  [WalletType.PHANTOM]:
    "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa",
  [WalletType.COIN98]:
    "https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg",
  [WalletType.COINBASE]:
    "https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
  [WalletType.MATH]:
    "https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc",
  [WalletType.EXODUS]:
    "https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno",
  [WalletType.SAFEPAL]:
    "https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa",
  [WalletType.TOKEN_POCKET]:
    "https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii",
  [WalletType.COSMOSTATION]:
    "https://chrome.google.com/webstore/detail/cosmostation/fpkhgmpbidmiogeglndfbkegfdlnajnf",
  [WalletType.CLOVER]:
    "https://chrome.google.com/webstore/detail/clover-wallet/nhnkbkgjikgcigadomkphalanndcapjk",
  [WalletType.BRAVE]: "https://brave.com/wallet/",
  [WalletType.OKX]:
    "https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge",
};

const BTC = Network.BTC;
const BSC = Network.BSC;
const LTC = Network.LTC;
const THORCHAIN = Network.THORCHAIN;
const BCH = Network.BCH;
const BINANCE = Network.BINANCE;
const ETHEREUM = Network.ETHEREUM;
const POLYGON = Network.POLYGON;
const TRON = Network.TRON;
const HARMONY = Network.HARMONY;
const AVAX_CCHAIN = Network.AVAX_CCHAIN;
const FANTOM = Network.FANTOM;
const MOONBEAM = Network.MOONBEAM;
const ARBITRUM = Network.ARBITRUM;
const BOBA = Network.BOBA;
const OPTIMISM = Network.OPTIMISM;
const CRONOS = Network.CRONOS;
const SOLANA = Network.SOLANA;
const MOONRIVER = Network.MOONRIVER;
const GNOSIS = Network.GNOSIS;
const BNB_SYMBOL = "BNB";

const XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS = [
  BTC,
  LTC,
  THORCHAIN,
  BCH,
  BINANCE,
];
const BINANCE_CHAIN_WALLET_SUPPORTED_CHAINS = [ETHEREUM, BSC, BINANCE];
const EXODUS_WALLET_SUPPORTED_CHAINS = [
  SOLANA,
  ETHEREUM,
  BSC,
  POLYGON,
  AVAX_CCHAIN,
  BNB_SYMBOL,
];
const OKX_WALLET_SUPPORTED_CHAINS = [
  ETHEREUM,
  BTC,
  BSC,
  TRON,
  SOLANA,
  POLYGON,
  FANTOM,
  ARBITRUM,
  OPTIMISM,
  CRONOS,
  BOBA,
  GNOSIS,
  MOONBEAM,
  MOONRIVER,
  HARMONY,
  LTC,
  AVAX_CCHAIN,
];
const SUPPORTED_ETH_CHAINS = [
  POLYGON,
  ETHEREUM,
  BSC,
  AVAX_CCHAIN,
  FANTOM,
  ARBITRUM,
];

export const isEvmBlockchain = (
  blockchainMeta
): blockchainMeta is EvmBlockchainMeta =>
  blockchainMeta.type === GenericTransactionType.EVM;

export const isCosmosBlockchain = (
  blockchainMeta
): blockchainMeta is CosmosBlockchainMeta =>
  blockchainMeta.type === GenericTransactionType.COSMOS;

export const isSolanaBlockchain = (
  blockchainMeta
): blockchainMeta is SolanaBlockchainMeta =>
  blockchainMeta.type === GenericTransactionType.SOLANA;

export const walletsAndSupportedChains = ({
  allBlockChains,
}: {
  allBlockChains: BlockchainMeta[];
}): WalletsAndSupportedChains => {
  const evmBlockchains = allBlockChains.filter(isEvmBlockchain);
  const solanaBlockchain = allBlockChains.filter(isSolanaBlockchain);
  const cosmosBlockchains = allBlockChains.filter(isCosmosBlockchain);
  return {
    [WalletType.BINANCE_CHAIN]: allBlockChains.filter((blockchainMeta) =>
      BINANCE_CHAIN_WALLET_SUPPORTED_CHAINS.includes(
        blockchainMeta.name as Network
      )
    ),
    [WalletType.META_MASK]: evmBlockchains,
    [WalletType.COINBASE]: [...evmBlockchains, ...solanaBlockchain],
    [WalletType.KEPLR]: cosmosBlockchains.filter(
      (blockchainMeta) => !!blockchainMeta.info
    ),
    [WalletType.PHANTOM]: solanaBlockchain,
    [WalletType.XDEFI]: allBlockChains.filter((blockchainMeta) =>
      [
        ...SUPPORTED_ETH_CHAINS,
        ...XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
        Network.SOLANA,
      ].includes(blockchainMeta.name as Network)
    ),
    [WalletType.WALLET_CONNECT]: evmBlockchains,
    [WalletType.TRUST_WALLET]: evmBlockchains,
    [WalletType.COIN98]: [...evmBlockchains, ...solanaBlockchain],
    [WalletType.OKX]: allBlockChains.filter((blockchainMeta) =>
      OKX_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name as Network)
    ),

    [WalletType.EXODUS]: allBlockChains.filter((blockchainMeta) =>
      EXODUS_WALLET_SUPPORTED_CHAINS.includes(blockchainMeta.name)
    ),

    [WalletType.TOKEN_POCKET]: evmBlockchains,
    [WalletType.TERRA_STATION]: [],
    [WalletType.LEAP]: [],
    [WalletType.MATH]: [...evmBlockchains, ...solanaBlockchain],
    [WalletType.SAFEPAL]: [...evmBlockchains, ...solanaBlockchain],
    [WalletType.CLOVER]: [...evmBlockchains, ...solanaBlockchain],
    [WalletType.COSMOSTATION]: [
      ...evmBlockchains,
      ...cosmosBlockchains.filter((blockchainMeta) => !!blockchainMeta.info),
    ],
    [WalletType.BRAVE]: [...evmBlockchains, ...solanaBlockchain],
    [WalletType.UNKNOWN]: [],
  };
};
