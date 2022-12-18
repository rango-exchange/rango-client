import React from "react";
import { Provider } from "@rangodev/wallets-core";
import List from "./components/List";
import { allProviders } from "@rangodev/provider-all";

export function App() {
  return (
    <div>
      <Provider providers={allProviders()} walletsAndSupportedChains={null}>
        <h1>Providers</h1>
        <List />
      </Provider>
    </div>
  );
}
