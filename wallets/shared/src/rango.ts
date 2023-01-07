export const IS_DEV =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getBlockChainNameFromId = (
  chainId: string | number,
  blockchains: BlockchainMeta[]
): Network | null => {
  chainId =
    typeof chainId === 'string' && chainId.startsWith('0x')
      ? parseInt(chainId)
      : chainId;

  // Sometimes providers are passing `Network` as chainId.
  // If chainId is a `Network`, we return itself.
  const allNetworks = Object.values(Network) as string[];
  if (allNetworks.includes(String(chainId))) return chainId as Network;

  if (chainId === 'Binance-Chain-Tigris') return Network.BINANCE;
  return (
    blockchains
      .filter((blockchainMeta) => !!blockchainMeta.chainId)
      .find((blockchainMeta) => {
        const blockchainChainId = blockchainMeta.chainId?.startsWith('0x')
          ? parseInt(blockchainMeta.chainId)
          : blockchainMeta.chainId;
        return blockchainChainId == chainId;
      })?.name || null
  );
};

export const getBlockchainChainIdByName = (
  netwok: Network,
  allBlockChains: AllBlockchains
) => allBlockChains[netwok]?.chainId || null;

export const uint8ArrayToHex = (buffer: Uint8Array): string => {
  // buffer is an ArrayBuffer
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return [...buffer].map((x) => x.toString(16).padStart(2, '0')).join('');
};

export enum WalletType {
  META_MASK = 'metamask',
  WALLET_CONNECT = 'wallet-connect',
  TRUST_WALLET = 'trust-wallet',
  TERRA_STATION = 'terra-station',
  KEPLR = 'keplr',
  PHANTOM = 'phantom',
  COINBASE = 'coinbase',
  XDEFI = 'xdefi',
  BINANCE_CHAIN = 'binance-chain',
  LEAP = 'leap',
  CLOVER = 'clover',
  COSMOSTATION = 'cosmostation',
  COIN98 = 'coin98',
  SAFEPAL = 'safepal',
  TOKEN_POCKET = 'token-pocket',
  BRAVE = 'brave',
  UNKNOWN = 'unknown',
  MATH = 'math',
  EXODUS = 'exodus',
  OKX = 'okx',
}

export enum Network {
  BTC = 'BTC',
  BSC = 'BSC',
  LTC = 'LTC',
  THORCHAIN = 'THOR',
  BCH = 'BCH',
  BINANCE = 'BNB',
  ETHEREUM = 'ETH',
  POLYGON = 'POLYGON',
  TERRA = 'TERRA',
  POLKADOT = '',
  TRON = 'TRON',
  DOGE = 'DOGE',
  HARMONY = 'HARMONY',
  AVAX_CCHAIN = 'AVAX_CCHAIN',
  FANTOM = 'FANTOM',
  MOONBEAM = 'MOONBEAM',
  ARBITRUM = 'ARBITRUM',
  BOBA = 'BOBA',
  OPTIMISM = 'OPTIMISM',
  FUSE = 'FUSE',
  CRONOS = 'CRONOS',
  SOLANA = 'SOLANA',
  MOONRIVER = 'MOONRIVER',
  GNOSIS = 'GNOSIS',
  COSMOS = 'COSMOS',
  OSMOSIS = 'OSMOSIS',
  AKASH = 'AKASH',
  IRIS = 'IRIS',
  PERSISTENCE = 'PERSISTENCE',
  SENTINEL = 'SENTINEL',
  REGEN = 'REGEN',
  CRYPTO_ORG = 'CRYPTO_ORG',
  SIF = 'SIF',
  CHIHUAHUA = 'CHIHUAHUA',
  JUNO = 'JUNO',
  KUJIRA = 'KUJIRA',
  STARNAME = 'STARNAME',
  COMDEX = 'COMDEX',
  STARGAZE = 'STARGAZE',
  DESMOS = 'DESMOS',
  BITCANNA = 'BITCANNA',
  SECRET = 'SECRET',
  INJECTIVE = 'INJECTIVE',
  LUMNETWORK = 'LUMNETWORK',
  BANDCHAIN = 'BANDCHAIN',
  EMONEY = 'EMONEY',
  BITSONG = 'BITSONG',
  KI = 'KI',
  MEDIBLOC = 'MEDIBLOC',
  KONSTELLATION = 'KONSTELLATION',
  UMEE = 'UMEE',

