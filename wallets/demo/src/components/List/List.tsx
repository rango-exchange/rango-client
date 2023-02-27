import React from 'react';
import { useWallets } from '@rango-dev/wallets-core';
import { sortWalletsBasedOnState, WalletInfo, WalletType } from '@rango-dev/wallets-shared';
import Item from './Item';
import './styles.css';
const excludedWallets = [WalletType.UNKNOWN, WalletType.TERRA_STATION, WalletType.LEAP, WalletType.TRON_LINK];

function List() {
  const { state, getWalletInfo } = useWallets();
  const allWallets = sortWalletsBasedOnState(
    Object.keys(WalletType)
      .filter((i) => !excludedWallets.includes(WalletType[i]))
      .map((type) => {
        const walletState = state(WalletType[type]);
        const connected = walletState.connected;
        const installed = walletState.installed;
        const info = getWalletInfo(WalletType[type]);
        return {
          type: WalletType[type],
          connected,
          extensionAvailable: installed,
          info,
        };
      }),
  );
  return (
    <div className="row">
      {allWallets.map((wallet) => (
        <Item key={wallet.type} type={wallet.type} info={wallet.info as WalletInfo} />
      ))}
    </div>
  );
}

export default List;
