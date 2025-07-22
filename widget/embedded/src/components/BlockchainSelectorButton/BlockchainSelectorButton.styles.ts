import { darkTheme, styled } from '@arlert-dev/ui';

export const InputContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  height: '$40',
  padding: '$4 $10',
  borderRadius: '$sm',
  cursor: 'pointer',
  alignItems: 'center',
  backgroundColor: '$neutral300',
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral400',
  },

  '&:hover': {
    backgroundColor: '$secondary100',
    [`.${darkTheme} &`]: {
      backgroundColor: '$neutral500',
    },
  },
  variants: {
    disabled: {
      true: {
        cursor: 'default',
        '&:hover': {
          borderColor: '$neutral300',
          '& svg': {
            color: '$neutral700',
          },
        },
      },
    },
  },
});

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  '.title_typography': {
    textTransform: 'capitalize',
  },
});

export const FlexContainer = styled('div', {
  display: 'flex',
});
