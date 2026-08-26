import type { NamespaceMeta } from '@rango-dev/wallets-react';

export type PropTypes = {
  namespace: NamespaceMeta;
  error?: string;
  suffix?: React.ReactNode;
  connected?: boolean;
  address?: string | null;
  onClick?: () => void;
};

export type NamespaceUnsupportedItemPropTypes = {
  namespace: NamespaceMeta;
};
