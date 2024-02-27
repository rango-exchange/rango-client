import type { SwapInputProps } from '../../containers/SwapInput/SwapInput.types';
import type { PriceImpactProps } from '../PriceImpact/PriceImpact.types';
import type { PropTypes as QuoteCostProps } from '../QuoteCost/QuoteCost.types';
import type { Step } from '../StepDetails/StepDetails.types';
import type { RouteTag } from 'rango-sdk';

type BaseProps = {
  percentageChange?: PriceImpactProps['percentageChange'];
  warningLevel?: PriceImpactProps['warningLevel'];
  tooltipContainer?: HTMLElement;
  onClick?: () => void;
  selected?: boolean;
};

export type DataLoadedProps = {
  steps: Step[];
  tags: RouteTag[];
  time: QuoteCostProps['time'];
  fee: QuoteCostProps['fee'];
  outputPrice: SwapInputProps['price'];
  loading?: false;
};
type LoadingProps = {
  loading: true;
};

export type PropTypes = BaseProps & (DataLoadedProps | LoadingProps);
