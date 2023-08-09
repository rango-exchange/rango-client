import type { SelectablePropTypes } from './Wallet.types';

import React from 'react';

import Content from './Content';
import { WalletButton } from './Wallet.styles';

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
