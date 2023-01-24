import React, { useState } from 'react';
import { styled } from '../../theme';
import { BlockchainMeta } from '../../types/meta';
import { Button } from '../Button/Button';
import { FilledCircle } from '../common';
import { Typography } from '../Typography';

export interface PropTypes {
  list: BlockchainMeta[];
  selected: BlockchainMeta;
  onChange: (blockchain: BlockchainMeta) => void;
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

export function BlockchainsList(props: PropTypes) {
  const { list, onChange } = props;
  const [selected, setSelected] = useState(props.selected);

  const changeSelectedBlockchain = (blockchain: BlockchainMeta) => {
    setSelected(blockchain);
    onChange(blockchain);
  };

  return (
    <ListContainer>
      {list.map((blockchain, index) => {
        return (
          <Button
            type={blockchain.name === selected.name ? 'primary' : undefined}
            variant="outlined"
            size="large"
            prefix={<Image src={blockchain.logo} />}
            suffix={
              blockchain.name === selected.name ? <FilledCircle /> : undefined
            }
            align="start"
            onClick={changeSelectedBlockchain.bind(null, blockchain)}
            key={index}
          >
            <Typography variant="body2">{blockchain.displayName}</Typography>
          </Button>
        );
      })}
    </ListContainer>
  );
}
