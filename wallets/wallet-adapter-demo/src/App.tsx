import React, { useEffect, useState } from 'react';
import { allProviders } from '@rangodev/provider-all';

import { getBlockchains } from './services';
import WalletsModal from './components/WalletsModal';
import { AdapterProvider } from '@rangodev/wallet-adapter';
const providers = allProviders();

export function App() {
  const [allBlockChains, setAllBlockChains] = useState([]);

  useEffect(() => {
    const getAllBlockchains = async () => {
      const res = await getBlockchains();
      setAllBlockChains(res);
    };
    getAllBlockchains();
  }, []);

  return (
    <div>
      <AdapterProvider providers={providers} allBlockChains={allBlockChains}>
        <WalletsModal />
      </AdapterProvider>
    </div>
  );
}
