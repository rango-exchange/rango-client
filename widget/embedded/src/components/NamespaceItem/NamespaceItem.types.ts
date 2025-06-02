import type { LegacyNamespaceMeta } from '@rango-dev/wallets-core/legacy';

export type PropTypes = {
  namespace: LegacyNamespaceMeta;
  error?: string;
  suffix?: React.ReactNode;
  connected?: boolean;
  address?: string | null;
  onClick?: () => void;
};

export type NamespaceUnsupportedItemPropTypes = {
  namespace: LegacyNamespaceMeta;
};
