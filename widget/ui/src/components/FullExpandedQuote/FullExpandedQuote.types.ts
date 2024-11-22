import type { SwapInputPropTypes } from '../../containers/SwapInput/SwapInput.types.js';
import type { ChainTokenPropTypes } from '../ChainToken/index.js';
import type { PriceImpactPropTypes } from '../PriceImpact/PriceImpact.types.js';
import type { PropTypes as QuoteCostProps } from '../QuoteCost/QuoteCost.types.js';
import type { InternalSwap, Step } from '../StepDetails/StepDetails.types.js';
import type {
  NumericTooltipPropTypes,
  TooltipPropTypes,
} from '../Tooltip/index.js';
import type { CSSProperties } from '@stitches/react';
import type { RouteTag } from 'rango-types/lib/api/main';

type BaseProps = {
  percentageChange?: PriceImpactPropTypes['percentageChange'];
  warningLevel?: PriceImpactPropTypes['warningLevel'];
  tooltipContainer?: HTMLElement;
  onClick?: () => void;
  selected?: boolean;
};

export type DataLoadedProps = {
  steps: Step[];
  tags: RouteTag[];
  time: QuoteCostProps['time'];
  fee: QuoteCostProps['fee'];
  outputPrice: SwapInputPropTypes['price'];
  loading?: false;
  quoteCost: React.ReactElement;
};
type LoadingProps = {
  loading: true;
};

export type PropTypes = BaseProps & (DataLoadedProps | LoadingProps);

export interface TooltipContentProps {
  internalSwaps: InternalSwap[];
  time: QuoteCostProps['time'];
  fee: DataLoadedProps['fee'];
  alerts?: Step['alerts'];
}

export interface TokenSectionPropTypes {
  style?: CSSProperties;
  tooltipProps?: {
    container: TooltipPropTypes['container'];
    content: NumericTooltipPropTypes['content'];
    open?: TooltipPropTypes['open'];
  };
  isInternalSwap?: boolean;
  tokenImage: ChainTokenPropTypes['tokenImage'];
  chainImage: ChainTokenPropTypes['chainImage'];
  size?: ChainTokenPropTypes['size'];
  amount?: string;
  name?: string;
}