  // Using instead of null
  Unknown = 'Unkown',
}

export const XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS = [
  Network.BTC,
  Network.LTC,
  Network.THORCHAIN,
  Network.BCH,
  Network.BINANCE,
];

export const isEvmBlockchain = (
  blockchainMeta: BlockchainMeta
): blockchainMeta is EvmBlockchainMeta =>
  blockchainMeta.type === GenericTransactionType.EVM;

export const isCosmosBlockchain = (
  blockchainMeta: BlockchainMeta
): blockchainMeta is CosmosBlockchainMeta =>
  blockchainMeta.type === GenericTransactionType.COSMOS;

export const isSolanaBlockchain = (
  blockchainMeta: BlockchainMeta
): blockchainMeta is SolanaBlockchainMeta =>
  blockchainMeta.type === GenericTransactionType.SOLANA;

export const isNativeBlockchain = (
  blockchainMeta: BlockchainMeta
): blockchainMeta is NativeBlockchainMeta =>
  blockchainMeta.type === GenericTransactionType.TRANSFER;

// Meta
export type Asset = {
  blockchain: Network;
  symbol: string;
  address: string | null;
};

export enum GenericTransactionType {
  EVM = 'EVM',
  TRANSFER = 'TRANSFER',
  COSMOS = 'COSMOS',
  SOLANA = 'SOLANA',
}

type EvmInfo = {
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  addressUrl: string;
  transactionUrl: string;
};

export interface CosmosChainInfo {
  rpc: string;
  rest: string;
  chainId: string;
  cosmostationLcdUrl?: string;
  cosmostationApiUrl?: string;
  cosmostationDenomTracePath?: string;
  mintScanName?: string | null;
  chainName: string;
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
    coinImageUrl: string;
  };
  bip44: {
    coinType: number;
  };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
    coinImageUrl: string;
  }[];
  feeCurrencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
    coinImageUrl: string;
  }[];
  features: string[];
  explorerUrlToTx: string;
  gasPriceStep?: {
    low: number;
    average: number;
    high: number;
  };
}

export interface CosmosInfo extends Omit<CosmosChainInfo, 'chianId'> {
  experimental: boolean;
}

type BlockchainInfo = EvmInfo | CosmosInfo | null;

export interface BlockchainMeta {
  name: Network;
  defaultDecimals: number;
  addressPatterns: string[];
  feeAssets: Asset[];
  logo: string;
  displayName: string;
  shortName: string;
  sort: number;
  color: string;
  enabled: boolean;
  type: GenericTransactionType;
  chainId: string | null;
  info: BlockchainInfo;
}

export type AllBlockchains = { [key: string]: BlockchainMeta };

export type AddEthereumChainParameter = {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
};
export type EvmNetworksChainInfo = { [key: string]: AddEthereumChainParameter };

export interface EvmBlockchainMeta extends BlockchainMeta {
  type: GenericTransactionType.EVM;
  info: EvmInfo;
  chainId: string;
}

export interface CosmosBlockchainMeta extends BlockchainMeta {
  type: GenericTransactionType.COSMOS;
  info: CosmosInfo | null;
  chainId: string;
}

export interface SolanaBlockchainMeta extends BlockchainMeta {
  type: GenericTransactionType.SOLANA;
  info: null;
  chainId: string;
}
export interface NativeBlockchainMeta extends BlockchainMeta {
  type: GenericTransactionType.TRANSFER;
  info: null;
  chainId: null;
}

export interface Meta {
  blockchains: AllBlockchains;
  evmNetworkChainInfo: EvmNetworksChainInfo;
  walletsAndSupportedChainsNames: { [type in WalletType]?: Network[] } | null;
  evmBasedChains: EvmBlockchainMeta[];
}

// Transaction

export type CosmosIBCTokenAndAmount = {
  denom: string;
  amount: string;
};

export type CosmosIBCTimeoutHeight = {
  revision_number: string;
  revision_height: string;
};

export type CosmosIBCTransferMessageValue = {
  source_port: string;
  source_channel: string;
  token: CosmosIBCTokenAndAmount;
  sender: string;
  receiver: string;
  timeout_height: CosmosIBCTimeoutHeight;
};

