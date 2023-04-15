import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Events, Provider as WalletsProvider } from "@rango-dev/wallets-core";
import { allProviders } from "@rango-dev/provider-all";
import { App } from "./App";
import { walletsAndSupportedChains } from "./flows/rango/mock";
import { WalletType } from "@rango-dev/wallets-shared";

const providers = allProviders();

function AppContainer() {
  const [connectedWallets, setConnectedWallets] = useState<WalletType[]>([]);
  console.log("connected", connectedWallets);

  return (
    <WalletsProvider
      providers={providers}
      allBlockChains={walletsAndSupportedChains}
      onUpdateState={(type, event, value, coreState) => {
        if (event === Events.ACCOUNTS && coreState.connected) {
          console.log({ type, event });
          if (coreState.connected) {
            if (!connectedWallets.includes(type)) {
              const nextState = [...connectedWallets];
              nextState.push(type);
              setConnectedWallets(nextState);
            }
          } else {
            const nextState = [...connectedWallets].filter(
              (wallet) => wallet !== type
            );
            setConnectedWallets(nextState);
          }
        }
      }}
    >
      <App connectedWallets={connectedWallets} />
    </WalletsProvider>
  );
}

const container = document.getElementById("app")!!;
const root = createRoot(container);
root.render(<AppContainer />);
