import { Collapsible, styled } from '@arlert-dev/ui';

export const CollapseContainer = styled(Collapsible, {
  borderRadius: '$xm',
  backgroundColor: '$neutral100',
  border: '1px solid $neutral100',
  '&:hover': {
    borderColor: '$secondary200',
    '& .collapse_header > svg': {
      color: '$secondary500',
    },
  },
});

export const CollapseHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  cursor: 'pointer',
  padding: '$20 $25',
  textTransform: 'capitalize',
});

export const CollapseContent = styled('div', {
  padding: '0 $15 $20',
});
