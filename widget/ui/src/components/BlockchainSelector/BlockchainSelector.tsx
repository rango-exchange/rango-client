import React from 'react';
import { containsText } from '../../helpers';
import { BlockchainMeta } from '../../types/meta';
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
  selected: BlockchainMeta;
  onChange: (blockchain: BlockchainMeta) => void;
}

export function BlockchainSelector(props: PropTypes) {
  const { type, list, onChange, selected } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Network`}
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
