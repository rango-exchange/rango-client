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

const Image = styled('img', {
  width: '1.5rem',
  maxHeight: '1.5rem',
  marginRight: '$4',
});

function BlockchainSelector(props: PropTypes) {
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
    <ul>
      {filteredBlockchains.map((blockchain) => {
        return (
          <ListItem
            isSelected={blockchain.name === selectedBlockchain}
            style={{ justifyContent: 'start', margin: '$2' }}
          >
            <Image src={blockchain.logo} />
            <Typography variant="body2">{blockchain.displayName}</Typography>
          </ListItem>
        );
      })}
    </ul>
  );
}

export default BlockchainSelector;
