import type { Step } from './StepDetails.types';

export const step1: Step = {
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
};
