import type { PriceImpactProps } from '../PriceImpact/PriceImpact.types';
import type { PropTypes as QuoteCostProps } from '../QuoteCost/QuoteCost.types';
import type { Step } from '../StepDetails/StepDetails.types';
import type { RouteTag } from 'rango-sdk';
import type { SwapInputProps } from 'src/containers/SwapInput/SwapInput.types';

export interface PropTypes {
  steps: Step[];
  tags: RouteTag[];
  time: QuoteCostProps['time'];
  fee: QuoteCostProps['fee'];
  percentageChange?: PriceImpactProps['percentageChange'];
  warningLevel?: PriceImpactProps['warningLevel'];
  outputPrice: SwapInputProps['price'];
  tooltipContainer?: HTMLElement;
  onClick?: () => void;
  selected?: boolean;
}
