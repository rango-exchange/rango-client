import type { WidgetProps } from './Widget.types';
import type { PropsWithChildren } from 'react';

import React, { useEffect } from 'react';

import { DEFAULT_CONFIG } from '../../store/slices/config';
import { destroyTabManager } from '../../store/ui';
import { Main } from '../App';
import { WidgetProvider } from '../WidgetProvider';

export function Widget(props: PropsWithChildren<WidgetProps>) {
  useEffect(() => {
    return destroyTabManager;
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
