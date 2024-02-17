import type { Container } from './Layout.styles';
import type * as Stitches from '@stitches/react';

type ContainerProps = Stitches.VariantProps<typeof Container>;
type ContainerHeightProp = NonNullable<
  Exclude<ContainerProps['height'], object>
>;

export interface PropTypes {
  header: {
    title: string;
    onWallet?: () => void;
    hasSettings?: boolean;
    suffix?: React.ReactNode;
    hasBackButton?: boolean;
    onCancel?: () => void;
    onBack?: () => void;
  };
  footer?: React.ReactNode;
  height?: ContainerHeightProp;
}
