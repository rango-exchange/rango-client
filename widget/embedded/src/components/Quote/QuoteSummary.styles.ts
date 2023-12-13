import { css, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const separatorStyles = css({
  height: '14px',
  marginLeft: '14px',
  position: 'absolute',
  borderLeft: '1px solid $foreground',
  top: '42%',
});
