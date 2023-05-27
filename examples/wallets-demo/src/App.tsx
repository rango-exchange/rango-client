import React, { useEffect, useState } from 'react';
import { Provider } from '@rango-dev/wallets-core';
import { normalizeMetaData } from '@rango-dev/wallets-shared';
import List from './components/List';
import { allProviders } from '@rango-dev/provider-all';
import { RangoClient } from 'rango-sdk';
import { InfoCircleIcon, Spinner, Typography } from '@rango-dev/ui';

const providers = allProviders();

export function App() {
  const client = new RangoClient(process.env.REACT_APP_API_KEY as string);
  // Because allBlockChains didn't use the BlockchainMeta type from rango-sdk, we have to use any type
  const [blockchains, setBlockChains] = useState<any>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAllBlockchains = async () => {
      try {
        const res = await client.getAllMetadata();
        setBlockChains(normalizeMetaData(res.blockchains));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
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
      <div className="flex">
        <h1 className="ml-12">Providers</h1>
        {loading && (
          <div className="flex">
            <Spinner size={20} /> <Typography variant="caption">Loading...</Typography>
          </div>
        )}
      </div>
      {!!error && <p className="ml-12 error">Failed Get Blockchains From Server: {error}</p>}
      <List />
    </Provider>
  );
}
