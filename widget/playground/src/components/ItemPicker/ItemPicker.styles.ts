import { styled } from '@yeager-dev/ui';

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
            color: '$neutral700',
          },
        },
      },
    },
  },
});

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const Title = styled('div', {
  display: 'flex',
});
