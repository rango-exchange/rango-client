import type { ModalContainer } from './Modal.styles';
import type { config } from '../../theme';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof ModalContainer>;
type BaseAnchor = Exclude<BaseProps['anchor'], object>;

export interface ModalPropTypes {
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
}
