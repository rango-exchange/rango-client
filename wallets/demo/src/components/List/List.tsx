import { useWallets } from "@rangodev/wallets-core";
import { WalletType } from "@rangodev/wallets-shared";
import React from "react";

function List() {
  const { connect, state } = useWallets();
  const phantomState = state(WalletType.PHANTOM);

  return (
    <div>
      <div>
        accounts:
        {phantomState.accounts?.map((account) => (
          <div>{account}</div>
        ))}
      </div>
      <div>connected: {phantomState.connected ? "yes" : "no"}</div>
      <button
        onClick={() => {
          connect(WalletType.PHANTOM);
        }}
      >
        Connect (Phantom)
      </button>
    </div>
  );
}

export default List;
