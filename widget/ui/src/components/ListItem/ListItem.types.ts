export type ListItemPropTypes = {
  id?: string;
  title?: string | React.ReactElement;
  description?: string | React.ReactElement;
  start?: React.ReactNode;
  end?: React.ReactNode;
  as?: 'div' | 'li';
  onClick?: () => void;
  onKeyUp?: React.KeyboardEventHandler<HTMLLIElement>;
  hasDivider?: boolean;
  tabIndex?: number;
  className?: string;
};
