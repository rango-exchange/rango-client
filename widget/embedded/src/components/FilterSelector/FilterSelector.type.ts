export type PropTypes = {
  filterBy: string;
  onClickItem: (id: string) => void;
  list: Array<FilterItem>;
};

export type FilterItem = {
  id: string;
  title: string;
};

export type FilterSelectorPropTypes = PropTypes & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
