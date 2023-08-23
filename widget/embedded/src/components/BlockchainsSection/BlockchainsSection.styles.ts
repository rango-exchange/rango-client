import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  display: 'grid',
  gap: '$10',
  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
});
