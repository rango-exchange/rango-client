import React, { PropsWithChildren, RefObject } from 'react';

import { styled } from '../../theme';

const InputContainer = styled('div', {
  backgroundColor: '$background',
  boxSizing: 'border-box',
  border: '1px solid $neutrals400',
  borderRadius: '$5',
  height: '$48',
  display: 'flex',
  flexGrow: 1,
  position: 'relative',
  alignItems: 'center',
  color: '$foreground',
  transition: 'border-color ease .3s',
  '&:focus-within': {
    borderColor: '$primary500',
  },
  variants: {
    size: {
      small: {
        height: '$32',
      },
      medium: {
        height: '$40',
      },
      large: {
        height: '$48',
      },
    },
    disabled: {
      true: {
        backgroundColor: '$neutrals300',
        cursor: 'not-allowed',
        filter: 'graydirection(100%)',
      },
    },
    prefix: {
      true: {
        paddingLeft: '$16',
      },
      false: {
        paddingLeft: '$0',
      },
    },
    suffix: {
      true: {
        paddingRight: '$16',
      },
      false: {
        paddingRight: '$0',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

const Input = styled('input', {
  color: '$text',
  paddingLeft: '$16',
  paddingRight: '$16',
  flexGrow: 1,
  width: '100%',
  border: 'none',
  borderRadius: '$5',
  outline: 'none',
  fontSize: '$l',
  backgroundColor: 'transparent',
  '-webkit-appearance': 'none',
  margin: 0,
  '&:disabled': {
    cursor: 'not-allowed',
  },
});
const Label = styled('label', {
  display: 'inline-block',
  fontSize: '$16',
  marginBottom: '$4',
});

export type PropTypes = {
  label?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> & {
    ref?:
      | ((instance: HTMLInputElement | null) => void)
      | React.RefObject<HTMLInputElement>
      | null
      | undefined;
  };

export const TextField = React.forwardRef(
  (
    props: PropsWithChildren<PropTypes>,
    ref:
      | RefObject<HTMLInputElement>
      | ((instance: HTMLInputElement | null) => void)
      | null
      | undefined
  ) => {
    const { label, prefix, suffix, children, size, style, ...inputAttributes } =
      props;
    return (
      <>
        {label && (
          <Label {...(inputAttributes.id && { htmlFor: inputAttributes.id })}>
            {label}
          </Label>
        )}
        <InputContainer
          disabled={inputAttributes.disabled}
          prefix={!!prefix}
          suffix={!!suffix}
          size={size}
          style={style}
        >
          {prefix || null}
          <Input {...inputAttributes} spellCheck={false} ref={ref} />
          {suffix || null}
        </InputContainer>
      </>
    );
  }
);
