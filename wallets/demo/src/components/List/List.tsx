import { WalletType } from '@rangodev/wallets-shared';
import React from 'react';
import Item from './Item';
import './styles.css';
const excludedWallets = [WalletType.UNKNOWN, WalletType.TERRA_STATION, WalletType.LEAP];

function List() {
  return (
    <div className="row">
      
      {Object.keys(WalletType).map(
        (type) =>
          !excludedWallets.includes(WalletType[type]) && (
            <Item key={type} type={WalletType[type]} />
          ),
      )}
    </div>
  );
}

export default List;
