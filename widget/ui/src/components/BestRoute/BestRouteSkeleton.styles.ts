import { styled } from '../../theme';

export const Container = styled('div', {
  backgroundColor: '$neutral100',
  borderBottomLeftRadius: '$xm',
  borderBottomRightRadius: '$xm',
  padding: '$15 ',
  '& .cost-and-tag': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '22px',
  },
  variants: {
    rounded: {
      true: {
        borderRadius: '$xm',
      },
    },
  },
  '& .cost': {
    display: 'flex',
  },
  '& .basic-summary': {
    padding: '$15 $0 14px $0',
  },
  '& .output': {
    padding: '$6 $0 $15 $0',
    display: 'flex',
    flexDirection: 'column',
  },
  '& .output__token-info': {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    paddingBottom: '$5',
  },
  '& .route-summary': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
  },
  '& .route-summary__separator': {
    height: '$28',
    marginLeft: '13px',
    borderLeft: '1px solid $neutral900',
  },
  '& .token-amount': {
    display: 'flex',
    justifyContent: 'space-between',
  },
  '& .token-amount__label': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  '& .chains': {
    paddingTop: '$2',
  },
  '& .swap-preview': {
    padding: '$15 $0 $15 $0',
  },
  '& .steps': {
    paddingLeft: '$8',
  },
  '& .step__title': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .step__content': {
    display: 'flex',
    alignItems: 'start',
  },
  '& .step__tokens': {
    paddingTop: '$5',
    paddingBottom: '$10',
    display: 'flex',
    alignItems: 'center',
  },
  '& .step__token-info': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .step__icon-container': {
    margin: '$0 $2',
    padding: '$4',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const StepSeparator = styled('div', {
  borderLeft: '1px dashed black',
  minHeight: ' 64px',
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
