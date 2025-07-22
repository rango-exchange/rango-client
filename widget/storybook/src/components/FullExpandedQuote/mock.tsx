import type { Step } from '@arlert-dev/ui';

import { Alert } from '@arlert-dev/ui';
import React from 'react';

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
    internalSwaps: [
      {
        from: {
          chain: {
            displayName: 'BSC',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/BSC/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'USDT',
            image: 'https://rango.vip/i/6837hX',
          },
        },
        to: {
          chain: {
            displayName: 'BSC',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/BSC/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'USDT',
            image: 'https://rango.vip/i/6837hX',
          },
        },
        swapper: {
          displayName: 'AllBridge',
          image:
            'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/AllBridge/icon.svg',
        },
      },
    ],
    alerts: undefined,
    fee: '0.19',
    time: '07:00',
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
    internalSwaps: [
      {
        from: {
          chain: {
            displayName: 'Solana',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/SOLANA/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'USDT',
            image: 'https://rango.vip/i/6837hX',
          },
        },
        to: {
          chain: {
            displayName: 'SOL',
            image: 'https://rango.vip/tokens/SOLANA/SOL.png',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'USDT',
            image: 'https://rango.vip/i/6837hX',
          },
        },
        swapper: {
          displayName: 'AllBridge',
          image:
            'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/AllBridge/icon.svg',
        },
      },
      {
        from: {
          chain: {
            displayName: 'Solana',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/SOLANA/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'USDT',
            image: 'https://rango.vip/i/6837hX',
          },
        },
        to: {
          chain: {
            displayName: 'Solana',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/SOLANA/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'SOL',
            image: 'https://rango.vip/tokens/SOLANA/SOL.png',
          },
        },
        swapper: {
          displayName: 'Jupiter',
          image:
            'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/Jupiter/icon.svg',
        },
      },
    ],
    state: 'warning',
    alerts: [
      <Alert
        key="alert"
        variant="alarm"
        type="warning"
        title="Slippage Warning"
      />,
    ],
    time: '02:45',
    fee: '0.07',
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
    fee: '0.19',
    time: '07:00',
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
    internalSwaps: [
      {
        from: {
          chain: {
            displayName: 'BSC',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/BSC/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'USDT',
            image: 'https://rango.vip/i/6837hX',
          },
        },
        to: {
          chain: {
            displayName: 'BSC',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/BSC/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'USDT',
            image: 'https://rango.vip/i/6837hX',
          },
        },
        swapper: {
          displayName: 'UniSwap',
          image:
            'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/UniSwapV2/icon.svg',
        },
      },
      {
        from: {
          chain: {
            displayName: 'Solana',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/SOLANA/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'USDT',
            image: 'https://rango.vip/i/6837hX',
          },
        },
        to: {
          chain: {
            displayName: 'Solana',
            image:
              'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/SOLANA/icon.svg',
          },
          price: {
            value: '1',
          },
          token: {
            displayName: 'SOL',
            image: 'https://rango.vip/tokens/SOLANA/SOL.png',
          },
        },
        swapper: {
          displayName: 'DeBridge',
          image:
            'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/DeBridge/icon.svg',
        },
      },
    ],
    fee: '0.19',
    time: '07:00',
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
      token: {
        displayName: 'USDC',
        image: 'https://rango.vip/i/cY81Jl',
      },
      chain: {
        displayName: 'Optimism',
        image:
          'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/OPTIMISM/icon.svg',
      },
      price: {
        value: '5.546',
      },
    },
    alerts: [
      <Alert
        key="alert"
        variant="alarm"
        type="error"
        title="Bridge Limit Error: Please decrease your amount."
      />,
    ],
    state: 'error',
    fee: '0.00',
    time: '01:45',
  },
  {
    swapper: {
      displayName: 'Pancake',
      image:
        'https://raw.githubusercontent.com/rango-exchange/assets/main/swappers/Pancake/icon.svg',
    },
    from: {
      token: {
        displayName: 'USDC',
        image: 'https://rango.vip/i/cY81Jl',
      },
      chain: {
        displayName: 'Optimism',
        image:
          'https://raw.githubusercontent.com/rango-exchange/assets/main/blockchains/OPTIMISM/icon.svg',
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
        value: '14.86',
      },
    },
    fee: '0.19',
    time: '07:00',
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
