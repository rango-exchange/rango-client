import * as Collapsible from '@radix-ui/react-collapsible';

import { darkTheme, styled } from '../../theme.js';

export const Trigger = styled(Collapsible.Trigger, {
  padding: '$15',
  paddingBottom: '$5',
  borderRadius: '$xm',
  cursor: 'pointer',
  $$backgroundColor: '$colors$neutral200',
  [`.${darkTheme} &`]: {
    $$backgroundColor: '$colors$neutral500',
  },
  backgroundColor: '$$backgroundColor',
  textAlign: 'center',
  border: 0,
  width: '100%',
  '&:hover': {
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },
  '&:focus-visible': {
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$info700',
    },
    backgroundColor: '$$color',
    outline: 0,
  },
});
