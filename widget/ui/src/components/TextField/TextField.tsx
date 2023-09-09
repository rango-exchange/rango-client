import type { PropTypes, Ref } from './TextField.types';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Divider } from '../Divider';
import { Typography } from '../Typography';

import { Input, InputContainer, Label } from './TextField.styles';

function TextFieldComponent(props: PropsWithChildren<PropTypes>, ref?: Ref) {
  const {
    label,
    prefix,
    suffix,
    size = 'small',
    style,
    variant,
    fullWidth,
    ...inputAttributes
  } = props;
  return (
    <>
      {label && (
        <>
          <Label
            className="_text"
            {...(inputAttributes.id && { htmlFor: inputAttributes.id })}>
            <Typography variant="label" size="large">
              {label}
            </Typography>
          </Label>
          <Divider direction="vertical" size={4} />
        </>
      )}
      <InputContainer
        disabled={inputAttributes.disabled}
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        style={style}
        className="_text">
        {prefix || null}
        <Input
          className="_text"
          {...inputAttributes}
          spellCheck={false}
          prefix={!!prefix}
          suffix={!!suffix}
          ref={ref}
        />
        {suffix || null}
      </InputContainer>
    </>
  );
}

const TextField = React.forwardRef(TextFieldComponent);
TextField.displayName = 'TextField';

export { TextField };
