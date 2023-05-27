import React, { useState } from 'react';
import { styled } from '../../theme';
import { ProviderMeta } from 'rango-types';
import { Button } from '../Button/Button';
import { FilledCircle, Image } from '../common';
import { Typography } from '../Typography';

export interface PropTypes {
  list: ProviderMeta[];
  selected?: ProviderMeta | null;
  onChange: (blockchain: ProviderMeta) => void;
  multiSelect?: boolean;
  selectedList?: ProviderMeta[] | 'all';
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

export function BlockchainsList(props: PropTypes) {
  const { list, onChange, multiSelect, selectedList } = props;
  const [selected, setSelected] = useState(props.selected);

  const changeSelectedBlockchain = (blockchain: ProviderMeta) => {
    setSelected(blockchain);
    onChange(blockchain);
  };

  const isSelect = (name: string) => {
    if (multiSelect && selectedList) {
      return selectedList === 'all' || selectedList.findIndex((item) => name === item.name) > -1;
    }
    return name === selected?.name;
  };

  return (
    <ListContainer>
      {list.map((blockchain, index) => {
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
            align="start"
            onClick={changeSelectedBlockchain.bind(null, blockchain)}
            key={index}>
            <Typography variant="body2">{blockchain.displayName}</Typography>
          </Button>
        );
      })}
    </ListContainer>
  );
}
