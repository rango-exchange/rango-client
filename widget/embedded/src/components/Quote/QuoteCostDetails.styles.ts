import { css, styled } from '@rango-dev/ui';

export const FeeSection = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '$5 0',
  '&.total_payable_fee': {
    padding: '$12 0',
  },
});

export const Line = styled('div', {
  width: '100%',
  borderTop: '1px solid $neutral300',
  margin: '$10 0',
});

export const ModalContainer = styled('div', {
  padding: '$20 0',
  display: 'flex',
  flexDirection: 'column',
  '& .collapsible_trigger': {
    display: 'flex',
    alignItems: 'center',
  },
});

export const ModalHeader = styled('div', {
  padding: '$20 $20 $10',
  textAlign: 'center',
  position: 'relative',
  '._icon-button': {
    position: 'absolute',
    zIndex: 10,
    top: '$16',
    right: '$16',
  },
});
export const trigger = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '$5',
  '&:hover': {
    '& ._typography, & svg': {
      color: '$secondary',
    },
  },
});
