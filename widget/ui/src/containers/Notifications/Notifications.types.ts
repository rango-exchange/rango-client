import type { CSS } from '../../theme.js';
import type { Asset } from 'rango-types';

type Notification = {
  route: { from: Asset; to: Asset };
  event: { messageSeverity: string; message: string };
  requestId: string;
};

export type PropTypes = {
  list: Notification[];
  id: string;
  getBlockchainImage: (blockchain: string) => string | undefined;
  getTokenImage: (token: Asset) => string | undefined;
  onClickItem: (requestId: string) => void;
  onClearAll: () => void;
  containerStyles?: CSS;
};
