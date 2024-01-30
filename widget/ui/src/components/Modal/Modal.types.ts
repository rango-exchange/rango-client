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
  containerStyle?: Stitches.CSS<typeof config>;
  footer?: React.ReactNode;
  hasLogo?: boolean;
  hasCloseIcon?: boolean;
}
