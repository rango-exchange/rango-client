import { styled } from '../../theme';

export const MainContainer = styled('div', {
  variants: {
    loaded: {
      true: {
        overflowY: 'auto',
        padding: '0 $4',
      },
    },
  },
});

export const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
});
