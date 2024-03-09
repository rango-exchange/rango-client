import type { ListItemButtonProps } from './ListItemButton.types';

import React from 'react';

import { BaseListItemButton } from './ListItemButton.styles';

function ListItemButton(props: ListItemButtonProps) {
  const { onClick, id, selected, ...restProps } = props;
  const onClickWithKey = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <BaseListItemButton
      onClick={onClickWithKey}
      aria-label="button"
      selected={selected}
      onKeyUp={(e: { key: string }) => {
        e.key === 'Enter' && onClickWithKey();
      }}
      tabIndex={0}
      {...restProps}
    />
  );
}

export { ListItemButton };
