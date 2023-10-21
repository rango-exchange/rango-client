export interface PropTypes {
  onClick: () => void;
  value: { label?: string; logo?: string };
  title: string;
  iconTitle?: React.ReactNode;
  placeholder?: string;
  hasLogo?: boolean;
  disabled?: boolean;
}
