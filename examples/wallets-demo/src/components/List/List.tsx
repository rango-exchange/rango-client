import type { WalletInfo } from '@rango-dev/wallets-shared';
import type { Token } from 'rango-sdk';

import { allProviders } from '@rango-dev/provider-all';
import { useWallets } from '@rango-dev/wallets-react';
import { sortWalletsBasedOnState } from '@rango-dev/wallets-shared';
import React from 'react';

import { TREZOR_MANIFEST, WC_PROJECT_ID } from '../../constants';

import Item from './Item';

import './styles.css';

function List({ tokens }: { tokens: Token[] }) {
  const { state, getWalletInfo } = useWallets();
  const providerTypes = allProviders({
    walletconnect2: { WC_PROJECT_ID: WC_PROJECT_ID },
    trezorManifest: TREZOR_MANIFEST,
  }).map((p) => p.config.type);
  const allWallets = sortWalletsBasedOnState(
    providerTypes.map((type) => {
      const walletState = state(type);
      const connected = walletState.connected;
      const installed = walletState.installed;
      const info = getWalletInfo(type);
      return {
        type,
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
