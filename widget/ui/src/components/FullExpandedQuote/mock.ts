import type { Step } from '../StepDetails/StepDetails.types';

export const steps: Step[] = [
  {
    swapper: {
      displayName: 'AllBridge',
      image:
        'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/AllBridge/icon.svg',
    },
    from: {
      token: {
        displayName: 'USDC',
        image: 'https://rango.vip/i/mh9zko',
      },
      chain: {
        displayName: 'Polygon',
        image:
          'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/POLYGON/icon.svg',
      },
      price: {
        value: '1.00000000',
        realValue: '5.5',
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
        realValue: '5.5',
      },
    },
  },
  {
    swapper: {
      displayName: 'ThorChain',
      image: 'https://api.rango.exchange/swappers/Thorchain.svg',
    },
    from: {
      token: {
        displayName: 'AVAX',
        image: 'https://api.rango.exchange/tokens/AVAX/AVAX.png',
      },
      chain: {
        displayName: 'Avax',
        image:
          'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/AVAX_CCHAIN/icon.svg',
      },
      price: {
        value: '1.00000000',
        realValue: '5.5',
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
        displayName: 'WMATIC',
        image: 'https://rango.vip/i/NcQpfK',
      },
      chain: {
        displayName: 'BTC',
        image: 'https://api.rango.exchange/tokens/BTC/BTC.png',
      },
      price: {
        value: '3.5',
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
      displayName: 'CurveFi',
      image:
        'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/CurveFi/icon.png',
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
        value: '2',
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
      displayName: '1inch',
      image:
        'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/1Inch/icon.svg',
    },
    from: {
      token: {
        displayName: 'OSMO',
        image: 'https://api.rango.exchange/tokens/COSMOS/OSMO.png',
      },
      chain: {
        displayName: 'Osmosis',
        image:
          'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/OSMOSIS/icon.svg',
      },
      price: {
        value: '5.546',
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
      displayName: 'Pancake',
      image:
        'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/Pancake/icon.svg',
    },
    from: {
      token: {
        displayName: 'OSMO',
        image: 'https://api.rango.exchange/tokens/COSMOS/OSMO.png',
      },
      chain: {
        displayName: 'Osmosis',
        image:
          'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/OSMOSIS/icon.svg',
      },
      price: {
        value: '5.546',
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
];

export const tags = [
  {
    value: 'RECOMMENDED',
    label: 'Recommended',
  },
  {
    value: 'CENTRALIZED',
    label: 'Centrailized',
  },
  {
    value: 'LOWEST_FEE',
    label: 'Lowest Fee',
  },
  {
    value: 'FASTEST',
    label: 'Fastest',
  },
  {
    value: 'HIGH_IMPACT',
    label: 'High Impact',
  },
];
