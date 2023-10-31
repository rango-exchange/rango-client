export interface PropTypes {
  onReset: () => void;
  label: string;
  placeholder?: string;
  color?: string;
  onChangeColor: (color?: string) => void;
  resetDisable?: boolean;
}
