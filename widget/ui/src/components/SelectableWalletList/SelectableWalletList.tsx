import type { PropsWithChildren } from 'react';

import React, { useEffect, useState } from 'react';

import { styled } from '../../theme';
import { getConciseAddress } from '../../utils';
import { Image } from '../common';
import { Typography } from '../Typography';

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
  borderRadius: '$xs',
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
  list: any[];
  onChange: (w: any) => void;
}

export function SelectableWalletList({
  list,
  onChange,
}: PropsWithChildren<PropTypes>) {
  const [active, setActive] = useState<string>(
    list.find((item) => item.selected)?.walletType || ''
  );
  const onClick = (w: any) => {
    setActive(w.walletType);
    onChange(w);
  };

  useEffect(() => {
    setActive(list.find((item) => item.selected)?.walletType || '');
  }, [list]);

  return (
    <Row>
      {list.map((w, index) => {
        const checked = active === w.walletType;
        return (
          <Container
            checked={checked}
            onClick={onClick.bind(null, w)}
            // eslint-disable-next-line react/no-array-index-key
            key={index}>
            <Image src={w.image} alt={w.walletType} size={24} />
            <Typography variant="body" size="small">
              {w.name}
            </Typography>
            <Typography variant="body" size="xsmall">
              {getConciseAddress(w.address)}
            </Typography>
            <Circle checked={checked}>
              {checked && <SolidCircle checked={checked} />}
            </Circle>
          </Container>
        );
      })}
    </Row>
  );
}
