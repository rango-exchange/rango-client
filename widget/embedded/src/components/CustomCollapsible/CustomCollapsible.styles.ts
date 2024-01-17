import * as Collapsible from '@radix-ui/react-collapsible';
import { keyframes, styled } from '@rango-dev/ui';

export const EXPANDABLE_TRANSITION_DURATION = 300;

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

export const CollapsibleRoot = styled(Collapsible.Root, {
  borderRadius: '$sm',
  variants: {
    selected: {
      true: {
        outlineWidth: 1,
        outlineColor: '$secondary500',
        outlineStyle: 'solid',
      },
    },
  },
});

export const Trigger = styled(Collapsible.Trigger, {
  padding: '$0',
  border: 'none',
  outline: 'none',
  width: '100%',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  cursor: 'pointer',
});

export const CollapsibleContent = styled(Collapsible.Content, {
  overflow: 'hidden',
  variants: {
    open: {
      true: {
        animation: `${slideDown} ${EXPANDABLE_TRANSITION_DURATION}ms ease-out`,
      },
      false: {
        animation: `${slideUp} ${EXPANDABLE_TRANSITION_DURATION}ms ease-out`,
      },
    },
  },
});

export const ExpandedIcon = styled('div', {
  transition: `all ${EXPANDABLE_TRANSITION_DURATION}ms ease`,
  display: 'flex',
  alignItems: 'center',
  variants: {
    orientation: {
      down: {
        transform: 'rotate(0)',
      },
      up: {
        transform: 'rotate(180deg)',
      },
    },
  },
});
