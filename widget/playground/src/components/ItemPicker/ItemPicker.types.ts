export interface PropTypes {
  onClick: () => void;
  value: {
    label?: string;
    logo?: string | React.ComponentType<{ size?: number }>;
  };
  title: string;
  iconTitle?: React.ReactNode;
  placeholder?: string;
  hasLogo?: boolean;
  disabled?: boolean;
}
