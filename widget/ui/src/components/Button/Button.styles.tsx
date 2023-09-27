import { darkTheme, keyframes, styled } from '../../theme';

export const ButtonBase = styled('button', {
  position: 'relative',
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '$16',
  fontWeight: '$400',
  border: '0',
  borderRadius: '$xs',
  cursor: 'pointer',
  transition: 'all 0.35s',

  variants: {
    size: {
      xxsmall: {
        borderRadius: '$xm',
        fontSize: '$10',
        lineHeight: '12px',
        padding: '$4',
      },
      xsmall: {
        borderRadius: '$xm',
        fontSize: '$12',
        lineHeight: '12px',
        padding: '$0 $4',
      },
      small: {
        borderRadius: '$xm',
        fontSize: '$14',
        fontWeight: '$medium',
        lineHeight: '20px',
        padding: '$4 $4',
      },
      medium: {
        borderRadius: '$md',
        fontSize: '$16',
        lineHeight: '24px',
        fontWeight: '$medium',
        padding: '$8 $8',
      },
      large: {
        borderRadius: '$md',
        fontSize: '$18',
        lineHeight: '26px',
        padding: '$12 $24',
        fontWeight: '$medium',
      },
    },
    variant: {
      contained: {
        backgroundColor: '$background',
        color: '$foreground',
        border: 0,
        '&:hover': {
          backgroundColor: '$neutral300',
        },
        '&:disabled': {
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          backgroundColor: '$neutral800',
          color: '$$color',
        },
        '&:disabled:hover': {
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          backgroundColor: '$neutral800',
          color: '$$color',
          transform: 'unset',
        },
      },
      outlined: {
        backgroundColor: '$background',
        border: 1,
        borderStyle: 'solid',
        color: '$foreground',
        borderColor: '$neutral200',
        '&:hover': {
          borderColor: '$neutral300',
        },
        '&:disabled': {
          borderColor: '$neutral800',
          color: '$neutral800',
        },
        '&:disabled:hover': {
          borderColor: '$neutral800',
          transform: 'unset',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$neutral900',
        '&:disabled': {
          color: '$neutral800',
        },
        '&:hover': {
          color: '$secondary500',
        },
      },
      default: {},
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
      secondary: {},
    },
  },

  compoundVariants: [
    {
      type: 'primary',
      variant: 'contained',
      css: {
        background: '$primary500',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        '&:hover': {
          background: '$primary600',
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          color: '$$color',
        },
        '&:disabled': {
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          background: '$neutral800',
          color: '$$color',
        },
        '&:visited': {
          background: '$primary500',
        },
        '&:active': {
          backgroundColor: '$primary500',
          backgroundSize: '100%',
          transition: 'background 0s',
        },
      },
    },
    {
      type: 'primary',
      variant: 'outlined',
      css: {
        color: '$primary500',
        borderColor: '$primary500',
        '&:hover': {
          color: '$primary600',
          borderColor: '$primary600',
        },
      },
    },
    {
      type: 'primary',
      variant: 'ghost',
      css: {
        color: '$primary500',
        '&:hover': {
          color: '$primary600',
        },
      },
    },
    {
      type: 'secondary',
      variant: 'contained',
      css: {
        background: '$secondary500',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        '&:hover': {
          background: '$secondary500',
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          color: '$$color',
        },
        '&:visited': {
          background: '$secondary500',
        },
        '&:focus': {
          background: '$secondary500',
        },
      },
    },
    {
      type: 'secondary',
      variant: 'outlined',
      css: {
        color: '$secondary500',
        borderColor: '$secondary500',
        '&:hover': {
          color: '$secondary500',
          borderColor: '$secondary500',
        },
        '&:visited': {
          color: '$secondary500',
          borderColor: '$secondary500',
        },
        '&:focus': {
          color: '$secondary500',
          borderColor: '$secondary500',
        },
      },
    },
    {
      type: 'secondary',
      variant: 'ghost',
      css: {
        color: '$secondary500',
        '&:hover': {
          color: '$secondary500',
        },
        '&:visited': {
          color: '$secondary500',
        },
        '&:focus': {
          color: '$secondary500',
        },
      },
    },
    {
      type: 'error',
      variant: 'contained',
      css: {
        background: '$error500',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        '&:hover': {
          background: '$error500',
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          color: '$$color',
        },
        '&:visited': {
          background: '$error500',
        },
        '&:focus': {
          background: '$error500',
        },
      },
    },
    {
      type: 'error',
      variant: 'outlined',
      css: {
        color: '$error500',
        borderColor: '$error500',
        '&:hover': {
          color: '$error500',
          borderColor: '$error500',
        },
        '&:visited': {
          color: '$error500',
          borderColor: '$error500',
        },
        '&:focus': {
          color: '$error500',
          borderColor: '$error500',
        },
      },
    },
    {
      type: 'error',
      variant: 'ghost',
      css: {
        color: '$error500',
        '&:hover': {
          color: '$error500',
        },
        '&:visited': {
          color: '$error500',
        },
        '&:focus': {
          color: '$error500',
        },
      },
    },
    {
      type: 'warning',
      variant: 'contained',
      css: {
        background: '$warning500',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        '&:hover': {
          background: '$warning500',
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          color: '$$color',
        },
        '&:visited': {
          background: '$warning500',
        },
        '&:focus': {
          background: '$warning500',
        },
      },
    },
    {
      type: 'warning',
      variant: 'outlined',
      css: {
        color: '$warning500',
        borderColor: '$warning500',
        '&:hover': {
          color: '$warning500',
          borderColor: '$warning500',
        },
        '&:visited': {
          color: '$warning500',
          borderColor: '$warning500',
        },
        '&:focus': {
          color: '$warning500',
          borderColor: '$warning500',
        },
      },
    },
    {
      type: 'warning',
      variant: 'ghost',
      css: {
        color: '$warning500',
        '&:hover': {
          color: '$warning500',
        },
        '&:visited': {
          color: '$warning500',
        },
        '&:focus': {
          color: '$warning500',
        },
      },
    },
    {
      type: 'success',
      variant: 'contained',
      css: {
        background: '$success500',
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
        '&:hover': {
          background: '$success500',
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          color: '$$color',
        },
        '&:visited': {
          background: '$success500',
        },
        '&:focus': {
          background: '$success500',
        },
      },
    },
    {
      type: 'success',
      variant: 'outlined',
      css: {
        color: '$success500',
        borderColor: '$success500',
        '&:hover': {
          color: '$success500',
          borderColor: '$success500',
        },
        '&:visited': {
          color: '$success500',
          borderColor: '$success500',
        },
        '&:focus': {
          color: '$success500',
          borderColor: '$success500',
        },
      },
    },
    {
      type: 'success',
      variant: 'ghost',
      css: {
        color: '$success500',
        '&:hover': {
          color: '$success500',
        },
        '&:visited': {
          color: '$success500',
        },
        '&:focus': {
          color: '$success500',
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

const ripple = keyframes({
  to: {
    transform: 'scale(2)',
    opacity: 0.1,
  },
});

export const RippleContainer = styled('div', {
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',

  '& span': {
    transform: 'scale(0)',
    borderRadius: '100%',
    position: 'absolute',
    opacity: '0.75',
    backgroundColor: '$neutral500',
    animation: `${ripple} 0.8s linear`,
  },
});
