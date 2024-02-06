import type { WidgetProps } from './Widget.types';
import type { PropsWithChildren } from 'react';

import React, { useEffect } from 'react';

import { DEFAULT_CONFIG } from '../../store/slices/config';
import { tabManager } from '../../store/ui';
import { Main } from '../App';
import { WidgetProvider } from '../WidgetProvider';

export function Widget(props: PropsWithChildren<WidgetProps>) {
  useEffect(() => {
    tabManager.init();
    return tabManager.destroy;
  }, []);

  if (!props.config?.externalWallets) {
    return (
      <WidgetProvider config={props.config ?? DEFAULT_CONFIG}>
        <Main />
      </WidgetProvider>
    );
  }
  return <Main />;
}
