import { styled } from '../../theme';

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$xs',

  '.title': {
    display: 'flex',
    alignItems: 'center',
    flex: '1 0 0',
  },

  '.footer': {
    paddingTop: '$5',
    paddingLeft: '$24',
  },
  '.description': {
    color: '$neutral600',
    fontSize: '$10',
    lineHeight: '$12',
  },
  variants: {
    type: {
      success: {},
      warning: {},
      error: {},
      info: {},
    },
    variant: {
      regular: {
        padding: '$5',
        alignItems: 'flex-start',
        backgroundColor: '$surface400',
      },
      alarm: {
        padding: '$5 $10',
        alignItems: 'center',
        '.title_typography': {
          fontWeight: '$medium',
        },
      },
    },
  },

  compoundVariants: [
    {
      type: 'warning',
      variant: 'alarm',
      css: {
        backgroundColor: '$warning100',
      },
    },
    {
      type: 'error',
      variant: 'alarm',
      css: {
        backgroundColor: '$error100',
      },
    },
    {
      type: 'info',
      variant: 'alarm',
      css: {
        backgroundColor: '$info100',
      },
    },
    {
      type: 'success',
      variant: 'alarm',
      css: {
        backgroundColor: '$success100',
      },
    },
  ],
});

export const Main = styled('div', {
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  variants: {
    variant: {
      regular: {
        justifyContent: 'space-between',
      },
      alarm: {
        justifyContent: 'flex-start',
      },
    },
  },
});

export const IconHighlight = styled('div', {
  borderRadius: '$lg',
  width: '$20',
  height: '$20',
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
    },
  },
});
