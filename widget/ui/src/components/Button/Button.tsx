import React, { PropsWithChildren } from 'react';
import { darkTheme, lightTheme, styled } from '../../theme';
import Spinner from '../Spinner';

const ButtonContainer = styled('button', {
  borderRadius: '$5',
  fontSize: '$16',
  fontWeight: '$400',
  cursor: 'pointer',
  padding: '0 $12',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
        '&:disabled': {
          background: '$neutrals400 !important',
          border: 0,
        },
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        border: 0,
      },
      outlined: {
        '&:disabled': {
          borderColor: '$neutrals400 !important',
          color: '$neutrals400 !important',
        },
        background: 'transparent',
        border: 1,
        borderStyle: 'solid',
      },
      ghost: {
        '&:disabled': {
          color: '$neutrals400 !important',
        },
        background: 'transparent',
        border: 0,
      },
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
        '&:visited': { color: '$primary900', borderColor: '$primary900' },
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
  ],
  defaultVariants: {
    size: 'medium',
    type: 'primary',
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
  },
});

export interface PropTypes {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined' | 'ghost';
  type?: 'primary' | 'error' | 'warning' | 'success';
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  align?: 'start' | 'grow';
  loading?: boolean;
  disabled?: boolean;
}

function Button({
  children,
  loading,
  disabled,
  prefix,
  suffix,
  align,
  ...props
}: PropsWithChildren<PropTypes>) {
  return (
    <ButtonContainer disabled={disabled} {...props} align={align}>
      {prefix}
      {children && (
        <Content align={align} ml={!!prefix} mr={!!suffix && !loading}>
          {children}
        </Content>
      )}
      {loading && <Spinner size={16} color={props.type} />}
      {suffix}
    </ButtonContainer>
  );
}

export default Button;
