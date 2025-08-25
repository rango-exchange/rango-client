import type { RefuelProps } from './Refuel.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { AppRouter } from '../../components/AppRouter';
import { DEFAULT_CONFIG } from '../../store/slices/config';
import { Main } from '../App';
import { WidgetProvider } from '../WidgetProvider';

export function Refuel(props: PropsWithChildren<RefuelProps>) {
  const isExternalWalletsEnabled = props.config?.externalWallets;

  return (
    <AppRouter>
      {isExternalWalletsEnabled ? (
        <Main />
      ) : (
        <WidgetProvider config={props.config ?? DEFAULT_CONFIG}>
          <Main />
        </WidgetProvider>
      )}
    </AppRouter>
  );
}
