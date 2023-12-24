import { darkTheme, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  borderBottomLeftRadius: '$xm',
  borderBottomRightRadius: '$xm',
  padding: '$15 ',
  variants: {
    rounded: {
      true: {
        borderRadius: '$xm',
      },
    },
  },
});

export const Chains = styled('div', {
  paddingTop: '$2',
});

export const Steps = styled('div', {
  paddingLeft: '$8',
});

export const StepSeparator = styled('div', {
  borderLeft: '1px dashed black',
  minHeight: ' 0',
  margin: '0px 11.5px',
  alignSelf: 'stretch',
  variants: {
    hideSeparator: {
      true: {
        minHeight: 'unset',
        height: '0',
      },
    },
  },
});
