import React, { useEffect, useState } from "react";
import { Provider, WalletsAndSupportedChains } from "@rangodev/wallets-core";
import List from "./components/List";
import { allProviders } from "@rangodev/provider-all";
import { walletsAndSupportedChains } from "./constant";
import { getBlockchains } from "./services";
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
  const supportedChains: WalletsAndSupportedChains = walletsAndSupportedChains({
    allBlockChains,
  });
  return (
    <div>
      <Provider
        providers={providers}
        walletsAndSupportedChains={supportedChains}
      >
        <h1>Providers</h1>
        <List allBlockChains={allBlockChains} />
      </Provider>
    </div>
  );
}
