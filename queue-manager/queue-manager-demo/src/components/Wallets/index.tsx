import { allProviders, WalletTypes } from '@rango-dev/provider-all';
import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';

import {
  TON_CONNECT_MANIFEST_URL,
  TREZOR_MANIFEST,
  WC_PROJECT_ID,
} from '../../configs';

export const providers = allProviders({
  [WalletTypes.WALLET_CONNECT_2]: { WC_PROJECT_ID },
  [WalletTypes.TREZOR]: { manifest: TREZOR_MANIFEST },
  [WalletTypes.TON_CONNECT]: { manifestUrl: TON_CONNECT_MANIFEST_URL },
}).map((build) => build());

export const wallets = providers.map((provider) => provider.id);

function Wallets() {
  const { connect, state, disconnect } = useWallets();
  return (
    <div>
      <h3>Available Wallets</h3>
      <div className="wallets">
        {wallets.map((type) => {
          const wallet_type = type;
          const wallet_state = state(wallet_type);
          return (
            <div className="wallet" key={type}>
              <h5>{wallet_type}</h5>
              <p>Address: {wallet_state.accounts?.join(',')}</p>
              <button
                id={`${type}-connect`}
                onClick={() => {
                  if (wallet_state.connected) {
                    void disconnect(wallet_type);
                  } else {
                    void connect(wallet_type);
                  }
                }}>
                {wallet_state.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Wallets };
