import { useWallets } from '@rangodev/wallets-core';
import React from 'react';

function Adapter() {
  const { getWalletInfo } = useWallets();
  return <div className="row">modal</div>;
}

export default Adapter;
