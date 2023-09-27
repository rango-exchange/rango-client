export interface PropTypes {
  onClick: () => void;
  isConnected?: boolean;
}
export interface HomeButtonsPropTypes {
  layoutRef: HTMLDivElement | null;
  onClickRefresh?: () => void;
  onClickHistory?: () => void;
  onClickSettings?: () => void;
  onClickNotifications?: () => void;
}
