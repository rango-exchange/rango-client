type Item<T> = {
  value: T;
  label: string;
};

type Variant = 'filled' | 'outlined';

export type SelectPropTypes<T> = {
  options: Item<T>[];
  handleItemClick?: (item: Item<T>) => void;
  value: string;
  container?: HTMLElement;
  variant: Variant;
};
