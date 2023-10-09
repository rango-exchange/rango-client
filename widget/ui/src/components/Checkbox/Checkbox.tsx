import type { PropTypes } from './Checkbox.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { DoneIcon } from '../../icons';
import { Divider } from '../Divider';

import {
  CheckboxContainer,
  CheckboxIndicator,
  CheckboxRoot,
  Label,
} from './Checkbox.styles';

export function Checkbox(props: PropsWithChildren<PropTypes>) {
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
