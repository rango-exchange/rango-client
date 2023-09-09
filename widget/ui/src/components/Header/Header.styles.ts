import { styled } from '../../theme';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$15 $20',
  backgroundColor: '$neutral100',
  position: 'relative',
  borderTopRightRadius: '$md',
  borderTopLeftRadius: '$md',
});

export const Suffix = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$5',
});
