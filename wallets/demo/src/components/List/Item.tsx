import React, { useState } from "react";
import { useWallets } from "@rangodev/wallets-core";
import { BlockchainMeta, Network, WalletType } from "@rangodev/wallets-shared";
import { walletsAndSupportedChains, WALLET_LINKS } from "../../constant";
import { CapitalizeFirstLetter } from "../../utils";
import "./styles.css";

function Item({
  type,
  allBlockChains,
}: {
  type: WalletType;
  allBlockChains: BlockchainMeta[];
}) {
  const { connect, state, disconnect, canSwitchNetworkTo } = useWallets();
  const supportedChains = walletsAndSupportedChains({ allBlockChains });
  const networks = supportedChains[type];
  const walletState = state(type);
  const [network, setNetwork] = useState<Network>(Network.AKASH);
  const handleConnectWallet = () => {
    if (!walletState.connected) {
      if (walletState.installed) connect(type);
      else window.open(WALLET_LINKS[type], "_blank");
    } else {
      disconnect(type);
    }
  };

  const handleChangeNetwork = () => {
    const canSwitchNetwork = canSwitchNetworkTo(type, network);
    if (canSwitchNetwork) {
      connect(type, network);
    }
  };

  return (
    <div className="wallet_box">
      <div>
        <h3>{CapitalizeFirstLetter(type)}</h3>
        <div
          className={`wallet_status ${
            walletState.connected ? "connected" : "disconnected"
          }`}
        >
          {walletState.connected ? "Connected" : "Disconnected"}
        </div>
        <div style={{ marginTop: 8 }}>
          Accounts:
          {walletState.accounts?.map((account) => (
            <div className="account">{account}</div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          Chain:
          {walletState.network}
        </div>
        <select
          name="Network"
          id="Network"
          onChange={(e) => setNetwork(e.target.value as Network)}
        >
          <option value="-1" selected>
            Default Chain
          </option>
          {networks.map((network) => (
            <option key={network.name} value={network.name}>
              {network.displayName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button onClick={handleConnectWallet}>
          {walletState.connected ? "Disconnect" : "Connect"}(
          {CapitalizeFirstLetter(type)})
        </button>
        <button disabled={!walletState.connected} onClick={handleChangeNetwork}>
          Change Network
        </button>
      </div>
    </div>
  );
}

export default Item;
