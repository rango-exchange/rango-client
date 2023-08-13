export interface PropTypes {
  image: string;
  title: string;
  subTitle?: string;
  tag?: string;
  suffix?: React.ReactNode;
  onClick?: () => void;
}
