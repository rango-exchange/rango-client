export type Ref =
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

export type PropTypes = {
  label?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: 'small' | 'large';
  variant?: 'contained' | 'outlined' | 'ghost';
  fullWidth?: boolean;
  color?: 'dark' | 'light';
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'>;
