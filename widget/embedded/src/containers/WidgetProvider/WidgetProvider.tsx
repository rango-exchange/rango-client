import type { PropTypes } from './WidgetProvider.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import QueueManager from '../../QueueManager';
import { WidgetWallets } from '../Wallets';
import { WidgetInfo } from '../WidgetInfo';

export function WidgetProvider(props: PropsWithChildren<PropTypes>) {
  const { onUpdateState, config } = props;
  return (
    <WidgetWallets config={config} onUpdateState={onUpdateState}>
      <QueueManager apiKey={config.apiKey}>
        <WidgetInfo>{props.children}</WidgetInfo>
      </QueueManager>
    </WidgetWallets>
  );
}
