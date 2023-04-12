import { CSSProperties } from '@stitches/react';
import React from 'react';
import { styled } from '../../theme';

const ChipCointainer = styled('div', {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$5',
  padding: '$4 $8',
  height: '32',
  fontSize: '$14',
  cursor: 'pointer',
  transition: 'all 0.35s',

  '&:hover': {
    backgroundColor: '$success700',
    color: '$background',
  },
  variants: {
    selected: {
      true: { backgroundColor: '$success', color: '$background' },
      false: { backgroundColor: '$background' },
    },
  },
});

export interface PropTypes {
  label: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Chip(props: PropTypes) {
  const { label, selected, prefix, suffix, onClick, style } = props;
  return (
    <ChipCointainer selected={selected} onClick={onClick} style={style}>
      {prefix || null}
      {label}
      {suffix || null}
    </ChipCointainer>
  );
}
