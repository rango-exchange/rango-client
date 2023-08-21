import * as Collapsible from '@radix-ui/react-collapsible';

import { keyframes, styled } from '../../theme';

export const Trigger = styled(Collapsible.Trigger, {
  padding: '$15',
  paddingBottom: '$5',
  borderRadius: '$xm',
  cursor: 'pointer',
  backgroundColor: '$neutral200',
  textAlign: 'center',
  border: 0,
  width: '100%',
  '&:hover': {
    backgroundColor: '$surface600',
  },
});

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

export const Content = styled(Collapsible.Content, {
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
