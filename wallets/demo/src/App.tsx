import React, { useEffect, useState } from "react";
import { Provider } from "@rangodev/wallets-core";
import List from "./components/List";
import { allProviders } from "@rangodev/provider-all";
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

  return (
    <div>
      <Provider providers={providers} allBlockChains={allBlockChains}>
        <h1>Providers</h1>
        <List />
      </Provider>
    </div>
  );
}
