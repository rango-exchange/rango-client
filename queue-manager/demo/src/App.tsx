import React from "react";
import { Provider } from "@rangodev/queue-manager-react";
import { FlowsList } from "./components/FlowsList";
import { simpleSwapQueueDefinition } from "./flows/single";
import { swapQueueDef } from "./flows/swap/queueDef";
import { meta } from "./flows/rango/mock";
import { useWallets } from "@rangodev/wallets-core";
import { SwapQueueContext } from "./flows/swap/types";
import { metamaskWallet } from "./flows/rango/mock";
import { Wallet } from "./flows/rango/types";
import { Network, WalletType } from "@rangodev/wallets-shared";
import { Wallets } from "./components/Wallets";
import { History } from "./components/History";
import { notifier } from "./flows/swap/helpers";

const wallet: Wallet = metamaskWallet;

interface PropTypes {
  connectedWallets: WalletType[];
}

export function App(props: PropTypes) {
  const { providers, getSigners, state, canSwitchNetworkTo, connect } =
    useWallets();

  const switchNetwork = (wallet: WalletType, network: Network) => {
    if (!canSwitchNetworkTo(wallet, network)) {
      return undefined;
    }
    return connect(wallet, network);
  };

  const allProviders = providers();
  const queueContext: SwapQueueContext = {
    meta,
    getSigners,
    wallets: wallet,
    providers: allProviders,
    switchNetwork,
    connect,
    state,
    notifier,
  };

  return (
    <Provider
      // @ts-ignore
      queuesDefs={[simpleSwapQueueDefinition, swapQueueDef]}
      context={queueContext}
    >
      <Wallets />
      <h2>Flows</h2>
      <FlowsList connectedWallets={props.connectedWallets} />
      <h2>History</h2>
      <History />
    </Provider>
  );
}
