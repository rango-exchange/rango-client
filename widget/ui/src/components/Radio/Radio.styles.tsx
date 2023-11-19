import * as Radio from '@radix-ui/react-radio-group';

import { darkTheme, styled } from '../../theme';

export const StyledItem = styled(Radio.Item, {
  padding: '0',
  width: '16px',
  height: '16px',
  borderRadius: '100%',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  $$borderColor: '$colors$neutral600',
  [`.${darkTheme} &`]: {
    $$borderColor: '$colors$neutral700',
  },
  border: '1px solid $$borderColor',
  '&[data-state="checked"]': {
    $$color: '$colors$secondary500',
    [`.${darkTheme} &`]: {
      $$color: '$colors$secondary400',
    },
    backgroundColor: '$$color',
    borderColor: '$$color',
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
