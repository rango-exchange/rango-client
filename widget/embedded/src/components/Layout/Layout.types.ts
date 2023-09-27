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
  noPadding?: boolean;
}

export type Ref =
  | ((instance: HTMLDivElement | null) => void)
  | React.RefObject<HTMLDivElement>
  | null
  | undefined;
