import { darkTheme, styled } from '@rango-dev/ui';

export const IconWrapper = styled('div', {
  width: '$24',
  height: '$24',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const InputContainer = styled('div', {
  '._text-field': {
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    '._icon-button': {
      display: 'none',
    },
    '&:hover': {
      $$color: '$colors$neutral100',
      [`.${darkTheme} &`]: {
        $$color: '$colors$neutral300',
      },
      backgroundColor: '$$color',
      '._icon-button': {
        display: 'unset',
      },
    },
  },
});
