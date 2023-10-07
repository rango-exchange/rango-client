import { Collapsible, styled } from '@rango-dev/ui';

export const CollapseContainer = styled(Collapsible, {
  borderRadius: '$sm',
  backgroundColor: '$neutral100',
  border: '1px solid $neutral100',
  '&:hover': {
    borderColor: '$info300',
  },
});

export const CollapseHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  cursor: 'pointer',
  padding: '$20 $15',
});

export const CollapseContent = styled('div', {
  padding: '0 $15 $20',
});
