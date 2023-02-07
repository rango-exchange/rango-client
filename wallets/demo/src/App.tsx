import React, { useEffect, useState } from 'react';
import { Provider } from '@rangodev/wallets-core';
import List from './components/List';
import { allProviders } from '@rangodev/provider-all';
import { RangoClient } from 'rango-sdk';
import { InfoCircleIcon } from '@rangodev/ui';

const providers = allProviders();

export function App() {
  const client = new RangoClient(process.env.REACT_APP_API_KEY as string);
  // Because allBlockChains didn't use the BlockchainMeta type from rango-sdk, we have to use any type
  const [blockchains, setBlockChains] = useState<any>([]);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    const getAllBlockchains = async () => {
      try {
        const res = await client.getAllMetadata();
        setBlockChains(res.blockchains);
      } catch (e) {
        console.log('failed on connect.', e);
        setError(e.message);
      }
    };
    getAllBlockchains();
  }, []);

  return (
    <Provider providers={providers} allBlockChains={blockchains}>
      {!process.env.REACT_APP_API_KEY && (
        <p className="ml-12 warning">
          <InfoCircleIcon color="warning" size={24} /> Please add REACT_APP_API_KEY into .env
        </p>
      )}
      <h1 className="ml-12">Providers</h1>
      {!!error && <p className="ml-12 error">Failed Get Blockchains From Server: {error}</p>}
      <List />
    </Provider>
  );
}
