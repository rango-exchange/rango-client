import { css } from '@stitches/react';

import { darkTheme, styled } from '../../theme';

export const Container = styled('div', {
  width: '100%',
  position: 'relative',
  padding: '0 0.5rem',
  boxSizing: 'border-box',
  border: '1px solid transparent',
  variants: {
    type: {
      'quote-details': { border: 'none' },
      'swap-progress': {
        backgroundColor: '$neutral100',
        $$color: '$colors$neutral100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral300',
        },
        borderRadius: '$xm',
        padding: '$10 $15',
        marginBottom: '15px',
      },
    },
    state: {
      default: {
        borderColor: 'transparent',
      },
      'in-progress': { borderColor: '$info500' },
      completed: {
        borderColor: '$success500',
      },
      warning: { borderColor: '$warning500' },
      error: { borderColor: '$error500' },
    },
  },
});

export const SwapperImage = styled('div', {
  borderRadius: '100%',
  width: '24px',
  height: '24px',
  overflow: 'hidden',
  border: '1.5px solid transparent',
  variants: {
    state: {
      default: {
        borderColor: 'transparent',
      },
      'in-progress': { borderColor: '$info500' },
      completed: {
        borderColor: '$success500',
      },
      warning: { borderColor: '$warning500' },
      error: { borderColor: '$error500' },
    },
  },
});

export const Alerts = styled('div', {
  width: '100%',
  variants: {
    pb: {
      true: {
        paddingBottom: '35px',
      },
    },
  },
});

export const DashedLine = styled('div', {
  borderLeft: '1px dashed black',
  minHeight: '64px',
  margin: '0 11.5px',
  alignSelf: 'stretch',
  variants: {
    invisible: {
      true: {
        visibility: 'hidden',
        minHeight: 'unset',
      },
    },
  },
});

export const SwapperSeparator = styled('div', {
  borderLeft: '1px solid transparent',
  margin: '0 $12',
  display: 'block',
  height: '8px',
  variants: {
    state: {
      default: {
        borderColor: 'transparent',
      },
      'in-progress': { borderColor: '$info500' },
      completed: {
        borderColor: '$success500',
      },
      warning: { borderColor: '$warning500' },
      error: { borderColor: '$error500' },
    },
  },
});

export const StepSeparator = styled('div', {
  borderLeft: '1px dashed transparent',
  margin: '0 $10',
  alignSelf: 'stretch',
  display: 'block',
  height: '15px',
  position: 'absolute',
  top: '-16px',
  left: '16px',
  variants: {
    state: {
      default: {
        borderColor: 'transparent',
      },
      'in-progress': { borderColor: '$info500' },
      completed: {
        borderColor: '$success500',
      },
      warning: { borderColor: '$warning500' },
      error: { borderColor: '$error500' },
    },
  },
});

export const tokensContainerStyles = css({
  width: '100%',
});

export const swappersStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

export const swapperItemStyles = css({
  display: 'flex',
  alignItems: 'center',
});

export const stepInfoStyles = css({
  display: 'flex',
  flex: '1',
  width: '100%',
  alignItems: 'start',
  variants: {
    tx: {
      true: {
        paddingLeft: '36px',
      },
    },
  },
});

export const tokensStyles = css({
  display: 'flex',
  paddingTop: '$5',
  paddingBottom: '$10',
  alignItems: 'center',
});
