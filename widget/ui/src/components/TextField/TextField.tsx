import type { PropsWithChildren, RefObject } from 'react';

import React from 'react';

import { styled } from '../../theme';

const InputContainer = styled('div', {
  padding: '1px',
  boxSizing: 'border-box',
  borderRadius: '$xs',
  height: '$48',
  display: 'flex',
  flexGrow: 1,
  position: 'relative',
  alignItems: 'center',
  color: '$foreground',
  overflowX: 'hidden',
  transition: 'border-color ease .3s',
  variants: {
    size: {
      small: {
        '& input': {
          fontSize: '$14',
        },
        height: '$32',
      },
      medium: {
        '& input': {
          fontSize: '$15',
        },
        height: '$40',
      },
      large: {
        '& input': {
          fontSize: '$16',
        },
        height: '$48',
      },
    },
    disabled: {
      true: {
        backgroundColor: '$neutral100',
        cursor: 'not-allowed',
        filter: 'grayscale(100%)',
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
  color: '$foreground',
  paddingLeft: '$16',
  paddingRight: '$16',
  flexGrow: 1,
  width: '100%',
  border: 'none',
  borderRadius: '$xs',
  outline: 'none',
  backgroundColor: 'transparent',
  '-webkit-appearance': 'none',
  margin: 0,
  '&:disabled': {
    cursor: 'not-allowed',
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  '&[type="number"]': {
    '-moz-appearance': 'textfield',
  },
});
const Label = styled('label', {
  display: 'inline-block',
  fontSize: '$14',
  color: '$foreground',
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

export const TextField = React.forwardRef(function TextFieldComponent(
  props: PropsWithChildren<PropTypes>,
  ref:
    | RefObject<HTMLInputElement>
    | ((instance: HTMLInputElement | null) => void)
    | null
    | undefined
) {
  const { label, prefix, suffix, size, style, ...inputAttributes } = props;
  return (
    <>
      {label && (
        <Label
          className="_text"
          {...(inputAttributes.id && { htmlFor: inputAttributes.id })}>
          {label}
        </Label>
      )}
      <InputContainer
        disabled={inputAttributes.disabled}
        prefix={!!prefix}
        suffix={!!suffix}
        size={size}
        style={style}
        className="_text">
        {prefix || null}
        <Input
          className="_text"
          {...inputAttributes}
          spellCheck={false}
          ref={ref}
        />
        {suffix || null}
      </InputContainer>
    </>
  );
});
