import React from 'react';

import { SelectablePropTypes } from './Wallet.types';
import { WalletButton } from './Wallet.styles';
import Content from './Content';

function SelectableWallet(props: SelectablePropTypes) {
  return (
    <WalletButton
      selected={props.selected}
      onClick={() => {
        props.onClick(props.type);
      }}>
      <Content
        image={props.image}
        title={props.title}
        description={props.description}
      />
    </WalletButton>
  );
}

export default SelectableWallet;
