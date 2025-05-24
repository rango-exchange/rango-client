import type { LegacyNamespaceMeta } from '@rango-dev/wallets-core/dist/legacy/mod';

export type PropTypes = {
  namespace: LegacyNamespaceMeta;
  error?: string;
  suffix?: React.ReactNode;
  connected?: boolean;
  address?: string;
  onClick?: () => void;
};

export type NamespaceUnsupportedItemPropTypes = {
  namespace: LegacyNamespaceMeta;
};
