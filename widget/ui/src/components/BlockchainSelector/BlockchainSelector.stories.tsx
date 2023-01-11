import React from 'react';
import { ComponentMeta } from '@storybook/react';
import BlockchainSelector, { PropTypes } from './BlockchainSelector';

export default {
  title: 'Blockchain Selector',
  component: BlockchainSelector,
  argTypes: {
    searchedText: {
      type: 'string',
    },
    selectedBlockchain: {
      type: 'string',
    },
  },
} as ComponentMeta<typeof BlockchainSelector>;

const blockchainMeta: PropTypes['blockchains'] = [
  {
    name: 'BSC',
    displayName: 'BSC',
    logo: 'https://api.rango.exchange/blockchains/binance.svg',
  },
  {
    name: 'POLYGON',
    displayName: 'Polygon',
    logo: 'https://api.rango.exchange/blockchains/polygon.svg',
  },
  {
    name: 'ETH',
    displayName: 'Ethereum',
    logo: 'https://api.rango.exchange/blockchains/ethereum.svg',
  },
  {
    name: 'OSMOSIS',
    displayName: 'Osmosis',
    logo: 'https://api.rango.exchange/blockchains/osmosis.svg',
  },
  {
    name: 'JUNO',
    displayName: 'Juno',
    logo: 'https://api.rango.exchange/blockchains/juno.svg',
  },
  {
    name: 'AVAX_CCHAIN',
    displayName: 'Avalanche',
    logo: 'https://api.rango.exchange/blockchains/avax_cchain.svg',
  },
  {
    name: 'ARBITRUM',
    displayName: 'Arbitrum',
    logo: 'https://api.rango.exchange/blockchains/arbitrum.svg',
  },
  {
    name: 'TERRA',
    displayName: 'Terra',
    logo: 'https://api.rango.exchange/blockchains/terra.svg',
  },
  {
    name: 'COSMOS',
    displayName: 'Cosmos',
    logo: 'https://api.rango.exchange/blockchains/cosmos.svg',
  },
  {
    name: 'STARKNET',
    displayName: 'StarkNet',
    logo: 'https://api.rango.exchange/blockchains/starknet.svg',
  },
  {
    name: 'FANTOM',
    displayName: 'Fantom',
    logo: 'https://api.rango.exchange/blockchains/fantom.png',
  },
  {
    name: 'OPTIMISM',
    displayName: 'Optimism',
    logo: 'https://api.rango.exchange/blockchains/optimism.svg',
  },
  {
    name: 'SOLANA',
    displayName: 'Solana',
    logo: 'https://api.rango.exchange/blockchains/solana.svg',
  },
  {
    name: 'OKC',
    displayName: 'OKX Chain (OKC)',
    logo: 'https://api.rango.exchange/blockchains/okx.png',
  },
  {
    name: 'CRONOS',
    displayName: 'Cronos',
    logo: 'https://api.rango.exchange/blockchains/cronos.svg',
  },
  {
    name: 'MOONRIVER',
    displayName: 'MoonRiver',
    logo: 'https://api.rango.exchange/blockchains/moonriver.svg',
  },
  {
    name: 'MOONBEAM',
    displayName: 'MoonBeam',
    logo: 'https://api.rango.exchange/blockchains/moonbeam.png',
  },
  {
    name: 'POLKADOT',
    displayName: 'Polkadot',
    logo: 'https://api.rango.exchange/blockchains/polkadot.svg',
  },
  {
    name: 'DOGE',
    displayName: 'Doge',
    logo: 'https://api.rango.exchange/blockchains/doge.svg',
  },
  {
    name: 'HECO',
    displayName: 'Heco',
    logo: 'https://api.rango.exchange/blockchains/heco.png',
  },
  {
    name: 'AURORA',
    displayName: 'Aurora',
    logo: 'https://api.rango.exchange/blockchains/aurora.svg',
  },
  {
    name: 'HARMONY',
    displayName: 'Harmony',
    logo: 'https://api.rango.exchange/blockchains/harmony.svg',
  },
  {
    name: 'EVMOS',
    displayName: 'Evmos',
    logo: 'https://api.rango.exchange/blockchains/evmos.png',
  },
  {
    name: 'TRON',
    displayName: 'Tron',
    logo: 'https://api.rango.exchange/blockchains/tron.svg',
  },
  {
    name: 'SIF',
    displayName: 'Sifchain',
    logo: 'https://api.rango.exchange/blockchains/sif.png',
  },
  {
    name: 'THOR',
    displayName: 'Thorchain',
    logo: 'https://api.rango.exchange/blockchains/thorchain.svg',
  },
  {
    name: 'BNB',
    displayName: 'Binance Chain',
    logo: 'https://api.rango.exchange/blockchains/bnb.svg',
  },
  {
    name: 'STARGAZE',
    displayName: 'Stargaze',
    logo: 'https://api.rango.exchange/blockchains/stargaze.png',
  },
  {
    name: 'BTC',
    displayName: 'Bitcoin',
    logo: 'https://api.rango.exchange/blockchains/btc.svg',
  },
  {
    name: 'CRYPTO_ORG',
    displayName: 'Crypto.org',
    logo: 'https://api.rango.exchange/blockchains/crypto_org.png',
  },
  {
    name: 'CHIHUAHUA',
    displayName: 'Chihuahua',
    logo: 'https://api.rango.exchange/blockchains/chihuahua.png',
  },
  {
    name: 'BANDCHAIN',
    displayName: 'BandChain',
    logo: 'https://api.rango.exchange/blockchains/bandchain.svg',
  },
  {
    name: 'COMDEX',
    displayName: 'Comdex',
    logo: 'https://api.rango.exchange/blockchains/comdex.svg',
  },
  {
    name: 'REGEN',
    displayName: 'Regen Network',
    logo: 'https://api.rango.exchange/blockchains/regen.png',
  },
  {
    name: 'IRIS',
    displayName: 'IRISnet',
    logo: 'https://api.rango.exchange/blockchains/iris.png',
  },
  {
    name: 'EMONEY',
    displayName: 'e-Money',
    logo: 'https://api.rango.exchange/blockchains/emoney.svg',
  },
  {
    name: 'GNOSIS',
    displayName: 'Gnosis',
    logo: 'https://api.rango.exchange/blockchains/gnosis.svg',
  },
  {
    name: 'LTC',
    displayName: 'LiteCoin',
    logo: 'https://api.rango.exchange/blockchains/ltc.svg',
  },
  {
    name: 'BCH',
    displayName: 'Bitcoin Cash',
    logo: 'https://api.rango.exchange/blockchains/bch.svg',
  },
  {
    name: 'BITSONG',
    displayName: 'BitSong',
    logo: 'https://api.rango.exchange/blockchains/bitsong.svg',
  },
  {
    name: 'FUSE',
    displayName: 'Fuse',
    logo: 'https://api.rango.exchange/blockchains/fuse.png',
  },
  {
    name: 'AKASH',
    displayName: 'Akash',
    logo: 'https://api.rango.exchange/blockchains/akash.svg',
  },
  {
    name: 'KI',
    displayName: 'Ki',
    logo: 'https://api.rango.exchange/blockchains/ki.png',
  },
  {
    name: 'KUJIRA',
    displayName: 'Kujira',
    logo: 'https://api.rango.exchange/blockchains/kuji.svg',
  },
  {
    name: 'PERSISTENCE',
    displayName: 'Persistence',
    logo: 'https://api.rango.exchange/blockchains/persistence.png',
  },
  {
    name: 'MEDIBLOC',
    displayName: 'MediBloc',
    logo: 'https://api.rango.exchange/blockchains/medibloc.png',
  },
  {
    name: 'SENTINEL',
    displayName: 'Sentinel',
    logo: 'https://api.rango.exchange/blockchains/sentinel.png',
  },
  {
    name: 'INJECTIVE',
    displayName: 'Injective',
    logo: 'https://api.rango.exchange/blockchains/injective.svg',
  },
  {
    name: 'SECRET',
    displayName: 'Secret',
    logo: 'https://api.rango.exchange/blockchains/secret.svg',
  },
  {
    name: 'STARNAME',
    displayName: 'Starname',
    logo: 'https://api.rango.exchange/blockchains/starname.png',
  },
  {
    name: 'KONSTELLATION',
    displayName: 'Konstellation',
    logo: 'https://api.rango.exchange/blockchains/konstellation.svg',
  },
  {
    name: 'UMEE',
    displayName: 'Umee',
    logo: 'https://api.rango.exchange/blockchains/umee.svg',
  },
  {
    name: 'BITCANNA',
    displayName: 'BitCanna',
    logo: 'https://api.rango.exchange/blockchains/bitcanna.svg',
  },
  {
    name: 'DESMOS',
    displayName: 'Desmos',
    logo: 'https://api.rango.exchange/blockchains/desmos.svg',
  },
  {
    name: 'LUMNETWORK',
    displayName: 'Lum Network',
    logo: 'https://api.rango.exchange/blockchains/lumnetwork.svg',
  },
  {
    name: 'BOBA',
    displayName: 'Boba',
    logo: 'https://api.rango.exchange/blockchains/boba.png',
  },
  {
    name: 'AXELAR',
    displayName: 'Axelar',
    logo: 'https://api.rango.exchange/blockchains/axelar.png',
  },
];

export const Main = (args: PropTypes) => {
  return (
    <BlockchainSelector
      {...args}
      blockchains={blockchainMeta}
      searchedText={''}
      selectedBlockchain={'BTC'}
    />
  );
};
