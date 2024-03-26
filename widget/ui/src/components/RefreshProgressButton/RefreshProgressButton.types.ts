import type { SvgIconProps } from '../SvgIcon';

export interface PropTypes extends SvgIconProps {
  isPaused: boolean;
  progressDuration: number;
  onProgressEnd?: () => void;
}
