import type {
  Asset,
  Explorer,
  FeeToken,
  StakingToken,
} from '@chain-registry/types';
import type {
  CosmosAssetList,
  CosmosChain,
} from '@rango-dev/wallets-core/namespaces/cosmos';
import type { CosmosBlockchainMeta, CosmosChainInfo } from 'rango-types';

export interface ConversionResult {
  chain: CosmosChain;
  assetList: CosmosAssetList;
}

/**
 * Converts CosmosBlockchainMeta to Chain and AssetList formats
 */
export function convertCosmosMetaToChainRegistry(
  meta: CosmosBlockchainMeta
): ConversionResult {
  const info = meta.info;

  if (!info) {
    throw new Error('CosmosChainInfo is required for conversion');
  }

  const chain = convertToChain(meta, info);
  const assetList = convertToAssetList(info);

  return { chain, assetList };
}

function convertToChain(
  meta: CosmosBlockchainMeta,
  info: CosmosChainInfo
): CosmosChain {
  const chain: CosmosChain = {
    chainName: info.chainName,
    chainType: 'cosmos',
    chainId: meta.chainId || undefined,
    prettyName: meta.displayName,
    status: meta.enabled ? 'live' : 'killed',
    networkType: 'mainnet',
    bech32Prefix: info.bech32Config.bech32PrefixAccAddr,
    bech32Config: {
      bech32PrefixAccAddr: info.bech32Config.bech32PrefixAccAddr,
      bech32PrefixAccPub: info.bech32Config.bech32PrefixAccPub,
      bech32PrefixValAddr: info.bech32Config.bech32PrefixValAddr,
      bech32PrefixValPub: info.bech32Config.bech32PrefixValPub,
      bech32PrefixConsAddr: info.bech32Config.bech32PrefixConsAddr,
      bech32PrefixConsPub: info.bech32Config.bech32PrefixConsPub,
    },
    slip44: info.bip44.coinType,
    fees: {
      feeTokens: convertFeeTokens(info),
    },
    staking: {
      stakingTokens: convertStakingTokens(info),
    },
    apis: {
      rpc: info.rpc ? [{ address: info.rpc }] : undefined,
      rest: info.rest ? [{ address: info.rest }] : undefined,
    },
    explorers: convertExplorers(info),
    logoURIs: meta.logo ? { png: meta.logo } : undefined,
    keywords: info.experimental ? ['experimental'] : undefined,
  };

  return chain;
}

function convertFeeTokens(info: CosmosChainInfo): FeeToken[] {
  return info.feeCurrencies.map((currency) => {
    const feeToken: FeeToken = {
      denom: currency.coinMinimalDenom,
    };

    if (info.gasPriceStep) {
      feeToken.lowGasPrice = info.gasPriceStep.low;
      feeToken.averageGasPrice = info.gasPriceStep.average;
      feeToken.highGasPrice = info.gasPriceStep.high;
    }

    return feeToken;
  });
}

function convertStakingTokens(info: CosmosChainInfo): StakingToken[] {
  return [
    {
      denom: info.stakeCurrency.coinMinimalDenom,
    },
  ];
}

function convertExplorers(info: CosmosChainInfo): Explorer[] | undefined {
  const explorers: Explorer[] = [];

  if (info.explorerUrlToTx) {
    const baseUrl = info.explorerUrlToTx.split('/tx/')[0];
    explorers.push({
      url: baseUrl,
      txPage: info.explorerUrlToTx.replace(
        /\{txHash\}|\$\{txHash\}/g,
        '${txHash}'
      ),
    });
  }

  if (info.blockExplorerUrls && info.blockExplorerUrls.length > 0) {
    info.blockExplorerUrls.forEach((url) => {
      if (!explorers.some((e) => e.url === url)) {
        explorers.push({ url });
      }
    });
  }

  return explorers.length > 0 ? explorers : undefined;
}

function convertToAssetList(info: CosmosChainInfo): CosmosAssetList {
  const assets: Asset[] = [];

  // Add staking currency
  assets.push({
    denomUnits: [
      {
        denom: info.stakeCurrency.coinMinimalDenom,
        exponent: 0,
      },
      {
        denom: info.stakeCurrency.coinDenom.toLowerCase(),
        exponent: info.stakeCurrency.coinDecimals,
      },
    ],
    base: info.stakeCurrency.coinMinimalDenom,
    name: info.stakeCurrency.coinDenom,
    display: info.stakeCurrency.coinDenom.toLowerCase(),
    symbol: info.stakeCurrency.coinDenom,
    typeAsset: 'sdk.coin',
    logoURIs: info.stakeCurrency.coinImageUrl
      ? { png: info.stakeCurrency.coinImageUrl }
      : undefined,
    coingeckoId: info.stakeCurrency.coinGeckoId || undefined,
  });

  // Add other currencies
  info.currencies.forEach((currency) => {
    // Skip if already added as staking currency
    if (currency.coinMinimalDenom === info.stakeCurrency.coinMinimalDenom) {
      return;
    }

    assets.push({
      denomUnits: [
        {
          denom: currency.coinMinimalDenom,
          exponent: 0,
        },
        {
          denom: currency.coinDenom.toLowerCase(),
          exponent: currency.coinDecimals,
        },
      ],
      base: currency.coinMinimalDenom,
      name: currency.coinDenom,
      display: currency.coinDenom.toLowerCase(),
      symbol: currency.coinDenom,
      typeAsset: 'sdk.coin',
      logoURIs: currency.coinImageUrl
        ? { png: currency.coinImageUrl }
        : undefined,
      coingeckoId: currency.coinGeckoId || undefined,
    });
  });

  return {
    chainName: info.chainName,
    assets,
  };
}
