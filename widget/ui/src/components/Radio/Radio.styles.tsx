import * as Radio from '@radix-ui/react-radio-group';

import { styled } from '../../theme';

export const StyledItem = styled(Radio.Item, {
  padding: '0',
  width: '16px',
  height: '16px',
  borderRadius: '100%',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '1px solid $neutral800',

  '&:hover': {
    borderColor: '$secondary600',
  },
  '&[data-state="checked"]': {
    backgroundColor: '$secondary600',
    borderColor: '$secondary600',
  },
});

export const StyledIndicator = styled(Radio.Indicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
  '&::after': {
    content: '',
    display: 'block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '$background',
  },
});
