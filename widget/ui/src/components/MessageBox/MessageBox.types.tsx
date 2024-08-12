import type { IconHighlight } from './MessageBox.styles.js';
import type * as Stitches from '@stitches/react';
import type { ReactNode } from 'react';

type BaseProps = Stitches.VariantProps<typeof IconHighlight>;
export type MessageType = Exclude<BaseProps['type'], object>;

export interface PropTypes {
  type: MessageType;
  title: string;
  description?: string | ReactNode;
  icon?: ReactNode;
}
