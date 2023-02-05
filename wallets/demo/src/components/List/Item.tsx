import React, { useState } from 'react';
import { useWallets } from '@rangodev/wallets-core';
import { Network, WalletType } from '@rangodev/wallets-shared';
import './styles.css';
import { Tooltip } from 'react-tooltip';

function Item({ type }: { type: WalletType }) {
  const { connect, state, disconnect, canSwitchNetworkTo, getWalletInfo } = useWallets();
  const info = getWalletInfo(type);
  const walletState = state(type);
  const [network, setNetwork] = useState<Network>(Network.Unknown);
  const handleConnectWallet = async () => {
    try {
      if (!walletState.connected) {
        if (walletState.installed) await connect(type);
        else window.open(info.installLink, '_blank');
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
        <div className="header">
          <div className="title">
            <div className="image_div" style={{ backgroundColor: info.color }}>
              <img src={info.img} alt={info.name} width={35} />
            </div>
            <h3>{info.name}</h3>
          </div>
          <div
            className={`wallet_status ${walletState.connected ? 'connected' : 'disconnected'}`}
          />
        </div>

        {walletState.accounts?.length ? (
          <>
            <h4 style={{ marginTop: 8 }}>Accounts: </h4>
            <div className="account_box">
              {walletState.accounts?.map((account) => (
                <div className="account">{account}</div>
              ))}
            </div>
          </>
        ) : null}
        {walletState.network ? (
          <div style={{ marginTop: 10 }}>
            <h4>Chain: </h4>
            {walletState.network}
          </div>
        ) : null}
        <select
          name="Network"
          id="Network"
          onChange={(e) => setNetwork(e.target.value as Network)}
          disabled={!walletState.connected || !canSwitchNetworkTo(type, network)}>
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
          {walletState.connected ? 'Disconnect' : 'Connect'}({info.name})
        </button>
        <button
          id="change-network-button"
          disabled={!walletState.connected || !canSwitchNetworkTo(type, network)}
          onClick={handleChangeNetwork}>
          Change Network
        </button>
        {walletState.connected && !canSwitchNetworkTo(type, network) ? (
          <Tooltip
            anchorId="change-network-button"
            content="This wallet doesn't support network changing"
          />
        ) : null}
      </div>
    </div>
  );
}

export default Item;
