import { CSSProperties } from '@stitches/react';
import React, { PropsWithChildren, HTMLAttributes } from 'react';
import { darkTheme, styled } from '../../theme';
import { Spinner } from '../Spinner';
import { Typography } from '../Typography';

const ButtonContainer = styled('button', {
  borderRadius: '$5',
  fontSize: '$16',
  fontWeight: '$400',
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
        backgroundColor: '$neutrals300',
        color: '$foreground',
        border: 0,
        '&:hover': {
          backgroundColor: '$neutrals200',
          color: '$foreground',
        },
        '&:disabled': {
          background: '$neutrals400',
          cursor: 'initial',
        },
        '&:disabled:hover': {
          background: '$neutrals400',
          transform: 'unset',
        },
      },
      outlined: {
        backgroundColor: '$background',
        border: 1,
        borderStyle: 'solid',
        borderColor: '$neutrals400',
        color: '$foreground',
        '&:hover': {
          borderColor: '$neutrals600',
        },
        '&:disabled': {
          borderColor: '$neutrals300',
          color: '$neutrals400',
        },
      },
      ghost: {
        color: '$foreground',
        '&:hover': {
          backgroundColor: '$neutrals200',
        },
        '&:disabled': {
          color: '$neutrals400 !important',
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
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color !important',
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
        color: '$primary !important',
        borderColor: '$primary',
        '&:hover': {
          color: '$primary700 !important',
          borderColor: '$primary700 !important',
        },
        '&:visited': {
          color: '$primary900 !important',
          borderColor: '$primary900 !important',
        },
        '&:focus': {
          color: '$primary600 !important',
          borderColor: '$primary600 !important',
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
        color: '$$color !important',
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
        color: '$error !important',
        borderColor: '$error',
        '&:hover': {
          color: '$error300 !important',
          borderColor: '$error300 !important',
        },
        '&:visited': {
          color: '$error700 !important',
          borderColor: '$error700 !important',
        },
        '&:focus': {
          color: '$error700 !important',
          borderColor: '$error700 !important',
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
        color: '$$color !important',
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
        color: '$warning !important',
        borderColor: '$warning',
        '&:hover': {
          color: '$warning300 !important',
          borderColor: '$warning300 !important',
        },
        '&:visited': {
          color: '$warning700 !important',
          borderColor: '$warning700 !important',
        },
        '&:focus': {
          color: '$warning700 !important',
          borderColor: '$warning700 !important',
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
        color: '$$color !important',
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
        color: '$success !important',
        borderColor: '$success',
        '&:hover': {
          color: '$success300 !important',
          borderColor: '$success300 !important',
        },
        '&:visited': {
          color: '$success700 !important',
          borderColor: '$success700 !important',
        },
        '&:focus': {
          color: '$success700 !important',
          borderColor: '$success700 !important',
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
  size?: 'small' | 'medium' | 'large';
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
          className="_text"
        >
          {children}
        </Content>
      )}
      {loading && <Spinner size={16} color={props.type} />}
      {suffix}
    </ButtonContainer>
  );
}
