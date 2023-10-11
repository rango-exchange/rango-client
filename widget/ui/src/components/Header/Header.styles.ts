import { darkTheme, styled } from '../../theme';

export const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$15 $20',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  position: 'relative',
  borderTopRightRadius: '$primary',
  borderTopLeftRadius: '$primary',
});

export const Suffix = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$5',
});
