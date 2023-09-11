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
  backgroundColor: '$neutral100',
  border: 'none',
  width: '100%',
  borderRadius: '$xm',
  gap: 10,
  padding: 15,
  cursor: 'pointer',
  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral400',
    },
    backgroundColor: '$$color',
  },
  '&:focus-visible': {
    backgroundColor: '$surface600',
    outline: 'none',
  },
});

export const Date = styled('div', {
  display: 'flex',
  padding: '$2',
  alignItems: 'flex-start',
});
