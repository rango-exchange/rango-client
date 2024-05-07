import { styled } from '../../theme';

export const ModalContent = styled('div', {
  display: 'grid',
  gap: '$8',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  overflow: 'auto',
});
