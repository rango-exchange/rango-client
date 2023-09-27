import * as Collapsible from '@radix-ui/react-collapsible';
import {
  Button,
  IconButton,
  keyframes,
  styled,
  TextField,
} from '@rango-dev/ui';

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

export const Title = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ListContainer = styled('div', {
  display: 'grid',
  gap: '$10',
  gridTemplateColumns: ' repeat(3, minmax(0, 1fr))',
  alignContent: 'baseline',
  paddingRight: '$8',
});

export const WalletButton = styled('button', {
  borderRadius: '$xm',
  padding: '$10',
  border: '0',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '$neutral200',
  alignItems: 'center',
  cursor: 'pointer',
  width: 110,
  position: 'relative',
  '&:hover': {
    backgroundColor: '$surface600',
    opacity: '0.8',
  },
  variants: {
    selected: {
      true: {
        outlineWidth: 1,
        outlineColor: '$secondary',
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
});

export const ShowMoreHeader = styled('div', {
  padding: '$20',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$neutral200',
  position: 'relative',
  width: '100%',
});

export const NavigateBack = styled(IconButton, {
  position: 'absolute',
  left: '$20',
});

export const WalletsContainer = styled('div', {
  padding: '$4 $20 $20 $20',
  '& .wallets-list': {
    display: 'grid',
    gap: '$10',
    gridTemplateColumns: ' repeat(3, minmax(0, 1fr))',
    alignContent: 'baseline',
    paddingRight: '$8',
  },
});

export const CollapsibleRoot = styled(Collapsible.Root, {
  backgroundColor: '$neutral200',
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

export const CustomDestinationButton = styled(Button, {
  width: '100%',
  borderRadius: '$sm !important',
  padding: '$15 !important',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '$neutral200 !important',
});

export const CustomDestination = styled('div', {
  padding: '$10 $0',
  '& .button__content': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .alarms': { paddingTop: '5px' },
});

export const ExpandedIcon = styled('div', {
  transition: 'all 300ms ease',
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

export const ConfirmButton = styled('div', {
  display: 'flex',
});

export const StyledTextField = styled(TextField, {
  padding: '$0 $15 $15 $15',
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