export type CosmosIBCTransferMessage = {
  __type: string;
  type: string;
  value: CosmosIBCTransferMessageValue;
};

export type TerraBridgeBurnExecuteMessageAmount = { amount: string };
export type TerraBridgeBurnExecuteMessage = {
  burn: TerraBridgeBurnExecuteMessageAmount;
};

export type TerraBridgeTransferExecuteMessage = {
  recipient: string;
  amount: string;
};

export type TerraSwapSingleSwapCW20Send = {
  amount: string;
  contract: string;
  msg: string;
};
export type TerraSwapSingleSwapFromCW20TokenCallWrapper = {
  send: TerraSwapSingleSwapCW20Send;
};

export type TerraSwapSingleSwapNativeToken = { denom: string };
export type TerraSwapSingleSwapAssetInfo = {
  native_token: TerraSwapSingleSwapNativeToken;
};
export type TerraSwapSingleSwapOfferAsset = {
  amount: string;
  info: TerraSwapSingleSwapAssetInfo;
};
export type TerraSwapSingleSwap = {
  offer_asset: TerraSwapSingleSwapOfferAsset;
};
export type TerraSwapSingleSwapFromNativeTokenCallWrapper = {
  swap: TerraSwapSingleSwap;
};

export type CosmosExecuteMessage =
  | TerraBridgeBurnExecuteMessage
  | TerraBridgeTransferExecuteMessage
  | TerraSwapSingleSwapFromCW20TokenCallWrapper
  | TerraSwapSingleSwapFromNativeTokenCallWrapper;

export type Coin = { denom: string; amount: string };

export type OsmosisSwapMessage = {
  __type: string;
  type: string;
  value: number[];
};

export type MsgExecuteContract = {
  __type: string;
  sender: string;
  contract: string;
  execute_msg: CosmosExecuteMessage;
  coins: Coin[];
};

export type MsgSend = {
  __type: string;
  inputs: InputOutput[];
  outputs: InputOutput[];
  aminoPrefix: string;
};
export type InputOutput = { address: string; coins: Coin[] };

export type DirectMsgSend = {
  __type: string;
  typeUrl: string;
  value: SifchainMsgSendValue;
};
export type SifchainMsgSendValue = {
  amount: Coin[];
  fromAddress: string;
  toAddress: string;
};

export type DirectCosmosIBCTimeoutHeight = {
  revisionNumber: string;
  revisionHeight: string;
};

export type DirectCosmosIBCTransferMessageValue = {
  sourcePort: string;
  sourceChannel: string;
  token: CosmosIBCTokenAndAmount;
  sender: string;
  receiver: string;
  timeoutHeight: DirectCosmosIBCTimeoutHeight;
  timeoutTimestamp: string | null;
};

export type DirectCosmosIBCTransferMessage = {
  __type: string;
  typeUrl: string;
  value: DirectCosmosIBCTransferMessageValue;
};

export type Msg =
  | CosmosIBCTransferMessage
  | MsgExecuteContract
  | OsmosisSwapMessage
  | MsgSend
  | DirectMsgSend
  | DirectCosmosIBCTransferMessage;

export type ProtoMsg = { type_url: string; value: number[] };

export type CosmosFeeAmount = { denom: string; amount: string };
export type CosmosFee = { gas: string; amount: CosmosFeeAmount[] };

export type CosmosMessage = {
  chainId: string | null;
  account_number: number | null;
  sequence: string | null;
  msgs: Msg[];
  protoMsgs: ProtoMsg[];
  memo: string | null;
  source: number | null;
  fee: CosmosFee | null;
  signType: 'AMINO' | 'DIRECT';
  rpcUrl: string;
};

export type AssetWithTicker = {
  blockchain: Network;
  symbol: string;
  address: string | null;
  ticker: string;
};

export type CosmosRawTransferData = {
  method: string;
  asset: AssetWithTicker;
  amount: string;
  decimals: number;
  recipient: string;
  memo: string | null;
};

export type SolanaSignature = {
  signature: number[];
  publicKey: string;
};

export type SolanaInstructionKey = {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
};

export type SolanaInstruction = {
  keys: SolanaInstructionKey[];
  programId: string;
  data: number[];
};

