import * as RadixCheckbox from '@radix-ui/react-checkbox';

import { styled } from '../../theme';

export const CheckboxContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export const CheckboxRoot = styled(RadixCheckbox.Root, {
  borderRadius: '$xs',
  position: 'relative',
  width: '1rem',
  height: '1rem',
  padding: 0,
  border: '1px solid $neutral800',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '$secondary600',
  },
  '&[data-state="checked"]': {
    backgroundColor: '$secondary600',
    borderColor: '$secondary600',
  },
});

export const CheckboxIndicator = styled(RadixCheckbox.CheckboxIndicator, {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Label = styled('label', {
  color: '$foreground',
  fontSize: '$m',
  cursor: 'pointer',
});
