import type { CheckboxPropTypes } from './Checkbox.types.js';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { DoneIcon } from '../../icons/index.js';
import { Divider } from '../Divider/index.js';

import {
  CheckboxContainer,
  CheckboxIndicator,
  CheckboxRoot,
  Label,
} from './Checkbox.styles.js';

export function Checkbox(props: PropsWithChildren<CheckboxPropTypes>) {
  const { id, label, ...otherProps } = props;
  const hasLabel = id && label;
  return (
    <CheckboxContainer>
      <CheckboxRoot id={id} {...otherProps}>
        <CheckboxIndicator>
          <DoneIcon color="white" size={12} />
        </CheckboxIndicator>
      </CheckboxRoot>
      {hasLabel ? (
        <>
          <Divider direction="horizontal" size={8} />
          <Label className="_text" htmlFor={id}>
            {label}
          </Label>
        </>
      ) : null}
    </CheckboxContainer>
  );
}
