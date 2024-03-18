import type { SwapInputProps } from '../../containers/SwapInput/SwapInput.types';
import type { PropTypes as ChainTokenPropTypes } from '../ChainToken/ChainToken.types';
import type { PriceImpactProps } from '../PriceImpact/PriceImpact.types';
import type { PropTypes as QuoteCostProps } from '../QuoteCost/QuoteCost.types';
import type { InternalSwap, Step } from '../StepDetails/StepDetails.types';
import type { PropTypes as TooltipPropTypes } from '../Tooltip/Tooltip.types';
import type { CSSProperties } from '@stitches/react';
import type { RouteTag } from 'rango-sdk';

type BaseProps = {
  percentageChange?: PriceImpactProps['percentageChange'];
  warningLevel?: PriceImpactProps['warningLevel'];
  tooltipContainer?: HTMLElement;
  onClick?: () => void;
  selected?: boolean;
  feeWarning?: boolean;
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
    content: TooltipPropTypes['content'];
    open?: TooltipPropTypes['open'];
  };
  isInternalSwap?: boolean;
  tokenImage: ChainTokenPropTypes['tokenImage'];
  chainImage: ChainTokenPropTypes['chainImage'];
  size?: ChainTokenPropTypes['size'];
  amount?: string;
  name?: string;
}
