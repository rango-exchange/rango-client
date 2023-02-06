import React from 'react';
import { containsText } from '../../helpers';
import { BlockchainMeta } from 'rango-sdk';
import { BlockchainsList } from '../BlockchainsList';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { styled } from '../../theme';
import { Typography } from '../Typography';

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

const MessageContainer = styled('div', {
  width: '100%',
  height: '450px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export function BlockchainSelector(props: PropTypes) {
  const { type, list, onChange, selected, onBack } = props;

  return (
    <SecondaryPage
      textField={true}
      textFieldPlaceholder="Search Blockchain By Name"
      title={`Select ${type} Network`}
      onBack={onBack}
      Content={({ searchedFor }) => {
        const filteredBlockchains = filterBlockchains(list, searchedFor);
        return (
          <>
            {filteredBlockchains.length > 0 ? (
              <BlockchainsList
                list={filteredBlockchains}
                selected={selected}
                onChange={onChange}
              />
            ) : (
              <MessageContainer>
                {<Typography variant="body1">Blockchain not found</Typography>}
              </MessageContainer>
            )}
          </>
        );
      }}
    />
  );
}
