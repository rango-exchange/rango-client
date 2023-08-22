import * as Collapsible from '@radix-ui/react-collapsible';

import { keyframes, styled } from '../../theme';

const slideDown = keyframes({
  from: {
    height: 0,
  },
  to: {
    height: 'var(--radix-collapsible-content-height)',
  },
});

const slideUp = keyframes({
  from: {
    height: 'var(--radix-collapsible-content-height)',
  },
  to: {
    height: 0,
  },
});

export const CollapsibleContent = styled(Collapsible.Content, {
  overflow: 'hidden',
  variants: {
    open: {
      true: {
        animation: `${slideDown} 300ms ease-out`,
      },
      false: {
        animation: `${slideUp} 300ms ease-out`,
      },
    },
  },
});
