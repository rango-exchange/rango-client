import type { WidgetProps } from './Widget.types';
import type { PropsWithChildren } from 'react';

import { initWeb3InboxClient } from '@web3inbox/react';
import React from 'react';

import { AppRouter } from '../../components/AppRouter';
import { DEFAULT_CONFIG } from '../../store/slices/config';
import { Main } from '../App';
import { WidgetProvider } from '../WidgetProvider';

const WEB_NOTIFICATIONS_PROJECT_ID = 'ca78db14099bb7eb0935d32a93605eb6';
const APP_DOMAIN = 'https://app.rango.exchange/';

export function Widget(props: PropsWithChildren<WidgetProps>) {
  const isExternalWalletsEnabled = props.config?.externalWallets;
  void initWeb3InboxClient({
    projectId: WEB_NOTIFICATIONS_PROJECT_ID,
    domain: APP_DOMAIN,
    allApps: true,
  });

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
