import React from 'react';
import { BlockchainMeta } from '../../types/meta';
import BlockchainsList from '../BlockchainsList';
import SecondaryPage from '../PageWithTextField/SecondaryPage';

export interface PropTypes {
  type: 'Source' | 'Destination';
  blockchains: BlockchainMeta[];
  selectedBlockchain: BlockchainMeta;
  onSelectedBlockchainChanged: (blockchain: BlockchainMeta) => void;
}

function BlockchainSelector(props: PropTypes) {
  const { type, blockchains, onSelectedBlockchainChanged, selectedBlockchain } =
    props;
  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Network`}
      Content={({ searchedText }) => (
        <BlockchainsList
          searchedText={searchedText}
          blockchains={blockchains}
          selectedBlockchain={selectedBlockchain}
          onSelectedBlockchainChanged={onSelectedBlockchainChanged}
        />
      )}
    />
  );
}

export default BlockchainSelector;
