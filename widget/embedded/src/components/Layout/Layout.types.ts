export interface PropTypes {
  header: {
    title: string;
    hasConnectWallet?: boolean;
    hasSettings?: boolean;
    suffix?: React.ReactNode;
    onBack?: () => void;
    onCancel?: () => void;
  };
  hasFooter?: boolean;
  action?: React.ReactNode;
  fixedHeight?: boolean;
}
