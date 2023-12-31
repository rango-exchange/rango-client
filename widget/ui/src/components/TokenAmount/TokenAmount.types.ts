import type { SwapInputProps } from '../../containers/SwapInput/SwapInput.types';
import type { PriceImpactProps } from '../PriceImpact/PriceImpact.types';

type BaseProps = Pick<SwapInputProps, 'token' | 'price'> & {
  chain: Pick<SwapInputProps['chain'], 'image'>;
  direction?: 'vertical' | 'horizontal';
  centerAlign?: boolean;
  label?: string;
  tooltipContainer?: HTMLElement;
};

type InputAmountProps = { type: 'input' };

type OutputAmountProps = Pick<
  PriceImpactProps,
  'percentageChange' | 'warningLevel'
> & {
  type: 'output';
};

export type PropTypes = BaseProps & (InputAmountProps | OutputAmountProps);
