import type { SwapInputPropTypes } from '../../containers/SwapInput/SwapInput.types';
import type { PriceImpactPropTypes } from '../PriceImpact/PriceImpact.types';

type BaseProps = Pick<SwapInputPropTypes, 'token' | 'price'> & {
  chain: Pick<SwapInputPropTypes['chain'], 'image'>;
  direction?: 'vertical' | 'horizontal';
  centerAlign?: boolean;
  label?: string;
  tooltipContainer?: HTMLElement;
};

type InputAmountProps = { type: 'input' };

type OutputAmountProps = Pick<
  PriceImpactPropTypes,
  'percentageChange' | 'warningLevel'
> & {
  type: 'output';
};

export type PropTypes = BaseProps & (InputAmountProps | OutputAmountProps);
