import { styled } from '@rango-dev/ui';

export const TextContainer = styled('div', {
  border: '1px solid $neutral300',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '$10 $15',
  width: '100%',
  borderRadius: '$sm',
  cursor: 'pointer',
  alignItems: 'center',
  '&:hover': {
    borderColor: '$info300',
  },
});
