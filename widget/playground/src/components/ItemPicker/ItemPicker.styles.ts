import { styled } from '@arlert-dev/ui';

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
    borderColor: '$secondary200',
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
  '.title_typography': {
    textTransform: 'capitalize',
  },
});

export const Title = styled('div', {
  display: 'flex',
});
