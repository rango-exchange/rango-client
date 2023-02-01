import React from 'react';
import { containsText } from '../../helpers';
import { BlockchainMeta } from 'rango-sdk';
import { BlockchainsList } from '../BlockchainsList';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';

const filterBlockchains = (list: BlockchainMeta[], searchedFor: string) =>
  list.filter(
    (blockchain) =>
      containsText(blockchain.name, searchedFor) ||
      containsText(blockchain.displayName, searchedFor)
  );

export interface PropTypes {
  type: 'Source' | 'Destination';
  list: BlockchainMeta[];
  selected: BlockchainMeta | null;
  onChange: (blockchain: BlockchainMeta) => void;
  onBack: () => void;
}

export function BlockchainSelector(props: PropTypes) {
  const { type, list, onChange, selected, onBack } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Network`}
      onBack={onBack}
      Content={({ searchedFor }) => (
        <BlockchainsList
          list={filterBlockchains(list, searchedFor)}
          selected={selected}
          onChange={onChange}
        />
      )}
    />
  );
}
