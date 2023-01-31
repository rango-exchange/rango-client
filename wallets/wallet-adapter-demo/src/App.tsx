import React, { useEffect, useState } from 'react';
import { allProviders } from '@rangodev/provider-all';
import WalletsModal from './components/WalletsModal';
import { BlockchainMeta, RangoClient } from 'rango-sdk';
import { AdapterProvider } from '@rangodev/wallet-adapter';
const providers = allProviders();
export function App() {
  const client = new RangoClient(process.env.REACT_API_KEY as string);

  const [blockchains, setBlockChains] = useState<BlockchainMeta[]>([]);

  useEffect(() => {
    const getAllBlockchains = async () => {
      const res = await client.getAllMetadata();
      if (res) setBlockChains(res.blockchains);
    };
    getAllBlockchains();
  }, []);

  return (
    <AdapterProvider providers={providers} allBlockChains={blockchains}>
      <WalletsModal />
    </AdapterProvider>
  );
}
