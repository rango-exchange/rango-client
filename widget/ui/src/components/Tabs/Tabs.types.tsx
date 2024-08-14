import type { Tabs } from './Tabs.styles.js';
import type * as Stitches from '@stitches/react';

type BaseItem = {
  id: string | number;
  tooltip?: React.ReactNode;
};

type ItemWithTitle = BaseItem & {
  title: string;
  icon?: React.ReactNode;
};

type ItemWithIcon = BaseItem & {
  icon: React.ReactNode;
  title?: string;
};

type Item = ItemWithTitle | ItemWithIcon;
type BaseProps = Stitches.VariantProps<typeof Tabs>;
type BaseType = Exclude<BaseProps['type'], object>;
type BaseBorderRadius = Exclude<BaseProps['borderRadius'], object>;

export interface TabsPropTypes {
  items: Item[];
  container?: HTMLElement;
  onChange: (item: Item) => void;
  value: string;
  type: BaseType;
  borderRadius?: BaseBorderRadius;
  className?: string;
}
