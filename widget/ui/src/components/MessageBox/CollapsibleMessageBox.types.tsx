import type { IconHighlight } from './MessageBox.styles.js';
import type * as Stitches from '@stitches/react';

type BaseProps = Stitches.VariantProps<typeof IconHighlight>;
type BaseTypes = Exclude<BaseProps['type'], object>;

export interface PropTypes {
  title: string;
  description: string;
  status: BaseTypes;
}
