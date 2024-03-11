import type { WidgetProps } from './Widget.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { DEFAULT_CONFIG } from '../../store/slices/config';
import { Main } from '../App';
import { WidgetProvider } from '../WidgetProvider';

export function Widget(props: PropsWithChildren<WidgetProps>) {
  if (!props.config?.externalWallets) {
    return (
      <WidgetProvider config={props.config ?? DEFAULT_CONFIG}>
        <Main />
      </WidgetProvider>
    );
  }
  return <Main />;
}
