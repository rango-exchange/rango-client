import type { BlockchainMeta } from 'rango-sdk';

import React, { useState } from 'react';

import { styled } from '../../theme';
import { Button } from '../Button/Button';
import { FilledCircle, Image } from '../common';
import { Typography } from '../Typography';

export interface PropTypes {
  list: BlockchainMeta[];
  selected?: BlockchainMeta | null;
  onChange: (blockchain: BlockchainMeta) => void;
  multiSelect?: boolean;
  selectedList?: BlockchainMeta[] | 'all';
}

const ListContainer = styled('div', {
  display: 'grid',
  gap: '.5rem',
  gridTemplateColumns: ' repeat(2, minmax(0, 1fr))',
  alignContent: 'baseline',
  width: '100%',
  height: '100%',
});

const ImageContainer = styled('div', {
  paddingRight: '$4',
});
/**
 * @deprecated will be removed in v2
 */
export function BlockchainsList(props: PropTypes) {
  const { list, onChange, multiSelect, selectedList } = props;
  const [selected, setSelected] = useState(props.selected);

  const changeSelectedBlockchain = (blockchain: BlockchainMeta) => {
    setSelected(blockchain);
    onChange(blockchain);
  };

  const isSelect = (name: string) => {
    if (multiSelect && selectedList) {
      const NOT_FOUND_INDEX = -1;
      return (
        selectedList === 'all' ||
        selectedList.findIndex((item) => name === item.name) > NOT_FOUND_INDEX
      );
    }
    return name === selected?.name;
  };

  return (
    <ListContainer>
      {list.map((blockchain, index) => {
        const key = `item-${index}`;
        return (
          <Button
            type={isSelect(blockchain.name) ? 'primary' : undefined}
            variant="outlined"
            size="large"
            prefix={
              <ImageContainer>
                <Image size={24} src={blockchain.logo} />
              </ImageContainer>
            }
            suffix={isSelect(blockchain.name) ? <FilledCircle /> : undefined}
            onClick={changeSelectedBlockchain.bind(null, blockchain)}
            key={key}>
            <Typography variant="body" size="small">
              {blockchain.displayName}
            </Typography>
          </Button>
        );
      })}
    </ListContainer>
  );
}
