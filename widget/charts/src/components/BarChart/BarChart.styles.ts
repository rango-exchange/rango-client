import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  position: 'relative',
});

export const TooltipContainer = styled('div', {
  width: 165,
  backgroundColor: '$background',
  borderRadius: '$sm',
});

export const TooltipInfoRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  fontSize: '$12',
  color: '$foreground',
  justifyContent: 'space-between',
  padding: '$8 $10',
  fontWeight: '$medium',
});

export const Line = styled('div', {
  height: 1,
  width: '100%',
  backgroundColor: '$neutral300',
});

export const InfoContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '$10',
  color: '$foreground',
  padding: '$5 $10',
});

export const Circle = styled('div', {
  width: '$6',
  height: '$6',
  borderRadius: 3,
});

export const NameWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
});
