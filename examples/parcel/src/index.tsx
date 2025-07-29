import React from 'react';
import ReactDOM from 'react-dom/client';

import { Widget } from '@rango-dev/widget-embedded';

const App = () => {
  return (
    <Widget
      config={{
        apiKey: 'c6381a79-2817-4602-83bf-6a641a409e32',
        walletConnectProjectId: 'e24844c5deb5193c1c14840a7af6a40b',
      }}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
