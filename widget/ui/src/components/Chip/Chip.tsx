import React from 'react';
import { styled } from '../../theme';
import { Typography } from '../Typography';

const ChipCointainer = styled('div', {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$5',
  padding: '$4 $8',
  height: '32',
  fontSize: '$14',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$neutrals300',
  },
  variants: {
    selected: {
      true: { backgroundColor: '$neutrals400' },
      false: { backgroundColor: '$background' },
    },
  },
});

export interface PropTypes {
  label: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Chip(props: PropTypes) {
  const { label, selected, prefix, suffix, onClick, style } = props;
  return (
    <ChipCointainer selected={selected} onClick={onClick} style={style}>
      {prefix || null}
      <Typography variant="body2">{label}</Typography>
      {suffix || null}
    </ChipCointainer>
  );
}
