export interface PropTypes {
  header: {
    title: string;
    hasConnectWallet?: boolean;
    suffix?: React.ReactNode;
    onBack?: () => void;
    onCancel?: () => void;
  };
  hasFooter?: boolean;
}
