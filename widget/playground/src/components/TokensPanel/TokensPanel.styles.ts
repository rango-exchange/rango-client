import { styled } from '@yeager-dev/ui';

export const BlockchainsList = styled('div', {
  maxHeight: '90px',
  minHeight: '42px',
  border: '1px solid $neutral300',
  padding: '$10',
  borderRadius: '$xm',
  display: 'flex',
  flexWrap: 'wrap',
  overflow: 'auto',
  gap: '$5',
});

export const TokensHeaderList = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  '& .select_tokens': {
    display: 'flex',
    alignItems: 'center',
  },
});

export const ContainerChip = styled('div', {
  borderRadius: '$md',
  padding: '0 $10',
  display: 'flex',
  border: '1px solid transparent',
  justifyContent: 'center',
  alignItems: 'center',
  height: '$20',
  cursor: 'pointer',
  gap: '$10',
  '&:hover': {
    borderColor: '$info300',
  },
  variants: {
    variant: {
      selected: {
        backgroundColor: '$secondary500',
      },
      empty: {
        backgroundColor: '$neutral300',
      },
      regular: {
        backgroundColor: '$info100',
      },
    },
  },
});

export const ListContainer = styled('div', {
  height: '100%',
});
