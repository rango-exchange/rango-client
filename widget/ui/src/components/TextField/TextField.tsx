import type { Ref, TextFieldPropTypes } from './TextField.types.js';
import type { PropsWithChildren } from 'react';

import React from 'react';

import { Divider } from '../Divider/index.js';
import { Typography } from '../Typography/index.js';

import { Input, InputContainer, Label } from './TextField.styles.js';

function TextFieldComponent(
  props: PropsWithChildren<TextFieldPropTypes>,
  ref?: Ref
) {
  const {
    label,
    prefix,
    suffix,
    size = 'small',
    style,
    variant,
    fullWidth,
    labelProps,
    status = 'default',
    ...inputAttributes
  } = props;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputAttributes?.type === 'number') {
      const disallowedKeys = ['-', '+'];
      if (disallowedKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (inputAttributes?.type === 'number') {
      const data = event.clipboardData.getData('text');
      const numericPattern = /^\d+(\.\d+)?$/;
      if (!numericPattern.test(data)) {
        event.preventDefault();
      }
    }
  };

  return (
    <>
      {label && (
        <>
          <Label
            className="_text"
            {...(inputAttributes.id && { htmlFor: inputAttributes.id })}>
            <Typography variant="label" size="large" {...labelProps}>
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
        css={style}
        status={status}
        className="_text-field">
        {prefix || null}
        <Input
          autoComplete="off"
          {...inputAttributes}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          spellCheck={false}
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
TextField.toString = () => '._text-field';

export { TextField };
