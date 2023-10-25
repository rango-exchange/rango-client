import * as Collapsible from '@radix-ui/react-collapsible';

import { darkTheme, styled } from '../../theme';
import { Image } from '../common';
import { CollapsibleContent } from '../common/styles';

export const EXPANDABLE_ROUTES_TRANSITION_DURATION = 300;

export const RouteContainer = styled(Collapsible.Root, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  overflowX: 'auto',
  overflowY: 'hidden',
  width: '100%',
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
        $$color: '$colors$neutral400',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral200',
        },
        backgroundColor: '$$color',
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
  position: 'relative',
  variants: {
    recommended: {
      true: {
        $$color: '$colors$info100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$secondary600',
        },
        backgroundColor: '$$color',
        '&:hover': {
          backgroundColor: '$$color',
        },
      },
      false: {
        $$color: '$colors$neutral200',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral500',
        },
        backgroundColor: '$$color',
        '&:hover': {
          backgroundColor: '$$color',
        },
      },
    },
    basic: { true: { borderTopRightRadius: '0', borderTopLeftRadius: '0' } },
    listItem: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      listItem: true,
      recommended: true,
      css: {
        '&:hover': {
          $$color: '$colors$secondary200',
          [`.${darkTheme} &`]: {
            $$color: '$colors$secondary700',
          },
          backgroundColor: '$$color',
        },
      },
    },
    {
      listItem: true,
      recommended: false,
      css: {
        '&:hover': {
          $$color: '$colors$neutral300',
          [`.${darkTheme} &`]: {
            $$color: '$colors$neutral400',
          },
          backgroundColor: '$$color',
        },
      },
    },
  ],
  '& .summary': {
    width: '100%',
    padding: '$15 $15 $10 $15',
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
        $$color: '$colors$neutral400',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral200',
        },
        backgroundColor: '$$color',
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
  transition: `all ${EXPANDABLE_ROUTES_TRANSITION_DURATION}ms ease`,
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
  borderTop: '1px solid',
  $$color: '$colors$neutral300',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral400',
  },
  borderColor: '$$color',
});

export const FrameIcon = styled('div', {
  width: '$16',
  height: '$16',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
});
