import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { Widget } from '@rango-dev/widget-embedded';
import React, { useRef } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

import {
  TON_CONNECT_MANIFEST_URL,
  TREZOR_MANIFEST,
  WC_PROJECT_ID,
} from './constants';
import { usePrivyProvider } from './usePrivyProvider';

export function App() {
  const [searchParams] = useSearchParams();
  const configRef = useRef<WidgetConfig>();
  const configParam = searchParams.get('config');
  const {
    provider: privyProvider,
    exportEvmWallet,
    exportSolanaWallet,
  } = usePrivyProvider();

  let config: WidgetConfig | undefined = undefined;

  if (!configRef.current) {
    if (!!configParam) {
      try {
        config = JSON.parse(configParam, (_, value) => {
          if (typeof value === 'string' && value[0] === '$') {
            return value.replace('$', '#');
          }
          return value;
        });
      } catch (error) {
        console.error('Widget config param is invalid!', error);
      }
    } else {
      /*
       *TODO:
       *The assumption here is this object won't be created on iframe so we are on dev mode.
       *We should consider a more proper way.
       */

      config = {
        apiKey: '',
        walletConnectProjectId: WC_PROJECT_ID,
        trezorManifest: TREZOR_MANIFEST,
        tonConnect: { manifestUrl: TON_CONNECT_MANIFEST_URL },
        wallets: ['metamask', privyProvider],
      };
    }
    if (!!config) {
      configRef.current = config;
    }
  }

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <div>
            <div>
              <button id="export-evm-btn" onClick={exportEvmWallet}>
                Export EVM Wallet
              </button>
              <button id="export-solana-btn" onClick={exportSolanaWallet}>
                Export Solana Wallet
              </button>
            </div>
            <Widget config={configRef.current} />
          </div>
        }
      />
    </Routes>
  );
}
