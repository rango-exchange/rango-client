import type { ListItemProps } from '../ListItem';

export type ListItemButtonProps = Omit<ListItemProps, 'onClick'> & {
  id: string;
  onClick: (id: string) => void;
};
