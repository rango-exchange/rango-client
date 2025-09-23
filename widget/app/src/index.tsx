import { PrivyProvider } from '@privy-io/react-auth';
import { layer as consoleLayer } from '@rango-dev/logging-console';
import { init, Level } from '@rango-dev/logging-subscriber';
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit';
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
       */ solana: {
        rpcs: {
          'solana:mainnet': {
            rpc: createSolanaRpc(
              'https://purple-practical-friday.solana-mainnet.quiknode.pro/d94ab067f793d48c81354c78c86ae908d9fc1582/'
            ),
            rpcSubscriptions: createSolanaRpcSubscriptions(
              'wss://api.mainnet-beta.solana.com'
            ),
          },
        },
      },
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
