import { styled } from '../../theme';

export const ChipCointainer = styled('div', {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$xs',
  padding: '$5 $15',
  cursor: 'pointer',
  transition: 'all 0.35s',
  backgroundColor: '$neutral200',

  '&:hover': {
    backgroundColor: '$surface600',
  },

  variants: {
    selected: {
      true: { border: '1px solid $secondary' },
    },
  },
});
