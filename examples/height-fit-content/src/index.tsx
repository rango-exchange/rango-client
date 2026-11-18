import React from 'react';
import ReactDOM from 'react-dom/client';

import { allProviders, WalletTypes } from '@rango-dev/provider-all';
import { Widget } from '@rango-dev/widget-embedded';

// Built once, outside the component: providers hold state.
const wallets = allProviders({
  [WalletTypes.WALLET_CONNECT_2]: {
    WC_PROJECT_ID: 'e24844c5deb5193c1c14840a7af6a40b',
  },
}).map((build) => build());

const App = () => {
  return (
    <Widget
      config={{
        apiKey: 'c6381a79-2817-4602-83bf-6a641a409e32',
        wallets,
      }}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
