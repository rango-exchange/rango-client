type Item = {
  value: string;
  label: string;
};
export type PropTypes = {
  options: Item[];
  handleItemClick?: (item: Item) => void;
  value: Item;
  container?: HTMLElement;
};
