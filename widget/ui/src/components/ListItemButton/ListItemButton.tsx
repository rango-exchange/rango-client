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
      id={id}
      aria-label="button"
      selected={selected}
      onKeyUp={(e: { key: string }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        e.key === 'Enter' && onClickWithKey();
      }}
      tabIndex={0}
      {...restProps}
    />
  );
}

export { ListItemButton };
