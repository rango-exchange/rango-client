import type { ListItemButtonProps } from './ListItemButton.types';

import React from 'react';

import { ListItem } from '../ListItem';

import { BaseListItemButton } from './ListItemButton.styles';

function ListItemButton(props: ListItemButtonProps) {
  const { onClick, id, ...restProps } = props;

  return (
    <BaseListItemButton>
      <ListItem onClick={() => onClick(id)} as="button" {...restProps} />
    </BaseListItemButton>
  );
}

export { ListItemButton };
