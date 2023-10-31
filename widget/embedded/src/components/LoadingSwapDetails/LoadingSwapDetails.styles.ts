import { styled } from '@rango-dev/ui';

export const Container = styled('div', {
  width: '100%',
  height: '100%',
  padding: '$0 $20',

  '.cost': {
    paddingTop: '$15',
    display: 'flex',
  },

  '.route-summary': {
    padding: '$15 $0',
  },

  '.route-summary-item': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  '.token-amount': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  '.route-summary-separator': {
    width: '0px',
    height: '$16',
    borderLeft: '1px solid $neutral400',
    marginLeft: '13px',
  },

  '.swaps-steps': {
    paddingBottom: '$10',
  },
});

export const StepContainer = styled('div', {
  backgroundColor: '$neutral100',
  borderRadius: '$xm',
  padding: '$10 $15',

  '.step-title': {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
  },
  '.step-tokens': {
    paddingTop: '$5',
    display: 'flex',
    alignItems: 'center',
  },
  '.step-token-info': {
    display: 'flex',
    alignItems: 'center',
  },
  '.step-icon-container': {
    padding: '$4 $6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  '.extra-info': {
    display: 'flex',
    paddingTop: '$10',
    paddingBottom: '$5',
  },
});
export const StepSeparator = styled('div', {
  width: '0px',
  height: '$20',
  borderLeft: '1px dashed $neutral700',
  marginLeft: '25px',
});
