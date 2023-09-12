import { darkTheme, styled } from '../../theme';

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
    $$color: '$colors$neutral900',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral800',
    },
    color: '$$color',
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
        backgroundColor: '$info100',
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
        $$color: '$colors$warning100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$warning700',
        },
        backgroundColor: '$$color',
      },
    },
    {
      type: 'error',
      variant: 'alarm',
      css: {
        $$color: '$colors$error100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$error700',
        },
        backgroundColor: '$$color',
      },
    },
    {
      type: 'info',
      variant: 'alarm',
      css: {
        $$color: '$colors$info100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$info700',
        },
        backgroundColor: '$$color',
      },
    },
    {
      type: 'success',
      variant: 'alarm',
      css: {
        $$color: '$colors$success100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$success700',
        },
        backgroundColor: '$$color',
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
  alignSelf: 'flex-start',
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
    },
  },
});
