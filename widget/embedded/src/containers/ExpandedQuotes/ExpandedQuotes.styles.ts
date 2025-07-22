import { darkTheme, styled } from '@arlert-dev/ui';

export const Container = styled('div', {
  transition: 'width 0.2s, opacity 0.2s, margin-left 0.2s',
  height: '700px',
  width: '390px',
  position: 'relative',
  opacity: 1,
  marginLeft: '$16',
  backgroundColor: '$neutral100',
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral300',
  },

  variants: {
    expandMode: {
      default: {
        width: '390px',
      },
      full: {
        width: '719px',
      },
    },
  },

  '&.is-hidden': {
    width: 0,
    height: 0,
    opacity: 0,
    marginLeft: 0,
  },
});

export const Content = styled('div', {
  position: 'relative',
  overflow: 'hidden',
  padding: '$20',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  borderRadius: '$primary',
  backgroundColor: '$background',
});
