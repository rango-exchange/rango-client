export interface PropTypes {
  onClick: () => void;
  value?: {
    name: string;
    logo: string;
  };
  title: string;
  placeholder: string;
  hasLogo?: boolean;
  disabled?: boolean;
}
