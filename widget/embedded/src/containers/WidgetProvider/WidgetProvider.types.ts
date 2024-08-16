import type { WidgetConfig } from '../../types';
import type { LegacyEventHandler as EventHandler } from '@rango-dev/wallets-core/legacy';

export type PropTypes = {
  onUpdateState?: EventHandler;
  config: WidgetConfig;
};
