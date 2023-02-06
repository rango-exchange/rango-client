import React, { useState } from 'react';
import { useWallets } from '@rangodev/wallets-core';
import { Network, WalletType } from '@rangodev/wallets-shared';
import './styles.css';
import { Button, InfoCircleIcon, Spacer, SwapWalletIcon, Tooltip, Typography } from '@rangodev/ui';
import {
  evmBasedChainsSelector,
  prepareAccounts,
  walletAndSupportedChainsNames,
} from '../../helper';
import SignatureIcon from '../signature';

const DEFAULT_WALLET_INJECTION_ERROR =
  'Failed to connect to wallet, if you have turned injection off (disable default wallet for xDefi), turn it on and refresh the page';

function Item({ type }: { type: WalletType }) {
  const { connect, state, disconnect, canSwitchNetworkTo, getWalletInfo, getSigners } =
    useWallets();
  const info = getWalletInfo(type);
  const walletState = state(type);
  const [network, setNetwork] = useState<Network>(Network.Unknown);
  const [error, setError] = useState<string>('');
  const evmBasedChains = evmBasedChainsSelector(info.supportedChains);
  const handleConnectWallet = async () => {
    try {
      if (!walletState.connected) {
        if (walletState.installed) {
          const result = await connect(type);
          setError('');
          setNetwork(result.network || Network.Unknown);
        } else window.open(info.installLink, '_blank');
      } else {
        disconnect(type);
      }
    } catch (err) {
      setError('Error: ' + (err.message || DEFAULT_WALLET_INJECTION_ERROR));
    }
  };
  const canSwitchNetwork = network !== Network.Unknown && canSwitchNetworkTo(type, network);
  if (type === WalletType.KEPLR) console.log(evmBasedChains.length);
  const handleChangeNetwork = async () => {
    if (canSwitchNetwork) {
      try {
        const result = await connect(type, network);
        setError('');
        setNetwork(result.network || Network.Unknown);
      } catch (err) {
        setError('Error: ' + (err.message || DEFAULT_WALLET_INJECTION_ERROR));
      }
    }
  };
  const handleSigner = () => {
    const supportedChainsNames = walletAndSupportedChainsNames(info.supportedChains);
    const activeAccount = prepareAccounts(
      walletState.accounts || [],
      walletState.network,
      evmBasedChains,
      supportedChainsNames,
    ).find((a) => a.accounts.find((b) => b.isConnected));
    const signers = getSigners(type);
    signers
      .signEvmMessage(activeAccount?.accounts[0]?.address || '', 'sign test')
      .then((signature) => {
        console.log(signature);
      })
      .catch((ex) => {
        console.log(ex);
      });
  };
  return (
    <div className="wallet_box">
      <div>
        <div className="header">
          {walletState.connected ? (
            <div className="title">
              <div className="image_div">
                <img src={info.img} alt={info.name} width={35} />
              </div>
              <h3>{info.name}</h3>
            </div>
          ) : (
            <div />
          )}
          <div className="info">
            {walletState.connected && !canSwitchNetwork && (
              <>
                <Tooltip content="This wallet doesn't support network changing" color="gray">
                  <InfoCircleIcon size={24} color="success" />
                </Tooltip>
                <Spacer size={12} />
              </>
            )}
            <div
              className={`wallet_status ${walletState.connected ? 'connected' : 'disconnected'}`}
            />
          </div>
        </div>

        {walletState.connected ? (
          <>
            <h4 style={{ marginTop: 8 }}>Accounts: </h4>
            <div className="account_box">
              {walletState?.accounts?.map((account) => (
                <div className="account">{account}</div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <h4>Chain: </h4>
              <div style={{ fontSize: 14 }}>{walletState?.network}</div>
            </div>
          </>
        ) : (
          <div className="body">
            <img src={info.img} alt={info.name} width={100} />
            <h2>{info.name}</h2>
            <Typography variant="body2">
              {!walletState.installed
                ? 'The wallet is not installed'
                : 'The wallet is disconnected'}
            </Typography>
          </div>
        )}

        {error && (
          <p className="error-msg">
            <InfoCircleIcon color="error" size={16} />
            {error}
          </p>
        )}
      </div>

      <div>
        <select
          name="Network"
          id="Network"
          onChange={(e) => setNetwork(e.target.value as Network)}
          disabled={!walletState.connected || !canSwitchNetwork}>
          <option value="-1" selected>
            Default Chain
          </option>
          {info.supportedChains.map((network) => (
            <option key={network.name} value={network.name}>
              {network.displayName}
            </option>
          ))}
        </select>
        <div className="flex">
          <Button
            style={{ marginBottom: 12 }}
            fullWidth
            type="primary"
            onClick={handleConnectWallet}>
            {!walletState.installed ? 'Install' : walletState.connected ? 'Disconnect' : 'Connect'}
          </Button>
          <Spacer size={12} />
          <Button
            fullWidth
            disabled={!walletState.connected || !canSwitchNetwork}
            type="primary"
            onClick={handleChangeNetwork}>
            Change Network
          </Button>
        </div>
        <div className="flex">
          <Button
            fullWidth
            disabled={!walletState.connected}
            type="primary"
            suffix={<SignatureIcon width={24} height={24} />}
            onClick={() =>
              evmBasedChains.length
                ? handleSigner()
                : alert('At the moment, you can only test the signature on the EVM wallets')
            }>
            Sign
          </Button>
          <Spacer size={12} />
          <Button
            fullWidth
            disabled={!walletState.connected}
            suffix={<SwapWalletIcon size={24} color={'white'} />}
            type="primary"
            onClick={() => alert("Swap hasn't been implemented yet")}>
            Swap
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Item;
