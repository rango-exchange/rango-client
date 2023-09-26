export interface PropTypes {
  header: {
    title: string;
    hasConnectWallet?: boolean;
    hasSettings?: boolean;
    suffix?: React.ReactNode;
    onBack?: () => void;
    onCancel?: () => void;
  };
  hasLogo?: boolean;
  footer?: React.ReactNode;
  fixedHeight?: boolean;
}
