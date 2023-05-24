import React, { PropsWithChildren, useEffect, useState } from 'react';
import { styled } from '../../theme';
import { SelectableWallet } from '../../types';
import { Typography } from '../Typography';
import { getConciseAddress } from '../../helper';
import { Image } from '../common';

const Row = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
});

const Circle = styled('div', {
  width: 12,
  height: 12,
  borderRadius: 6,
  border: '1px solid $neutral400',
  position: 'absolute',
  top: 12,
  right: 12,
  variants: {
    checked: {
      true: {
        borderColor: '$success',
      },
      false: {
        borderColor: '$neutral400',
      },
    },
  },
});
const SolidCircle = styled('div', {
  width: 6,
  margin: '20% auto',
  height: 6,
  borderRadius: 3,
  variants: {
    checked: {
      true: {
        backgroundColor: '$success',
      },
      false: {
        backgroundColor: '$neutral400',
      },
    },
  },
});
const Container = styled('div', {
  border: '1.5px solid',
  borderRadius: '$5',
  padding: '$12',
  flexBasis: 'calc(33.33% - 10px)',
  margin: 5,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: 124,
  height: 92,
  cursor: 'pointer',
  position: 'relative',
  variants: {
    checked: {
      true: {
        borderColor: '$success',
        color: '$success',
      },
      false: {
        borderColor: '$neutral400',
        color: '$neutral400',
      },
    },
  },
});

export interface PropTypes {
  list: SelectableWallet[];
  onChange: (w: SelectableWallet) => void;
}

export function SelectableWalletList({ list, onChange}: PropsWithChildren<PropTypes>) {
  const [active, setActive] = useState<string>(list.find(item => item.selected)?.walletType || '');
  console.log({active}, {list});
  
  const onClick = (w: SelectableWallet) => {
    setActive(w.walletType);
    onChange(w);
  };

  useEffect(() => {
    setActive(list.find(item => item.selected)?.walletType || '');
  }, [list]);

  return (
    <Row>
      {list.map((w, index) => {
        const checked = active === w.walletType;
        return (
          <Container checked={checked} onClick={onClick.bind(null, w)} key={index}>
            <Image src={w.image} alt={w.walletType} size={24} />
            <Typography variant="body2">{w.name}</Typography>
            <Typography variant="caption">{getConciseAddress(w.address)}</Typography>
            <Circle checked={checked}>
              <SolidCircle checked={checked} />
            </Circle>
          </Container>
        );
      })}
    </Row>
  );
}
