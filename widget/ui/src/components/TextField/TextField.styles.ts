import { darkTheme, styled } from '../../theme';

export const InputContainer = styled('div', {
  borderRadius: '$xs',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  variants: {
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {
        width: 'fit-content',
      },
    },
    size: {
      small: {
        padding: '$5 $15',
      },
      large: {
        padding: '$10',
        borderRadius: '$xl',
      },
    },
    variant: {
      contained: {
        $$color: '$colors$neutral100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral300',
        },
        backgroundColor: '$$color',
        '&:hover': {
          $$color: '$colors$info100',
          [`.${darkTheme} &`]: {
            $$color: '$colors$neutral100',
          },
          backgroundColor: '$$color',
        },
      },
      outlined: {
        backgroundColor: 'transparent',
        border: '1px solid $neutral100',
        '&:hover': {
          $$color: '$colors$info100',
          [`.${darkTheme} &`]: {
            $$color: '$colors$neutral400',
          },
          borderColor: '$$color',
        },
      },
      ghost: {
        background: 'transparent',
      },
    },

    disabled: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      variant: 'contained',
      disabled: true,
      css: {
        '&:hover': {
          backgroundColor: '$neutral100',
        },
      },
    },
    {
      variant: 'outlined',
      disabled: true,
      css: {
        '&:hover': {
          borderColor: '$neutral100',
        },
      },
    },
  ],
});

export const Input = styled('input', {
  flexGrow: 1,
  color: '$foreground',
  fontSize: '$14',
  lineHeight: '$20',
  fontWeight: 400,
  border: 'none',
  outline: 'none',
  fontFamily: 'inherit',
  maxWidth: '100%',
  variants: {
    suffix: {
      true: { marginRight: '$10' },
    },
  },
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

  '&::placeholder, &::-webkit-input-placeholder': {
    color: '$neutral700',
  },
  '&:focus-visible': {
    outline: 'none',
  },
});

export const Label = styled('label', {
  display: 'inline-block',
});
