import React, { useEffect, useState } from 'react';
import { allProviders } from '@rangodev/provider-all';

import { getBlockchains } from './services';
import WalletsModal from './components/WalletsModal';
import { AdapterProvider } from '@rangodev/wallet-adapter';
const providers = allProviders();

export function App() {
  const [blockchains, setBlockChains] = useState([]);

  useEffect(() => {
    const getAllBlockchains = async () => {
      const res = await getBlockchains();
      setBlockChains(res);
    };
    getAllBlockchains();
  }, []);

  return (
    <AdapterProvider providers={providers} allBlockChains={blockchains}>
      <WalletsModal />
    </AdapterProvider>
  );
}
