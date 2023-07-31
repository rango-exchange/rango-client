import React from 'react';
import { useWallets } from '@rango-dev/wallets-core';
import {
  sortWalletsBasedOnState,
  WalletInfo,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import Item from './Item';
import './styles.css';
import { Token } from 'rango-sdk';
const excludedWallets = [WalletTypes.LEAP, WalletTypes.WALLET_CONNECT];

function List({ tokens }: { tokens: Token[] }) {
  const { state, getWalletInfo } = useWallets();
  const allWallets = sortWalletsBasedOnState(
    Object.keys(WalletTypes)
      .filter((i) => !excludedWallets.includes(WalletTypes[i]))
      .map((type) => {
        const walletState = state(WalletTypes[type]);
        const connected = walletState.connected;
        const installed = walletState.installed;
        const info = getWalletInfo(WalletTypes[type]);
        return {
          type: WalletTypes[type],
          connected,
          extensionAvailable: installed,
          info,
        };
      })
  );
  return (
    <div className="row">
      {allWallets.map((wallet) => (
        <Item
          key={wallet.type}
          type={wallet.type}
          info={wallet.info as WalletInfo}
          tokens={tokens}
        />
      ))}
    </div>
  );
}

export default List;
