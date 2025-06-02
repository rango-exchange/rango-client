import type { NamespaceItemPropTypes } from './Namespaces.types';

import { Checkbox, Radio } from '@rango-dev/ui';
import React from 'react';

import { NamespaceItem } from '../NamespaceItem';

export function NamespaceListItem(props: NamespaceItemPropTypes) {
  const { onClick, type, namespace } = props;

  return (
    <NamespaceItem
      namespace={namespace}
      onClick={onClick}
      suffix={
        type === 'radio' ? (
          <Radio value={namespace.value} />
        ) : (
          <Checkbox checked={props.value} />
        )
      }
    />
  );
}
