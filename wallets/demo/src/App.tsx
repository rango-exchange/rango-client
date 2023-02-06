import React, { useEffect, useState } from 'react';
import { Provider } from '@rangodev/wallets-core';
import List from './components/List';
import { allProviders } from '@rangodev/provider-all';
import { RangoClient } from 'rango-sdk';

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
    <Provider providers={providers} allBlockChains={blockchains}>
      <h1 style={{marginLeft:12}}>Providers</h1>
      <List />
    </Provider>
  );
}
