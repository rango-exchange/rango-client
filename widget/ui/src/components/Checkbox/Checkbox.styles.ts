import * as RadixCheckbox from '@radix-ui/react-checkbox';

import { darkTheme, styled } from '../../theme';

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
  '&[data-state="checked"]': {
    $$color: '$colors$secondary500',
    [`.${darkTheme} &`]: {
      $$color: '$colors$secondary400',
    },
    backgroundColor: '$$color',
    borderColor: '$$color',
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
