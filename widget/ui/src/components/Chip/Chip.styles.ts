import { styled } from '../../theme';

export const ChipContainer = styled('button', {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$xs',
  padding: '$5 $15',
  cursor: 'pointer',
  transition: 'all 0.35s',
  backgroundColor: '$neutral200',
  border: 'none',

  '&:hover': {
    backgroundColor: '$surface600',
  },

  variants: {
    selected: {
      true: { border: '1px solid $secondary' },
    },
  },
});
