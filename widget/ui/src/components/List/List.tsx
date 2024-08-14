import type { ListPropTypes } from './List.types.js';

import React from 'react';

import { ListItem } from '../ListItem/index.js';

import { BaseList } from './List.styles.js';

function List(props: ListPropTypes) {
  return (
    <BaseList as={props.as}>
      {props.items.map((item) => {
        const { id, type, ...itemProps } = item;
        const container = type || props.type;

        if (!!container) {
          return React.cloneElement(container, {
            ...itemProps,
            key: id,
            id,
          });
        }
        return <ListItem key={id} {...itemProps} />;
      })}
    </BaseList>
  );
}

export { List };
