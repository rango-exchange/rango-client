import React from 'react';
import { BlockchainMeta } from '../../types/meta';
import BlockchainsList from '../BlockchainsList';
import PageWithTextField from '../PageWithTextField';

export interface PropTypes {
  type: 'Source' | 'Destination';
  blockchains: Pick<BlockchainMeta, 'name' | 'displayName' | 'logo'>[];
}

function BlockchainSelector(props: PropTypes) {
  const { type, blockchains } = props;
  return (
    <PageWithTextField
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Network`}
      Content={({ searchedText }) => (
        <BlockchainsList
          searchedText={searchedText}
          blockchains={blockchains}
          selectedBlockchain="BTC"
        />
      )}
    />
  );
}

export default BlockchainSelector;
