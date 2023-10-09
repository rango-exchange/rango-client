import type { BestRouteProps } from './BestRoute.types';

export const route1: BestRouteProps = {
  type: 'list-item',
  recommended: true,
  input: { value: '1', usdValue: '30000' },
  output: { value: '3161.441024', usdValue: '26.890' },
  steps: [
    {
      swapper: {
        displayName: 'MayaProtocol',
        image: 'https://api.rango.exchange/swappers/maya.jpg',
      },
      from: {
        token: {
          displayName: 'BTC',
          image: 'https://api.rango.exchange/tokens/BTC/BTC.png',
        },
        chain: {
          displayName: 'BTC',
          image: 'https://api.rango.exchange/tokens/BTC/BTC.png',
        },
        price: {
          value: '1.00000000',
        },
      },
      to: {
        chain: {
          displayName: 'ETH',
          image: 'https://api.rango.exchange/blockchains/ethereum.svg',
        },
        token: {
          displayName: 'ETH',

          image: 'https://api.rango.exchange/tokens/ETH/ETH.png',
        },
        price: {
          value: '14.863736725876758517',
        },
      },
    },
    {
      swapper: {
        displayName: 'Satellite',
        image: 'https://api.rango.exchange/swappers/satellite.png',
      },
      from: {
        token: {
          displayName: 'ETH',
          image: 'https://api.rango.exchange/tokens/ETH/ETH.png',
        },
        chain: {
          displayName: 'ETH',
          image: 'https://api.rango.exchange/blockchains/ethereum.svg',
        },
        price: { value: '14.863736725876758517' },
      },
      to: {
        token: {
          displayName: 'ETH',
          image: 'https://api.rango.exchange/tokens/COSMOS/ETH.png',
        },
        chain: {
          displayName: 'OSMOSIS',
          image: 'https://api.rango.exchange/blockchains/osmosis.svg',
        },
        price: {
          value: '14.825674725876758517',
        },
      },
    },
    {
      swapper: {
        displayName: 'Osmosis',
        image: 'https://api.rango.exchange/swappers/osmosis.png',
      },
      from: {
        token: {
          displayName: 'ETH',
          image: 'https://api.rango.exchange/tokens/COSMOS/ETH.png',
        },
        chain: {
          displayName: 'OSMOSIS',
          image: 'https://api.rango.exchange/blockchains/osmosis.svg',
        },
        price: {
          value: '14.825674725876758517',
        },
      },
      to: {
        token: {
          displayName: 'ATOM',
          image: 'https://api.rango.exchange/tokens/COSMOS/ATOM.png',
        },
        chain: {
          displayName: 'OSMOSIS',
          image: 'https://api.rango.exchange/blockchains/osmosis.svg',
        },
        price: {
          value: '3161.441024',
        },
      },
    },
    {
      swapper: {
        displayName: 'IBC',
        image: 'https://api.rango.exchange/swappers/IBC.png',
      },
      from: {
        token: {
          displayName: 'ATOM',
          image: 'https://api.rango.exchange/tokens/COSMOS/ATOM.png',
        },
        chain: {
          displayName: 'OSMOSIS',
          image: 'https://api.rango.exchange/blockchains/osmosis.svg',
        },
        price: {
          value: '3161.441024',
        },
      },
      to: {
        token: {
          displayName: 'ATOM',
          image: 'https://api.rango.exchange/tokens/COSMOS/ATOM.png',
        },
        chain: {
          displayName: 'COSMOS',
          image: 'https://api.rango.exchange/blockchains/cosmos.svg',
        },
        price: {
          value: '3161.441024',
        },
      },
    },
  ],

  percentageChange: '7.51',
  warningLevel: 'high',
  totalFee: '9.90',
  totalTime: '23:00',
};
