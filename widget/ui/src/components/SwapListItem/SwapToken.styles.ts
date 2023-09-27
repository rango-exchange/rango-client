import { styled } from '../../theme';

export const TokenContainer = styled('div', {
  display: 'flex',
  padding: 0,
  alignItems: 'center',
  gap: 10,
});

export const Images = styled('div', {
  display: 'flex',
  padding: 0,
  alignItems: 'center',
  alignSelf: 'stretch',
});

export const Layout = styled('div', {
  display: 'flex',
  alignItems: 'flex-start',
  variants: {
    direction: {
      column: {
        flexDirection: 'column',
        flex: '1 0 0',
      },
      row: {
        padding: 0,
      },
    },
  },
});

export const TopSection = styled('div', {
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'stretch',
});

export const TokenInfo = styled('div', {
  display: 'flex',
  padding: 0,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

export const Icon = styled('div', {
  display: 'flex',
  padding: '$4',
  width: '$32',
  height: '$32',

  justifyContent: 'center',
  alignItems: 'center',
});

export const LayoutLoading = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const IconLoading = styled('div', {
  display: 'flex',
  width: '$24',
  height: '$24',
  justifyContent: 'center',
  alignItems: 'center',
});

export const LoadingContainer = styled('div', {
  display: 'flex',
  padding: 0,
  alignItems: 'center',
  gap: 25,
});
