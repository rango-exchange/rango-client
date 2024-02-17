export interface PropTypes {
  onClick: () => void;
  isConnected?: boolean;
  container?: HTMLElement;
}
export interface HeaderButtonsPropTypes {
  onClickSettings?: () => void;
  onClickRefresh?: () => void;
  onClickHistory?: () => void;
  hidden?: ('settings' | 'refresh' | 'history' | 'notifications')[];
}
