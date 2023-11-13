import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  '& .separator': {
    height: '14px',
    marginLeft: '14px',
    position: 'absolute',
    borderLeft: '1px solid $foreground',
    top: '42%',
  },
});
