import React, { useState } from "react";
import { useWallets } from "@rangodev/wallets-core";
import { Network, WalletType } from "@rangodev/wallets-shared";
import "./styles.css";

function Item({ type }: { type: WalletType }) {
  const { connect, state, disconnect, canSwitchNetworkTo, getWalletInfo } =
    useWallets();
  const info = getWalletInfo(type);
  const walletState = state(type);
  const [network, setNetwork] = useState<Network>(Network.Unknown);
  const handleConnectWallet = async () => {
    try {
      if (!walletState.connected) {
        if (walletState.installed) await connect(type);
        else window.open(info.installLink, "_blank");
      } else {
        disconnect(type);
      }
    } catch (err) {
      console.log({ err });
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
        <div className="title">
          <div className="image_div" style={{ backgroundColor: info.color }}>
            <img src={info.img} alt={info.name}  width={35} />
          </div>
          <h3>{info.name}</h3>
        </div>

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
          {info.supportedChains.map((network) => (
            <option key={network.name} value={network.name}>
              {network.displayName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button onClick={handleConnectWallet}>
          {walletState.connected ? "Disconnect" : "Connect"}({info.name})
        </button>
        <button disabled={!walletState.connected} onClick={handleChangeNetwork}>
          Change Network
        </button>
      </div>
    </div>
  );
}

export default Item;
