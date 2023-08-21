import type { PropTypes } from './ChainToken.types';

export const tokenChainSizeMap: {
  [key in PropTypes['size']]: { token: number; chain: number };
} = {
  small: { token: 17, chain: 10 },
  medium: { token: 27, chain: 10 },
  large: { token: 30, chain: 15 },
};
