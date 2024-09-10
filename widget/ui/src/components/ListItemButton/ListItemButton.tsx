import type { ListItemButtonProps } from './ListItemButton.types.js';

import React from 'react';

import { BaseListItemButton } from './ListItemButton.styles.js';

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
