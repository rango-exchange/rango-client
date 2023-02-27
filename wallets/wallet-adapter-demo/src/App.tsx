import React, { useEffect, useState } from 'react';
import { allProviders } from '@rango-dev/provider-all';
import WalletsModal from './components/WalletsModal';
import { RangoClient } from 'rango-sdk';
import { AdapterProvider } from '@rango-dev/wallet-adapter';

const providers = allProviders();
export function App() {
  const client = new RangoClient(process.env.REACT_APP_API_KEY as string);

  // Because allBlockChains didn't use the BlockchainMeta type from rango-sdk, we have to use any type
  const [blockchains, setBlockChains] = useState<any>([]);

  useEffect(() => {
    const getAllBlockchains = async () => {
      try {
        const res = await client.getAllMetadata();
        setBlockChains(res.blockchains);
      } catch (e) {
        console.log('failed on connect.', e);
      }
    };
    getAllBlockchains();
  }, []);

  return (
    <AdapterProvider providers={providers} allBlockChains={blockchains}>
      <WalletsModal />
    </AdapterProvider>
  );
}
