import type { WidgetConfig } from '../../types';
import type { EventHandler } from '@rango-dev/wallets-react';

export type PropTypes = {
  onUpdateState?: EventHandler;
  config: WidgetConfig;
};
