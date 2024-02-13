import type { BackDrop } from './Modal.styles';
import type { config } from '../../theme';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof BackDrop>;
type BaseAnchor = Exclude<BaseProps['anchor'], object>;

export interface PropTypes {
  title?: string;
  open: boolean;
  onClose: () => void;
  anchor?: BaseAnchor;
  dismissible?: boolean;
  header?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  container?: HTMLElement;
  styles?: {
    root?: Stitches.CSS<typeof config>;
    container?: Stitches.CSS<typeof config>;
    content?: Stitches.CSS<typeof config>;
    footer?: Stitches.CSS<typeof config>;
  };
  footer?: React.ReactNode;
  hasWatermark?: boolean;
  hasCloseIcon?: boolean;
  transitionDuration?: {
    enter?: number;
    exit?: number;
  };
}
