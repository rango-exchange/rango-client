import { useWallets } from '@rango-dev/wallets-react';
import React from 'react';

import { walletTypes } from '../../providers';

function Wallets() {
  const { connect, state, disconnect, getWalletInfo } = useWallets();
  return (
    <div>
      <h3>Available Wallets</h3>
      <div className="wallets">
        {walletTypes.map((type) => {
          const wallet_type = type;
          const wallet_state = state(wallet_type);
          const namespaces = getWalletInfo(
            wallet_type
          ).needsNamespace?.data.map((namespace) => ({
            namespace: namespace.value,
            network: undefined,
          }));
          return (
            <div className="wallet" key={type}>
              <h5>{wallet_type}</h5>
              <p>Address: {wallet_state.accounts?.join(',')}</p>
              <button
                id={`${wallet_type}-connect`}
                onClick={() => {
                  if (wallet_state.connected) {
                    void disconnect(wallet_type);
                  } else {
                    void connect(wallet_type, namespaces);
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
