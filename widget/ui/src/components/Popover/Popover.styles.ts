import * as RadixPopover from '@radix-ui/react-popover';

import { styled } from '../../theme';

export const PopoverContainer = styled(RadixPopover.Content, {
  borderRadius: '$sm',
  filter: 'drop-shadow(0px 5px 20px rgba(130, 130, 130, 0.20))',
  backgroundColor: '$neutral100',
});

export const PopoverArrow = styled(RadixPopover.Arrow, {
  fill: '$neutral100',
  width: '$16',
  height: '$8',
});
