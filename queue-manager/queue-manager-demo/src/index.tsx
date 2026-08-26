import type { WalletType } from '@rango-dev/queue-manager-rango-preset';
import type { BlockchainMeta } from 'rango-types';

import { allProviders } from '@rango-dev/provider-all';
import { Events, Provider } from '@rango-dev/wallets-react';
import { RangoClient } from 'rango-sdk';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import {
  TON_CONNECT_MANIFEST_URL,
  TREZOR_MANIFEST,
  WC_PROJECT_ID,
} from './configs';

const providers = allProviders({
  walletconnect2: {
    WC_PROJECT_ID: WC_PROJECT_ID,
  },
  trezorManifest: TREZOR_MANIFEST,
  tonconnect: { manifestUrl: TON_CONNECT_MANIFEST_URL },
});

function AppContainer() {
  const [connectedWallets, setConnectedWallets] = useState<WalletType[]>([]);
  const client = new RangoClient(process.env.REACT_APP_RANGO_API_KEY as string);

  const [blockchains, setBlockChains] = useState<BlockchainMeta[]>([]);
  const [, setError] = useState<string>('');
  const [, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getAllBlockchains = async () => {
      try {
        const res = await client.getAllMetadata();
        setBlockChains(res.blockchains);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      }
      setLoading(false);
    };
    void getAllBlockchains();
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
