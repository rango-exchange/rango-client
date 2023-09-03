import * as Collapsible from '@radix-ui/react-collapsible';

import { styled } from '../../theme';
import { CollapsibleContent } from '../common/styles';

export const RouteContainer = styled(Collapsible.Root, {
  display: 'flex',
  position: 'relative',
  top: '-36px',
  flexDirection: 'column',
  alignItems: 'start',
  overflowX: 'auto',
  overflowY: 'hidden',
  alignSelf: 'stretch',
  borderRadius: '$xm',
  variants: {
    recommended: {
      true: {
        backgroundColor: '$secondary300',
        '&:hover': {
          backgroundColor: '$secondary400',
        },
      },
      false: {
        backgroundColor: '$surface400',
        '&:hover': {
          backgroundColor: '$surface500',
        },
      },
    },
  },
  '& .steps-details': {
    padding: '$10 $15',
  },
});

export const SummaryContainer = styled('div', {
  borderRadius: '$xm',
  border: '1px solid $neutral100',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'space-between',
  backgroundColor: '$surface',
  color: '$neutral900',
  cursor: 'pointer',
  boxSizing: 'border-box',
  padding: '$15 $15 $46  $15',
  variants: {
    recommended: {
      true: {
        backgroundColor: '$secondary100',
        '&:hover': {
          backgroundColor: '$secondary200',
        },
      },
      false: {
        backgroundColor: '$neutral200',
        '&:hover': {
          backgroundColor: '$surface300',
        },
      },
    },
    basic: { true: { borderTopRightRadius: '0', borderTopLeftRadius: '0' } },
  },
  '& .summary': { width: '100%' },
  '& .cost-and-time': {
    borderRadius: '$xs',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    paddingBottom: '$10',
  },
  '& .icon': {
    width: '$16',
    height: '$16',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .cost-and-time__item': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .basic-info': {
    paddingTop: '$10',
    display: 'flex',
    alignItems: 'center',
  },
});

export const Chains = styled(Collapsible.Trigger, {
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '$36',
  padding: '$10 $15',
  boxSizing: 'border-box',
  cursor: 'pointer',
  border: 'none',
  backgroundColor: 'transparent',
  variants: {
    error: {
      true: {
        [`& ${Image}`]: {
          border: '1px $warning solid',
          borderRadius: '100%',
        },
      },
      false: {
        [`& ${Image}`]: {
          border: '1px transparent solid',
          borderRadius: '100%',
        },
      },
    },
  },
  '& div:nth-child(1)': { display: 'flex' },
});

export const Content = styled(CollapsibleContent, {
  width: '100%',
});

export const IconContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$2',
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

export const Separator = styled('div', {
  height: '$12',
  marginLeft: '$10',
  marginRight: '$10',
  borderLeft: '1px solid $neutral900',
});

export const HorizontalSeparator = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  margin: '0 $15',
  borderTop: '1px solid white',
});

export const FrameIcon = styled('div', {
  width: '$16',
  height: '$16',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
});
