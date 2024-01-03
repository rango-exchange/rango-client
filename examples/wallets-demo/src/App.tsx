import type { BlockchainMeta, Token } from 'rango-sdk';

import { allProviders } from '@yeager-dev/provider-all';
import { ErrorIcon, Spinner, Typography } from '@yeager-dev/ui';
import { Provider } from '@yeager-dev/wallets-react';
import { RangoClient } from 'rango-sdk';
import React, { useEffect, useState } from 'react';

import List from './components/List';
import { WC_PROJECT_ID } from './constants';

const providers = allProviders({
  walletconnect2: {
    WC_PROJECT_ID: WC_PROJECT_ID,
  },
});

export function App() {
  const client = new RangoClient(process.env.REACT_APP_API_KEY as string);
  const [blockchains, setBlockChains] = useState<BlockchainMeta[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getAllBlockchains = async () => {
      try {
        const res = await client.getAllMetadata();
        setBlockChains(res.blockchains);
        setTokens(res.tokens);
      } catch (e) {
        setError(e instanceof Error ? e.message : JSON.stringify(e));
      }
      setLoading(false);
    };
    void getAllBlockchains();
  }, []);

  return (
    <Provider
      providers={providers}
      allBlockChains={blockchains}
      autoConnect={false}>
      {!process.env.REACT_APP_API_KEY && (
        <p className="ml-12 warning">
          <ErrorIcon color="warning" size={24} /> Please add REACT_APP_API_KEY
          into .env
        </p>
      )}
      <div className="flex">
        <h1 className="ml-12">Providers</h1>
        {loading && (
          <div className="flex">
            <Spinner size={20} />
            <Typography variant="body" size="xsmall">
              Loading...
            </Typography>
          </div>
        )}
      </div>
      {!!error && (
        <p className="ml-12 error">
          Failed Get Blockchains From Server: {error}
        </p>
      )}
      <List tokens={tokens} />
    </Provider>
  );
}
