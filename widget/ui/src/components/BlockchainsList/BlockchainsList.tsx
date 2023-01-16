import React, { useEffect, useState } from 'react';
import { styled } from '../../theme';
import { BlockchainMeta } from '../../types/meta';
import ListItem from '../ListItem';
import Typography from '../Typography';

export interface PropTypes {
  blockchains: Pick<BlockchainMeta, 'name' | 'displayName' | 'logo'>[];
  selectedBlockchain: string;
  searchedText: string;
}

const ListContainer = styled('ul', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
});

const Image = styled('img', {
  width: '1.5rem',
  maxHeight: '1.5rem',
  marginRight: '$4',
});

function BlockchainsList(props: PropTypes) {
  const { blockchains, searchedText, selectedBlockchain } = props;
  const [filteredBlockchains, setFilteredBlockchains] =
    useState<Pick<BlockchainMeta, 'name' | 'displayName' | 'logo'>[]>(
      blockchains
    );

  useEffect(() => {
    setFilteredBlockchains(
      blockchains.filter(
        (blockchain) =>
          blockchain.name.includes(searchedText) ||
          blockchain.displayName.includes(searchedText)
      )
    );
  }, [searchedText]);

  return (
    <ListContainer>
      {filteredBlockchains.map((blockchain) => {
        return (
          <ListItem
            isSelected={blockchain.name === selectedBlockchain}
            style={{ justifyContent: 'start' }}
          >
            <Image src={blockchain.logo} />
            <Typography variant="body2">{blockchain.displayName}</Typography>
          </ListItem>
        );
      })}
    </ListContainer>
  );
}

export default BlockchainsList;
