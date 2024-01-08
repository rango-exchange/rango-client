import { styled } from '@rango-dev/ui';

export const MainContainer = styled('div', {
  width: '100%',
  minWidth: '300px',
  maxWidth: '390px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '$widget',
  boxSizing: 'border-box',
  '& *, *::before, *::after': {
    boxSizing: 'inherit',
  },
  '& *:focus-visible': {
    outlineColor: '$info500',
    transition: 'none',
  },
  '& ul, ol, li': { listStyleType: 'none' },
});
