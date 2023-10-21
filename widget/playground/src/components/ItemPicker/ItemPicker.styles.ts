import { styled } from '@rango-dev/ui';

export const InputContainer = styled('div', {
  border: '1px solid $neutral300',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '$10',
  width: '100%',
  borderRadius: '$xm',
  cursor: 'pointer',
  alignItems: 'center',
  '&:hover': {
    borderColor: '$info300',
    '& svg': {
      color: '$secondary500',
    },
  },
  variants: {
    disabled: {
      true: {
        cursor: 'default',
        '&:hover': {
          borderColor: '$neutral300',
          '& svg': {
            color: '$neutral900',
          },
        },
      },
    },
  },
});

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

export const Title = styled('div', {
  display: 'flex',
});
