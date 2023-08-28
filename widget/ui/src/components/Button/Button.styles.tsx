import { darkTheme, styled } from '../../theme';

export const ButtonBase = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '$16',
  fontWeight: '$400',
  border: '0',
  borderRadius: '$xs',
  cursor: 'pointer',
  transition: 'all 0.35s',

  '&:active': {
    transform: 'scale(0.95)',
  },

  variants: {
    size: {
      xsmall: {
        borderRadius: '$xm',
        fontSize: '$10',
        lineHeight: '12px',
        padding: '$0 $4',
      },
      small: {
        borderRadius: '$xm',
        fontSize: '$12',
        lineHeight: '16px',
        padding: '$4 $4',
      },
      medium: {
        borderRadius: '$md',
        fontSize: '$14',
        lineHeight: '24px',
        padding: '$8 $8',
      },
      large: {
        borderRadius: '$md',
        fontSize: '$18',
        lineHeight: '24px',
        padding: '$12 $24',
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
          backgroundColor: '$neutral300',
        },
        '&:disabled:hover': {
          backgroundColor: '$neutral300',
          transform: 'unset',
        },
      },
      outlined: {
        backgroundColor: '$neutral100',
        border: 1,
        borderStyle: 'solid',
        borderColor: '$neutral400',
        color: '$foreground',

        '&:hover': {
          borderColor: '$neutral600',
        },
        '&:disabled': {
          borderColor: '$neutral300',
          color: '$neutral300',
        },
        '&:disabled:hover': {
          borderColor: '$neutral300',
          transform: 'unset',
          color: '$neutral300',
        },
      },
      ghost: {
        background: 'transparent',

        '&:hover': {
          color: '$neutral900',
        },
        '&:disabled': {
          color: '$neutral300',
        },
      },
    },
    fullWidth: {
      true: {
        width: '100%',
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
        color: '$neutral100',
        '&:hover': {
          background: '$primary700',
        },
        '&:visited': {
          background: '$primary',
        },
        '&:focus': {
          background: '$primary',
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
      },
    },
    {
      type: 'primary',
      variant: 'ghost',
      css: {
        color: '$primary',
        '&:hover': {
          color: '$neutral900',
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
  ],
  defaultVariants: {
    size: 'medium',
    variant: 'contained',
  },
});

export const Content = styled('span', {
  display: 'inline-block',
  variants: {
    pl: {
      true: {
        paddingLeft: '$8',
      },
    },
    pr: {
      true: {
        paddingRight: '$8',
      },
    },
  },
});
