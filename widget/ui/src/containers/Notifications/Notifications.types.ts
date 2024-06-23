import type { CSS } from '../../theme';
import type { Asset } from 'rango-sdk';

type Notification = {
  route: { from: Asset; to: Asset };
  event: { messageSeverity: string; message: string };
  requestId: string;
};

export type PropTypes = {
  list: Notification[];
  getBlockchainImage: (blockchain: string) => string;
  getTokenImage: (token: Asset) => string;
  onClickItem: (requestId: string) => void;
  onClearAll: () => void;
  containerStyles?: CSS;
};
