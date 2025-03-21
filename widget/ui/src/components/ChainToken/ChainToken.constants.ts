import type { ChainTokenPropTypes } from './ChainToken.types.js';

export const tokenChainSizeMap: {
  [key in ChainTokenPropTypes['size']]: { token: number; chain: number };
} = {
  small: { token: 17, chain: 10 },
  xmedium: { token: 22, chain: 10 },
  medium: { token: 27, chain: 10 },
  large: { token: 30, chain: 15 },
};

export const DEFAULT_TOKEN_IMAGE_SRC =
  'https://raw.githubusercontent.com/rango-exchange/assets/refs/heads/main/common/unknown-image.png';
