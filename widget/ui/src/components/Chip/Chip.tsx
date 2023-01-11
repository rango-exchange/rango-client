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
  variants: {
    variant: {
      outlined: {
        backgroundColor: 'none',
        border: '1px solid $neutral-700',
      },
      contained: {
        backgroundColor: '$neutral-300',
      },
    },
  },
});

export interface PropTypes {
  label: string;
  variant: 'outlined' | 'contained';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

function Chip(props: PropTypes) {
  const { label, variant, prefix, suffix, onClick, style } = props;
  return (
    <ChipCointainer variant={variant} onClick={onClick} style={style}>
      {prefix || null}
      {label}
      {suffix || null}
    </ChipCointainer>
  );
}

export default Chip;
