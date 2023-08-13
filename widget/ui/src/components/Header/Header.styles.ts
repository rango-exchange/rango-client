import { styled } from '../../theme';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$15 $20',
  backgroundColor: '$surface100',
  position: 'relative',
});

export const Suffix = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$5',
});
