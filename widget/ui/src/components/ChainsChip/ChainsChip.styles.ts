import { styled } from '../../theme';

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
      true: { border: '1px solid $secondary' },
    },
  },
});
