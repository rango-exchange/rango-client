import { styled } from '@rango-dev/ui';

export const Chip = styled('button', {
  padding: '$10',
  borderRadius: '$sm',
  backgroundColor: '$neutral100',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  border: 0,
  '.image-container': {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
  '&:hover': {
    backgroundColor: '$neutral400',
  },
  '&:focus-visible': {
    outline: 0,
    backgroundColor: '$neutral500',
  },
  variants: {
    selected: {
      true: { outline: '1px solid $secondary500' },
      false: { outline: 0 },
    },
  },
});