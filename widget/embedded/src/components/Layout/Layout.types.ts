export interface PropTypes {
  header: {
    title: string;
    onWallet?: () => void;
    hasSettings?: boolean;
    suffix?: React.ReactNode;
    hasBackButton?: boolean;
    onCancel?: () => void;
  };
  hasLogo?: boolean;
  footer?: React.ReactNode;
  noPadding?: boolean;
  fixedHeight?: boolean;
}

export type Ref =
  | ((instance: HTMLDivElement | null) => void)
  | React.RefObject<HTMLDivElement>
  | null
  | undefined;
