import type { ListItemButtonProps } from './ListItemButton.types';

import React from 'react';

import { ListItem } from '../ListItem/ListItem';

import { BaseListItemButton } from './ListItemButton.styles';

function ListItemButton(props: ListItemButtonProps) {
  const { onClick, id, style, hasDivider, selected, ...restProps } = props;
  const onClickWithKey = () => {
    if (onClick) {
      onClick(id);
    }
  };
  return (
    <BaseListItemButton
      hasDivider={hasDivider}
      selected={selected}
      onClick={onClickWithKey}
      style={style}>
      <ListItem {...restProps} />
    </BaseListItemButton>
  );
}

export { ListItemButton };
