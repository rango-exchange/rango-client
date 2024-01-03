import * as Collapsible from '@radix-ui/react-collapsible';
import {
  Button,
  css,
  darkTheme,
  IconButton,
  keyframes,
  styled,
  TextField,
} from '@yeager-dev/ui';

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

export const Title = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ListContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  gap: '$10',
  flexWrap: 'wrap',
  paddingTop: '$5',
  height: '100%',
});

export const WalletButton = styled('button', {
  borderRadius: '$xm',
  padding: '$10',
  border: '0',
  display: 'flex',
  justifyContent: 'center',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  alignItems: 'center',
  cursor: 'pointer',
  width: 110,
  position: 'relative',

  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },

  '&:focus-visible': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$info700',
    },
    backgroundColor: '$$color',
    outline: 0,
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

export const ShowMoreWallets = styled(WalletButton, {
  alignSelf: 'stretch',
  minHeight: '93px',
});

export const Trigger = styled(Collapsible.Trigger, {
  padding: '$0',
  border: 'none',
  outline: 'none',
  width: '100%',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
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
  paddingTop: '$20',
});

export const walletsListStyles = css({
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  gap: '$10',
  flexWrap: 'wrap',
  paddingTop: '$5',
  height: '100%',
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
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',

  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },
  '&:focus-visible': {
    $$background: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$background: '$colors$info700',
    },
    backgroundColor: '$$background',
    outline: 0,
  },
});

export const CustomDestination = styled('div', {
  padding: '$10 $0',
  '& .button__content': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .alarms': { paddingTop: '5px' },
});

export const alarmsStyles = css({
  paddingTop: '5px',
});

export const ExpandedIcon = styled('div', {
  transition: `all ${EXPANDABLE_TRANSITION_DURATION}ms ease`,
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
  backgroundColor: '$neutral100',
  padding: '$0 $15 $15 $15',
});

export const CollapsibleContent = styled(Collapsible.Content, {
  backgroundColor: '$neutral100',
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

export const Wallets = styled('div', { overflow: 'visible', width: '100%' });
