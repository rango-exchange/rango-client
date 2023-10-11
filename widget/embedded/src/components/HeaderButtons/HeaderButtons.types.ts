export interface PropTypes {
  onClick: () => void;
  isConnected?: boolean;
  container?: HTMLElement;
}
export interface HomeButtonsPropTypes {
  layoutRef: HTMLDivElement | null;
  onClickRefresh?: () => void;
  onClickHistory?: () => void;
  onClickSettings?: () => void;
  onClickNotifications?: () => void;
}
