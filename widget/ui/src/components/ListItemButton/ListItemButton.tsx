import type { ListItemButtonProps } from './ListItemButton.types';

import React from 'react';

import { BaseListItemButton } from './ListItemButton.styles';

function ListItemButton(props: ListItemButtonProps) {
  const { onClick, id, ...restProps } = props;
  const onClickWithKey = () => {
    if (onClick) {
      onClick(id);
    }
  };
  return (
    <BaseListItemButton
      onClick={onClickWithKey}
      aria-label="button"
      {...restProps}
    />
  );
}

export { ListItemButton };
