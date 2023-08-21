import { styled } from '../../theme';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
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
        backgroundColor: '$success300',
      },
      warning: {
        backgroundColor: '$warning300',
      },
      error: {
        backgroundColor: '$error300',
      },
      info: {
        backgroundColor: '$info300',
      },
      loading: {
        backgroundColor: '$info300',
      },
    },
  },
});
