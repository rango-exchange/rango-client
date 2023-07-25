import { CSSProperties } from '@stitches/react';
import React, { PropsWithChildren, HTMLAttributes } from 'react';
import { darkTheme, styled } from '../../theme';
import { Spinner } from '../Spinner';
import { Typography } from '../Typography';

const ButtonContainer = styled('button', {
  borderRadius: '$xs',
  fontSize: '$16',
  fontWeight: '$regular',
  cursor: 'pointer',
  padding: '0 $12',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.35s',
  border: '0',

  '&:active': {
    transform: 'scale(0.95)',
  },

  variants: {
    align: {
      start: {
        display: 'flex',
        width: '100%',
      },
      grow: {
        display: 'flex',
        width: '100%',
      },
    },
    size: {
      compact: {},
      free: {},
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
    variant: {
      contained: {
        backgroundColor: '$neutral100',
        color: '$foreground',
        border: 0,
        '&:hover': {
          backgroundColor: '$neutral200',
        },
        '&:disabled': {
          background: '$neutral400',
        },
        '&:disabled:hover': {
          background: '$neutral400',
          transform: 'unset',
        },
      },
      outlined: {
        backgroundColor: '$surface',
        border: 1,
        borderStyle: 'solid',
        borderColor: '$neutral400',
        color: '$foreground',
        '&:hover': {
          borderColor: '$neutral600',
        },
        '&:disabled': {
          borderColor: '$neutral400',
          color: '$neutral400',
        },
      },
      ghost: {
        color: '$foreground',
        '&:hover': {
          backgroundColor: '$neutral200',
        },
        '&:disabled': {
          color: '$neutral400',
        },
        background: 'transparent',
        border: 0,

        [`& ${Typography}`]: {
          color: 'inherit',
        },
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    loading: {
      true: {},
    },
    type: {
      primary: {},
      error: {},
      warning: {},
      success: {},
    },
  },

  compoundVariants: [
    {
      type: 'primary',
      variant: 'contained',
      css: {
        background: '$primary',
        color: '$white',
        '&:hover': {
          background: '$primary700',
        },
        '&:visited': {
          background: '$primary900',
        },
        '&:focus': {
          background: '$primary600',
        },
      },
    },
    {
      type: 'primary',
      variant: 'outlined',
      css: {
        color: '$primary',
        borderColor: '$primary',
        '&:hover': {
          color: '$primary700',
          borderColor: '$primary700',
        },
        '&:visited': {
          color: '$primary900',
          borderColor: '$primary900',
        },
        '&:focus': {
          color: '$primary600',
          borderColor: '$primary600',
        },
      },
    },
    {
      type: 'primary',
      variant: 'ghost',
      css: {
        color: '$primary',
        '&:hover': {
          color: '$primary700',
        },
        '&:visited': { color: '$primary900' },
        '&:focus': {
          color: '$primary600',
        },
      },
    },
    {
      type: 'error',
      variant: 'contained',
      css: {
        background: '$error',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        '&:hover': {
          background: '$error300',
        },
        '&:visited': {
          background: '$error700',
        },
        '&:focus': {
          background: '$error700',
        },
      },
    },
    {
      type: 'error',
      variant: 'outlined',
      css: {
        color: '$error',
        borderColor: '$error',
        '&:hover': {
          color: '$error300',
          borderColor: '$error300',
        },
        '&:visited': {
          color: '$error700',
          borderColor: '$error700',
        },
        '&:focus': {
          color: '$error700',
          borderColor: '$error700',
        },
      },
    },
    {
      type: 'error',
      variant: 'ghost',
      css: {
        color: '$error',
        '&:hover': {
          color: '$error300',
        },
        '&:visited': {
          color: '$error700',
        },
        '&:focus': {
          color: '$error700',
        },
      },
    },
    {
      type: 'warning',
      variant: 'contained',
      css: {
        background: '$warning',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        '&:hover': {
          background: '$warning300',
        },
        '&:visited': {
          background: '$warning700',
        },
        '&:focus': {
          background: '$warning700',
        },
      },
    },
    {
      type: 'warning',
      variant: 'outlined',
      css: {
        color: '$warning',
        borderColor: '$warning',
        '&:hover': {
          color: '$warning300',
          borderColor: '$warning300',
        },
        '&:visited': {
          color: '$warning700',
          borderColor: '$warning700',
        },
        '&:focus': {
          color: '$warning700',
          borderColor: '$warning700',
        },
      },
    },
    {
      type: 'warning',
      variant: 'ghost',
      css: {
        color: '$warning',
        '&:hover': {
          color: '$warning300',
        },
        '&:visited': {
          color: '$warning700',
        },
        '&:focus': {
          color: '$warning700',
        },
      },
    },
    {
      type: 'success',
      variant: 'contained',
      css: {
        background: '$success',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        '&:hover': {
          background: '$success300',
        },
        '&:visited': {
          background: '$success700',
        },
        '&:focus': {
          background: '$success700',
        },
      },
    },
    {
      type: 'success',
      variant: 'outlined',
      css: {
        color: '$success',
        borderColor: '$success',
        '&:hover': {
          color: '$success300',
          borderColor: '$success300',
        },
        '&:visited': {
          color: '$success700',
          borderColor: '$success700',
        },
        '&:focus': {
          color: '$success700',
          borderColor: '$success700',
        },
      },
    },
    {
      type: 'success',
      variant: 'ghost',
      css: {
        color: '$success',
        '&:hover': {
          color: '$success300',
        },
        '&:visited': {
          color: '$success700',
        },
        '&:focus': {
          color: '$success700',
        },
      },
    },
    {
      size: 'compact',
      css: {
        padding: '$2 $4',
        fontSize: '$12',
      },
    },
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'contained',
  },
});

const Content = styled('div', {
  flex: 1,
  variants: {
    align: {
      start: {
        textAlign: 'left',
      },
      grow: {
        textAlign: 'center',
      },
    },
    ml: {
      true: {
        marginLeft: '$8',
      },
    },
    mr: {
      true: {
        marginRight: '$8',
      },
    },
    flexContent: {
      true: {
        display: 'flex',
        alignItems: 'center',
      },
    },
  },
});

export interface PropTypes
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'prefix'> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'medium' | 'large' | 'compact' | 'free';
  variant?: 'contained' | 'outlined' | 'ghost';
  type?: 'primary' | 'error' | 'warning' | 'success';
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  align?: 'start' | 'grow';
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  flexContent?: boolean;
}

export function Button({
  children,
  loading,
  disabled,
  prefix,
  suffix,
  align,
  flexContent,
  ...props
}: PropsWithChildren<PropTypes>) {
  const isDisabled = loading || disabled;
  return (
    <ButtonContainer disabled={isDisabled} {...props} align={align}>
      {prefix}
      {children && (
        <Content
          align={align}
          ml={!!prefix}
          mr={!!suffix && !loading}
          flexContent={flexContent}
          className="_text">
          {children}
        </Content>
      )}
      {loading && <Spinner size={16} color={props.type} />}
      {suffix}
    </ButtonContainer>
  );
}
