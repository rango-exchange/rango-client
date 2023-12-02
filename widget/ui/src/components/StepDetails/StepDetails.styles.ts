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
  '& .swapper': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .swapper__description': {
    fontWeight: '$medium',
  },
  '& .step-info': {
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
  },
  '& div:nth-child(3)': { display: 'flex', flexDirection: 'column', flex: 1 },
  '& .tokens-container': { width: '100%' },
  '& .tokens': {
    display: 'flex',
    paddingTop: '$5',
    paddingBottom: '$10',
    alignItems: 'center',
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
