import type { PriceImpactProps } from '../PriceImpact/PriceImpact.types';
import type { SwapInputProps } from 'src/containers/SwapInput/SwapInput.types';

type BaseProps = Pick<SwapInputProps, 'token' | 'price'> & {
  chain: Pick<SwapInputProps['chain'], 'image'>;
  direction?: 'vertical' | 'horizontal';
  label?: string;
};

type InputAmountProps = { type: 'input' };

type OutputAmountProps = Pick<
  PriceImpactProps,
  'percentageChange' | 'warningLevel'
> & {
  type: 'output';
};

export type PropTypes = BaseProps & (InputAmountProps | OutputAmountProps);
