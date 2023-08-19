import type { ListItemProps } from './ListItem.types';

import React from 'react';

import { BaseListItem } from './ListItem.styles';

function ListItem(props: ListItemProps) {
  const { start, title, description, end, ...restProps } = props;
  return (
    <BaseListItem {...restProps}>
      {start && <div className="item-start-container">{start}</div>}
      <div className="item-text-container">
        {title && <div className="item-text-title">{title}</div>}
        {description && (
          <div className="item-text-description">{description}</div>
        )}
      </div>
      {end && <div className="item-end-container">{end}</div>}
    </BaseListItem>
  );
}

export { ListItem };
