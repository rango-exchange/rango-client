import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  backgroundColor: '$neutral100',
  borderRadius: '$xm $xm 0 0',
  padding: '$8 $15',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '& .flex': {
    display: 'flex',
    alignItems: 'center',
  },

  '& img': {
    borderRadius: '100%',
  },
});
