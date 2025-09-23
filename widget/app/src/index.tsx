import { PrivyProvider } from '@privy-io/react-auth';
import { layer as consoleLayer } from '@rango-dev/logging-console';
import { init, Level } from '@rango-dev/logging-subscriber';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';

if (process.env.NODE_ENV === 'development') {
  init([consoleLayer()], {
    baseLevel: Level.Info,
  });
}

const container = document.getElementById('app')!;
const root = createRoot(container);

root.render(
  <PrivyProvider
    appId="cmd5rsmwf00del30mzcyhyael"
    config={{
      /*
       * appearance: {
       *   theme: 'dark',
       *   loginMessage: 'yo welcome',
       *   landingHeader: 'header welcome',
       * },
       * Create embedded wallets for users who don't have a wallet
       */
      embeddedWallets: {
        ethereum: {
          createOnLogin: 'users-without-wallets',
        },
        solana: {
          createOnLogin: 'users-without-wallets',
        },
      },
      loginMethods: ['email'],
    }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PrivyProvider>
);
