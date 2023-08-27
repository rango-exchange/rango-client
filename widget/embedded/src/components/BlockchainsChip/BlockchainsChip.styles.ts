import { styled } from '@rango-dev/ui';

export const Chip = styled('button', {
  padding: '$10',
  borderRadius: '$sm',
  backgroundColor: '$neutral200',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  border: 0,
  '&:hover': {
    backgroundColor: '$surface600',
  },
  variants: {
    selected: {
      true: { outline: '1px solid $secondary' },
      false: { outline: 0 },
    },
  },
});
