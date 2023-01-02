import React from "react";
import { useWallets } from "@rangodev/wallets-core";
import { WalletType } from "@rangodev/wallets-shared";

function Wallets() {
  const { connect, providers, state, disconnect } = useWallets();
  // @ts-ignore
  const list = Object.keys(providers());
  return (
    <div>
      <h3>Available Wallets</h3>
      <div className="wallets">
        {list.map((type) => {
          const wallet_type = type as WalletType;
          const wallet_state = state(wallet_type);
          return (
            <div className="wallet">
              <h5>{wallet_type}</h5>
              <p>Address: {wallet_state.accounts?.join(",")}</p>
              <button
                onClick={() => {
                  if (wallet_state.connected) {
                    disconnect(wallet_type);
                  } else {
                    connect(wallet_type);
                  }
                }}
              >
                {wallet_state.connected ? "Disconnect" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Wallets };
