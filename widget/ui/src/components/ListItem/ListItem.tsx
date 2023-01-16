import React, { PropsWithChildren } from 'react';
import { styled } from '../../theme';

const Item = styled('li', {
  boxSizing: 'border-box',
  border: '1px solid $borderColor',
  borderRadius: '$s',
  height: '3rem',
  padding: '$0 $4',
  fontSize: '$l',
  color: '$text',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '$backgroundColor2',
  },
  variants: {
    isSelected: {
      true: {
        borderColor: '$primary-500',
      },
    },
    isDisabled: {
      true: {
        backgroundColor: '$backgroundColorDisabled',
        borderColor: 'transparent',
        cursor: 'not-allowed',
        filter: 'grayscale(100%)',
        '&:hover': {
          backgroundColor: '$backgroundColorDisabled',
        },
      },
    },
  },
});

export type PropTypes = (
  | {
      isSelected?: boolean;
      isDisabled?: never;
    }
  | { isSelected?: never; isDisabled?: boolean }
) & {
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
  style?: React.CSSProperties;
};

function ListItem(props: PropsWithChildren<PropTypes>) {
  const { isSelected, isDisabled, onClick, children, style } = props;
  return (
    <Item
      isSelected={isSelected}
      isDisabled={isDisabled}
      onClick={onClick}
      css={{ ...style }}
    >
      {children}
    </Item>
  );
}

export default ListItem;
