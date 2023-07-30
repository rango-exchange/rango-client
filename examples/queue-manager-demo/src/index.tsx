import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Events, Provider } from '@rango-dev/wallets-core';
import { allProviders } from '@rango-dev/provider-all';
import { RangoClient } from 'rango-sdk';
import { App } from './App';
import { WalletType } from '@rango-dev/wallets-shared';
import { WC_PROJECT_ID } from './configs';

const providers = allProviders({
  walletconnect2: {
    WC_PROJECT_ID: WC_PROJECT_ID,
  },
});

function AppContainer() {
  const [connectedWallets, setConnectedWallets] = useState<WalletType[]>([]);
  const client = new RangoClient(process.env.REACT_APP_API_KEY as string);

  // Because allBlockChains didn't use the BlockchainMeta type from rango-sdk, we have to use any type
  const [blockchains, setBlockChains] = useState<any>([]);
  const [, setError] = useState<string>('');
  const [, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getAllBlockchains = async () => {
      try {
        const res = await client.getAllMetadata();
        setBlockChains(res.blockchains);
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };
    getAllBlockchains();
  }, []);

  return (
    <Provider
      providers={providers}
      allBlockChains={blockchains}
      onUpdateState={(type, event, value, coreState) => {
        if (event === Events.ACCOUNTS && coreState.connected) {
          if (coreState.connected) {
            if (!connectedWallets.includes(type)) {
              const nextState = [...connectedWallets];
              nextState.push(type);
              setConnectedWallets(nextState);
            }
          } else {
            const nextState = [...connectedWallets].filter(
              (wallet) => wallet !== type
            );
            setConnectedWallets(nextState);
          }
        }
      }}>
      <App connectedWallets={connectedWallets} />
    </Provider>
  );
}

const container = document.getElementById('app')!;
const root = createRoot(container);
root.render(<AppContainer />);