export type CosmosTransaction = {
  fromWalletAddress: string;
  type: GenericTransactionType;
  blockChain: Network;
  data: CosmosMessage;
  rawTransfer: CosmosRawTransferData | null;
  externalTxId: string | null;
  id: string;
};

export type EvmTransaction = {
  blockChain: Network;
  type: GenericTransactionType;
  from: string | null;
  to: string;
  data: string | null;
  value: string | null;
  gasLimit: string | null;
  gasPrice: string | null;
  nonce: string | null;
  externalTxId: string | null;
  isApprovalTx: boolean;
  id: string;
};

export type SolanaTransaction = {
  blockChain: Network;
  from: string;
  identifier: string;
  type: GenericTransactionType;
  externalTxId: string | null;
  recentBlockhash: string;
  signatures: SolanaSignature[];
  serializedMessage: number[] | null;
  instructions: SolanaInstruction[];
};

export type TransferTransaction = {
  fromWalletAddress: string;
  type: GenericTransactionType;
  method: string;
  recipientAddress: string | null;
  memo: string | null;
  amount: string;
  decimals: number;
  asset: AssetWithTicker;
  externalTxId: string | null;
  id: string;
};

export type Transaction =
  | EvmTransaction
  | CosmosTransaction
  | SolanaTransaction
  | TransferTransaction;

// core

// wallets/core/src/wallet.ts -> State
export interface WalletState {
  connected: boolean;
  connecting: boolean;
  reachable: boolean;
  installed: boolean;
  accounts: string[] | null;
  network: Network | null;
}

export interface WalletConfig {
  type: WalletType;
  defaultNetwork?: Network;
  checkInstallation?: boolean;
  isAsyncInstance?: boolean;
}

export type GetInstanceOptions = {
  network?: Network;
  currentProvider: any;
  meta: BlockchainMeta[];
  force?: boolean;
};

export type TryGetInstance =
  | (() => any)
  | ((options: Pick<GetInstanceOptions, 'force' | 'network'>) => Promise<any>);

export type GetInstance =
  | (() => any)
  | ((options: GetInstanceOptions) => Promise<any>);

export type ProviderConnectResult = {
  accounts: string[];
  chainId: string;
};

export type Connect = (options: {
  instance: any;
  network?: Network;
  meta: BlockchainMeta[];
}) => Promise<ProviderConnectResult | ProviderConnectResult[]>;

export type Disconnect = (options: {
  instance: any;
  destroyInstance: () => void;
}) => Promise<void>;

export type Subscribe = (options: {
  instance: any;
  state: WalletState;
  meta: BlockchainMeta[];
  updateChainId: (chainId: string) => void;
  updateAccounts: (accounts: string[], chainId?: string) => void;
  connect: (network?: Network) => void;
  disconnect: () => void;
}) => void;

export type SwitchNetwork = (options: {
  instance: any;
  network: Network;
  meta: BlockchainMeta[];
  newInstance?: TryGetInstance;
}) => Promise<void>;

export type CanSwitchNetwork = (options: {
  network: Network;
  meta: BlockchainMeta[];
}) => boolean;

export type WalletSigners = {
  executeTransfer: (tx: TransferTransaction, meta: Meta) => Promise<string>;
  executeEvmTransaction: (tx: EvmTransaction, meta: Meta) => Promise<string>;
  executeCosmosMessage: (tx: CosmosTransaction, meta: Meta) => Promise<string>;
  executeSolanaTransaction: (
    tx: SolanaTransaction,
    requestId: string
  ) => Promise<string>;
  signEvmMessage: (walletAddress: string, message: string) => Promise<string>;
};

export const evmBlockchains = (allBlockChains: BlockchainMeta[]) =>
  allBlockChains.filter(isEvmBlockchain);
export const solanaBlockchain = (allBlockChains: BlockchainMeta[]) =>
  allBlockChains.filter(isSolanaBlockchain);

export const cosmosBlockchains = (allBlockChains: BlockchainMeta[]) =>
  allBlockChains.filter(isCosmosBlockchain);

export type WalletInfo = {
  name: string;
  img: string;
  installLink: string;
  color: string;
  supportedChains: BlockchainMeta[];
};
