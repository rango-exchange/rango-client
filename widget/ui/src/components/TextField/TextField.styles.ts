import { styled } from '../../theme';

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
        backgroundColor: '$surface100',
        '&:hover': {
          backgroundColor: '$surface600',
        },
      },
      outlined: {
        backgroundColor: 'transparent',
        border: '1px solid $surface100',
        '&:hover': {
          borderColor: '$surface600',
        },
      },
      ghost: {
        background: 'transparent',
      },
    },
    color: {
      dark: {},
      light: {},
    },

    disabled: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      color: 'dark',
      variant: 'contained',
      css: {
        backgroundColor: '$surface200',
        '&:hover': {
          backgroundColor: '$surface600',
        },
      },
    },
    {
      color: 'dark',
      variant: 'outlined',
      css: {
        backgroundColor: 'transparent',
        border: '1px solid $surface200',
        '&:hover': {
          borderColor: '$surface600',
        },
      },
    },
    {
      color: 'light',
      variant: 'contained',
      css: {
        backgroundColor: '$surface100',
        '&:hover': {
          backgroundColor: '$surface600',
        },
      },
    },
    {
      color: 'light',
      variant: 'outlined',
      css: {
        backgroundColor: 'transparent',
        border: '1px solid $surface100',
        '&:hover': {
          borderColor: '$surface600',
        },
      },
    },
    {
      color: 'dark',
      variant: 'contained',
      disabled: true,
      css: {
        '&:hover': {
          backgroundColor: '$surface200',
        },
      },
    },
    {
      color: 'dark',
      variant: 'outlined',
      disabled: true,

      css: {
        '&:hover': {
          borderColor: '$surface200',
        },
      },
    },
    {
      color: 'light',
      variant: 'contained',
      disabled: true,
      css: {
        '&:hover': {
          backgroundColor: '$surface100',
        },
      },
    },
    {
      color: 'light',
      variant: 'outlined',
      disabled: true,
      css: {
        '&:hover': {
          borderColor: '$surface100',
        },
      },
    },
  ],
});

export const Input = styled('input', {
  flexGrow: 1,
  color: '$neutral900',
  fontSize: '$14',
  lineHeight: '$20',
  fontWeight: 400,
  border: 'none',
  outline: 'none',
  width: '100%',
  variants: {
    prefix: {
      true: { marginLeft: '$10' },
    },
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
    color: '$neutral600',
  },
});

export const Label = styled('label', {
  display: 'inline-block',
});
