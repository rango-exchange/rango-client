import type { IconHighlight } from './MessageBox.styles';
import type * as Stitches from '@stitches/react';
import type { ReactNode } from 'react';

type BaseProps = Stitches.VariantProps<typeof IconHighlight>;
type BaseTypes = Exclude<BaseProps['type'], object>;

export interface PropTypes {
  type: BaseTypes;
  title: string;
  description?: string | ReactNode;
  icon?: ReactNode;
}
