export type ListItemProps = {
  title?: string | React.ReactElement;
  description?: string | React.ReactElement;
  start?: React.ReactNode;
  end?: React.ReactNode;
  as?: 'div' | 'li' | 'button';
  onClick?: () => void;
  onKeyUp?: React.KeyboardEventHandler<HTMLLIElement>;
  hasDivider?: boolean;
  style?: React.CSSProperties;
};
