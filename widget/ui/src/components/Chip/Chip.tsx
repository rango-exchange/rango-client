import React from 'react';
import { styled } from '../../theme';

const ChipCointainer = styled('div', {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$s',
  padding: '$0 $2',
  height: '2rem',
  fontSize: '$m',
  marginRight: '$2',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '$neutral-300',
  },
  variants: {
    selected: {
      true: { backgroundColor: '$neutral-400' },
      false: { backgroundColor: '$backgroundColor' },
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

function Chip(props: PropTypes) {
  const { label, selected, prefix, suffix, onClick, style } = props;
  return (
    <ChipCointainer selected={selected} onClick={onClick} style={style}>
      {prefix || null}
      {label}
      {suffix || null}
    </ChipCointainer>
  );
}

export default Chip;
