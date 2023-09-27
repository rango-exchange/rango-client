import * as Collapsible from '@radix-ui/react-collapsible';

import { darkTheme, styled } from '../../theme';
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
        $$color: '$colors$info300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$secondary800',
        },
        backgroundColor: '$$color',
      },
      false: {
        backgroundColor: '$neutral200',
      },
    },
  },
  '& .steps-details': {
    padding: '$10 $15',
  },
});

export const SummaryContainer = styled('div', {
  borderRadius: '$xm',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'space-between',
  color: '$foreground',
  cursor: 'pointer',
  boxSizing: 'border-box',
  padding: '$15 $15 $46  $15',
  variants: {
    recommended: {
      true: {
        $$color: '$colors$info100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral400',
        },
        backgroundColor: '$$color',
        '&:hover': {
          $$color: '$colors$secondary200',
          [`.${darkTheme} &`]: {
            $$color: '$colors$secondary700',
          },
          backgroundColor: '$$color',
        },
      },
      false: {
        backgroundColor: '$neutral200',
        '&:hover': {
          backgroundColor: '$neutral200',
        },
      },
    },
    basic: { true: { borderTopRightRadius: '0', borderTopLeftRadius: '0' } },
  },
  '& .summary': { width: '100%' },
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
  outline: 'none',
  backgroundColor: 'transparent',
  variants: {
    error: {
      true: {
        [`& ${Image}`]: {
          border: '1px $warning500 solid',
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
    recommended: {
      true: {
        $$color: '$colors$info300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$secondary800',
        },
        backgroundColor: '$$color',
      },
      false: {
        backgroundColor: '$neutral400',
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
  borderLeft: '1px solid $foreground',
});

export const HorizontalSeparator = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  margin: '0 $15',
  borderTop: '1px solid $neutral300',
});

export const FrameIcon = styled('div', {
  width: '$16',
  height: '$16',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
});
