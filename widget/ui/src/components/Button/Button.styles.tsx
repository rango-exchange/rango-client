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
  borderRadius: '$secondary',
  cursor: 'pointer',
  transition: 'all 0.35s',
  fontFamily: 'inherit',
  variants: {
    size: {
      xxsmall: {
        fontSize: '$10',
        lineHeight: '12px',
        padding: '$4',
      },
      xsmall: {
        fontSize: '$12',
        lineHeight: '12px',
        padding: '$0 $4',
      },
      small: {
        fontSize: '$14',
        fontWeight: '$medium',
        lineHeight: '20px',
        padding: '$4 $4',
      },
      medium: {
        fontSize: '$16',
        lineHeight: '24px',
        fontWeight: '$medium',
        padding: '$8 $8',
      },
      large: {
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
        '&:focus-visible': {
          backgroundColor: '$neutral500',
          outline: 0,
        },
        '&:disabled': {
          $$color: '$colors$background',
          [`.${darkTheme} &`]: {
            $$color: '$colors$foreground',
          },
          backgroundColor: '$neutral600',
          color: '$$color',
          pointerEvents: 'none',
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
        '&:focus-visible': {
          borderColor: '$neutral500',
          outline: 0,
        },
        '&:disabled': {
          borderColor: '$neutral600',
          color: '$neutral600',
          pointerEvents: 'none',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '$neutral700',
        '&:disabled': {
          color: '$neutral600',
          pointerEvents: 'none',
        },
        '&:focus-visible': {
          backgroundColor: '$neutral500',
          outline: 0,
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
          background: '$neutral600',
          color: '$$color',
          pointerEvents: 'none',
        },
        '&:visited': {
          background: '$primary500',
        },
        '&:active': {
          backgroundColor: '$primary500',
          backgroundSize: '100%',
          transition: 'background 0s',
        },
        '&:focus-visible': {
          background: '$primary600',
          outline: 0,
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
        '&:focus-visible': {
          color: '$primary600',
          borderColor: '$primary600',
          outline: 0,
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
        '&:focus-visible': {
          color: '$primary600',
          outline: 0,
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
          background: '$secondary600',
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
          background: '$secondary600',
          outline: 0,
        },
        '&:focus-visible': {
          background: '$secondary600',
          outline: 0,
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
          color: '$secondary600',
          borderColor: '$secondary600',
        },
        '&:visited': {
          color: '$secondary500',
          borderColor: '$secondary500',
        },
        '&:focus': {
          color: '$secondary600',
          borderColor: '$secondary500',
          outline: 0,
        },
        '&:focus-visible': {
          color: '$secondary600',
          borderColor: '$secondary500',
          outline: 0,
        },
      },
    },
    {
      type: 'secondary',
      variant: 'ghost',
      css: {
        color: '$secondary500',
        '&:hover': {
          color: '$secondary600',
        },
        '&:visited': {
          color: '$secondary500',
        },
        '&:focus': {
          color: '$secondary600',
          outline: 0,
        },
        '&:focus-visible': {
          color: '$secondary600',
          outline: 0,
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
        },
        '&:visited': {
          background: '$error500',
        },
        '&:focus': {
          background: '$error500',
        },
        '&:focus-visible': {
          $$outline: '$colors$error600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$error300',
          },
          outlineColor: '$$outline',
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
        '&:focus-visible': {
          $$outline: '$colors$error600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$error300',
          },
          color: '$$outline',
          outlineColor: '$$outline',
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
        '&:focus-visible': {
          $$outline: '$colors$error600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$error300',
          },
          color: '$$outline',
          outline: 0,
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
        '&:focus-visible': {
          $$outline: '$colors$warning600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$warning300',
          },
          outlineColor: '$$outline',
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
        '&:focus-visible': {
          $$outline: '$colors$warning600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$warning300',
          },
          outlineColor: '$$outline',
          color: '$$outline',
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
        '&:focus-visible': {
          $$outline: '$colors$warning600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$warning300',
          },
          color: '$$outline',
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
        '&:focus-visible': {
          $$outline: '$colors$success600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$success300',
          },
          outlineColor: '$$outline',
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
        '&:focus-visible': {
          $$outline: '$colors$success600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$success300',
          },
          outlineColor: '$$outline',
          color: '$$outline',
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
        '&:focus-visible': {
          $$outline: '$colors$success600',
          [`.${darkTheme} &`]: {
            $$outline: '$colors$success300',
          },
          outline: 0,
          color: '$$outline',
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
  flexGrow: 1,
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
