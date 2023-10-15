import { styled } from '../../theme';

export const Container = styled('div', {
  display: 'grid',
  gap: '$10',
  gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr',
});

export const ImageContent = styled('div', {
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '$10',
});
export const FirstImage = styled('img', {
  position: 'absolute',
  top: -2,
  width: 15,
  height: 15,
});
