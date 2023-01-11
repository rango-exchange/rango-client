import React, { PropsWithChildren } from 'react';

import { styled } from '../../theme';

const InputContainer = styled('div', {
  border: '1px solid $borderColor',
  borderRadius: '$s',
  height: '3rem',
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  transition: 'border-color ease .3s',
  '&:focus-within': {
    borderColor: '$info',
  },
  variants: {
    disabled: {
      true: {
        backgroundColor: '$backgroundColorDisabled',
        cursor: 'not-allowed',
        filter: 'grayscale(100%)',
      },
    },
    prefix: {
      true: {
        paddingLeft: '$4',
      },
      false: {
        paddingLeft: '$0',
      },
    },
    suffix: {
      true: {
        paddingRight: '$4',
      },
      false: {
        paddingRight: '$0',
      },
    },
  },
});

const Input = styled('input', {
  color: '$text',
  padding: '$0 $4',
  flexGrow: 1,
  widows: '100%',
  border: 'none',
  borderRadius: '$m',
  outline: 'none',
  fontSize: '$l',
  backgroundColor: 'transparent',
  '&:disabled': {
    cursor: 'not-allowed',
  },
});
const Label = styled('label', {
  display: 'inline-block',
  fontSize: '$l',
  marginBottom: '$1',
});

export type PropTypes = {
  label?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'sp'>;

function TextField(props: PropsWithChildren<PropTypes>) {
  const {
    // size = 'medium',
    label,
    prefix,
    suffix,
    children,
    ...inputAttributes
  } = props;
  return (
    <div>
      {label && (
        <Label {...(inputAttributes.id && { htmlFor: inputAttributes.id })}>
          {label}
        </Label>
      )}
      <InputContainer
        disabled={inputAttributes.disabled}
        prefix={!!prefix}
        suffix={!!suffix}
      >
        {prefix || null}
        <Input {...inputAttributes} spellCheck={false} />
        {suffix || null}
      </InputContainer>
    </div>
  );
}

export default TextField;
