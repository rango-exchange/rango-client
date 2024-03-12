import type { ListPropTypes } from './List.types';

import React from 'react';

import { ListItem } from '../ListItem';

import { BaseList } from './List.styles';

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
