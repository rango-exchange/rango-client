import type { DrawerContainer } from './Drawer.styles';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof DrawerContainer>;
type BaseAnchor = Exclude<BaseProps['anchor'], object>;

export interface PropTypes {
  title?: string;
  open: boolean;
  onClose: () => void;
  anchor?: BaseAnchor;
  dismissible?: boolean;
  footer?: React.ReactNode;
  container?: Element | null;
  hasLogo?: boolean;
  prefix?: React.ReactNode;
}
