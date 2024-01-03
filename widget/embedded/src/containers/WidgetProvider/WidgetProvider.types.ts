import type { WidgetConfig } from '../../types';
import type { EventHandler } from '@yeager-dev/wallets-react';

export type PropTypes = {
  onUpdateState?: EventHandler;
  config: WidgetConfig;
};
