import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const Item = styled('li', {
  backgroundColor: '$background',
  boxSizing: 'border-box',
  border: '1px solid $neutrals400',
  borderRadius: '$5',
  height: '$48',
  paddingLeft: '$16',
  paddingRight: '$16',
  fontSize: '$16',
  color: '$foreground',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '$neutrals200',
  },
  variants: {
    selected: {
      true: {
        borderColor: '$primary500',
      },
    },
    disabled: {
      true: {
        backgroundColor: '$neutrals300 !important',
        borderColor: 'transparent',
        cursor: 'not-allowed',
        filter: 'grayscale(100%)',
      },
    },
  },
});

export type PropTypes = (
  | {
      selected?: boolean;
      disabled?: never;
    }
  | { selected?: never; disabled?: boolean }
) & {
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  style?: React.CSSProperties;
};

function ListItem(props: PropsWithChildren<PropTypes>) {
  const { selected, disabled, onClick, children, style } = props;
  return (
    <Item
      selected={selected}
      disabled={disabled}
      onClick={onClick}
      css={{ ...style }}
    >
      {children}
    </Item>
  );
}

export default ListItem;
