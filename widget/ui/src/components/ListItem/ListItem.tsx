import type { ListItemPropTypes } from './ListItem.types.js';

import React from 'react';

import { Typography } from '../Typography/index.js';

import { BaseListItem } from './ListItem.styles.js';

function ListItem(props: ListItemPropTypes) {
  const { start, title, description, end, onClick, hasDivider, ...restProps } =
    props;

  return (
    <BaseListItem hasDivider={hasDivider} onClick={onClick} {...restProps}>
      {start && <div className="item-start-container">{start}</div>}
      <div className="item-text-container">
        {title && <div className="item-text-title">{title}</div>}
        {description && (
          <Typography variant="body" className="_description" size="small">
            {description}
          </Typography>
        )}
      </div>
      {end && <div className="item-end-container">{end}</div>}
    </BaseListItem>
  );
}

export { ListItem };
