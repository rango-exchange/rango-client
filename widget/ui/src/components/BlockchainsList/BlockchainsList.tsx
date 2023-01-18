import React, { useEffect, useState } from 'react';
import { containsText } from '../../helpers';
import { styled } from '../../theme';
import { BlockchainMeta } from '../../types/meta';
import Button from '../Button/Button';
import Typography from '../Typography';

export interface PropTypes {
  blockchains: BlockchainMeta[];
  selectedBlockchain: BlockchainMeta;
  searchedText: string;
  onSelectedBlockchainChanged: (blockchain: BlockchainMeta) => void;
}

const ListContainer = styled('div', {
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
  const { blockchains, searchedText, onSelectedBlockchainChanged } = props;
  const [selectedBlockchain, setSelectedBlockchain] = useState(
    props.selectedBlockchain
  );
  const [filteredBlockchains, setFilteredBlockchains] =
    useState<Pick<BlockchainMeta, 'name' | 'displayName' | 'logo'>[]>(
      blockchains
    );

  const changeSelectedBlockchain = (blockchain: BlockchainMeta) => {
    setSelectedBlockchain(blockchain);
    onSelectedBlockchainChanged(blockchain);
  };

  useEffect(() => {
    setFilteredBlockchains(
      blockchains.filter(
        (blockchain) =>
          containsText(blockchain.name, searchedText) ||
          containsText(blockchain.displayName, searchedText)
      )
    );
  }, [searchedText]);

  return (
    <ListContainer>
      {filteredBlockchains.map((blockchain) => {
        return (
          <Button
            type={
              blockchain.name === selectedBlockchain.name
                ? 'primary'
                : undefined
            }
            variant="outlined"
            size="large"
            prefix={<Image src={blockchain.logo} />}
            align="start"
            onClick={changeSelectedBlockchain.bind(null, blockchain)}
          >
            <Typography variant="body2">{blockchain.displayName}</Typography>
          </Button>
        );
      })}
    </ListContainer>
  );
}

export default BlockchainsList;
