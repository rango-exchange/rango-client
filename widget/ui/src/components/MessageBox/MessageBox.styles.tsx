import { darkTheme, styled } from '../../theme';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

export const Description = styled('div', {
  textAlign: 'center',
});

export const IconHighlight = styled('div', {
  borderRadius: '50%',
  width: '$45',
  height: '$45',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  variants: {
    type: {
      success: {
        $$color: '$colors$success300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$success600',
        },
        backgroundColor: '$$color',
      },
      warning: {
        $$color: '$colors$warning300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$warning600',
        },
        backgroundColor: '$$color',
      },
      error: {
        $$color: '$colors$error300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$error600',
        },
        backgroundColor: '$$color',
      },
      info: {
        $$color: '$colors$info300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$info600',
        },
        backgroundColor: '$$color',
      },
      loading: {
        $$color: '$colors$info300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$info600',
        },
        backgroundColor: '$$color',
      },
    },
  },
});
