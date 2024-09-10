import { darkTheme, styled } from '../../theme.js';
import { Button } from '../Button/index.js';

export const Tabs = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  justifyContent: 'space-between',
  height: '100%',
  variants: {
    type: {
      secondary: {
        border: '3px solid $neutral100',
        backgroundColor: '$neutral100',
      },
      primary: {
        $$color: '$colors$neutral200',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral500',
        },
        borderColor: '$$color',
        borderWidth: '5px',
        borderStyle: 'solid',
        backgroundColor: '$$color',
      },
      bordered: { backgroundColor: 'inherit' },
    },
    borderRadius: {
      small: {
        borderRadius: '$xs',
      },
      medium: {
        borderRadius: '$sm',
      },
      full: {
        borderRadius: '$xm',
      },
      none: {
        borderRadius: 'unset',
      },
    },
  },
});

export const Tab = styled(Button, {
  color: '$neutral700',
  flex: 1,
  backgroundColor: 'transparent',
  height: '100%',
  zIndex: 10,
  '& ._text': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  variants: {
    borderRadius: {
      small: {
        borderRadius: '$xs',
      },
      medium: {
        borderRadius: '$sm',
      },
      full: {
        borderRadius: '$xm',
      },
      none: {
        borderRadius: 'unset',
      },
    },
    type: {
      primary: {
        padding: '$5 $10',
        height: '100%',
      },
      secondary: {},
      bordered: {},
    },
    isActive: {
      true: {
        transition: 'color 0.8s linear',
      },
      false: {},
    },
  },

  compoundVariants: [
    {
      type: 'secondary',
      isActive: true,
      css: {
        $$color: '$colors$background',
        [`.${darkTheme} &`]: {
          $$color: '$colors$foreground',
        },
        color: '$$color',
      },
    },
    {
      type: 'secondary',
      isActive: false,
      css: {
        '&:hover': {
          backgroundColor: '$secondary100',
          color: '$secondary500',
          [`.${darkTheme} &`]: {
            backgroundColor: 'transparent',
            color: '$neutral700',
          },
        },
      },
    },

    {
      type: 'primary',
      isActive: true,
      css: {
        color: '$secondary',
        '& svg': {
          color: '$secondary',
        },
      },
    },
    {
      type: 'primary',
      isActive: false,
      css: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    {
      type: 'bordered',
      isActive: true,
      css: {
        color: '$secondary500',
      },
    },
    {
      type: 'bordered',
      isActive: false,
      css: {
        color: '$neutral600',
        fontWeight: '$regular',
        '&:hover': {
          color: '$secondary550',
        },
      },
    },
  ],
});

export const BackdropTab = styled('div', {
  padding: '$4',
  position: 'absolute',
  inset: 0,
  transition: 'transform 0.2s cubic-bezier(0, 0, 0.86, 1.2)',
  '&.no-transition': {
    transition: 'none',
  },
  variants: {
    type: {
      secondary: {
        backgroundColor: '$secondary500',
      },
      primary: {
        backgroundColor: '$background',
      },
      bordered: {
        borderBottom: '$secondary500 solid 2px',
      },
    },
    borderRadius: {
      small: {
        borderRadius: '$xs',
      },
      medium: {
        borderRadius: '$sm',
      },
      full: {
        borderRadius: '$xm',
      },
      none: {
        borderRadius: 'unset',
      },
    },
  },
});
