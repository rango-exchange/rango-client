import type { WidgetConfig } from '../../types';
import type { LegacyEventHandler as EventHandler } from '@rango-dev/wallets-core';

export type PropTypes = {
  onUpdateState?: EventHandler;
  config: WidgetConfig;
};
