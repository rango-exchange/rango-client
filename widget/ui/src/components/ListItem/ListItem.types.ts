export type ListItemProps = {
  title?: string | React.ReactElement;
  description?: string;
  start?: React.ReactNode;
  end?: React.ReactNode;
  as?: 'div' | 'li';
  onClick?: () => void;
};
