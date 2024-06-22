import { styled } from '@rango-dev/ui';

export const Label = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export const Select = styled('div', {
  padding: '$10',
  borderRadius: '$xm',
  border: '1px solid $neutral300',
  backgroundColor: '$background',

  '& .field': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  '& .chips': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '$5',
  },

  variants: {
    disabled: {
      false: {
        '&:hover': {
          borderColor: '$secondary200',
          '& svg': {
            color: '$secondary500',
          },
        },
        '& .field': {
          cursor: 'pointer',
        },
      },
      true: {
        '& .chips': {
          '& div': {
            backgroundColor: '$neutral500',
            '& span': {
              color: '$neutral600',
            },
          },
        },
      },
    },
  },
});

export const WalletChip = styled('div', {
  borderRadius: '$md',
  padding: '1px $10',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  variants: {
    variant: {
      contained: {
        backgroundColor: '$secondary100',
      },
      outlined: {
        backgroundColor: 'transparent',
        border: '1px solid $secondary500',
      },
    },
  },
});
