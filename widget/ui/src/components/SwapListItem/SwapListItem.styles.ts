import { darkTheme, styled } from '../../theme';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: 10,
});

export const Header = styled('div', {
  display: 'flex',
  padding: 0,
  justifyContent: 'space-between',
  alignItems: 'center',
  alignSelf: 'stretch',
});

export const Main = styled('button', {
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  border: 'none',
  width: '100%',
  borderRadius: '$xm',
  gap: 10,
  padding: 15,
  cursor: 'pointer',
  fontFamily: 'inherit',
  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },
  '&:focus-visible': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$info700',
    },
    backgroundColor: '$$color',
    outline: 'none',
  },
});

export const Date = styled('div', {
  display: 'flex',
  padding: '$2',
  alignItems: 'flex-start',
});

export const LoadingMain = styled('div', {
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  border: 'none',
  width: '100%',
  borderRadius: '$xm',
  gap: 10,
  padding: 15,
});

export const LoadingContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: 25,
});
