import * as RadixPopover from '@radix-ui/react-popover';

import { darkTheme, styled } from '../../theme.js';

export const PopoverContainer = styled(RadixPopover.Content, {
  borderRadius: '$sm',
  filter: 'drop-shadow(0px 5px 20px rgba(130, 130, 130, 0.20))',
  backgroundColor: '$neutral100',
  zIndex: 10,
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral300',
  },
});

export const PopoverArrow = styled(RadixPopover.Arrow, {
  fill: '$neutral100',
  [`.${darkTheme} &`]: {
    fill: '$neutral300',
  },
  width: '$16',
  height: '$8',
});
