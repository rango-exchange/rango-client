import * as Collapsible from '@radix-ui/react-collapsible';
import {
  Button,
  css,
  darkTheme,
  Image,
  styled,
  Typography,
} from '@rango-dev/ui';

import { CollapsibleContent } from '../CustomCollapsible/CustomCollapsible.styles';

export const EXPANDABLE_QUOTE_TRANSITION_DURATION = 300;

export const QuoteContainer = styled(Collapsible.Root, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  overflowX: 'auto',
  overflowY: 'hidden',
  width: '100%',
  borderRadius: '$xm',
  variants: {
    selected: {
      true: {},
      false: {
        $$color: '$colors$neutral400',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral200',
        },
        backgroundColor: '$$color',
      },
    },
    listItem: {
      true: {
        $$color: '$colors$neutral400',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral200',
        },
        backgroundColor: '$$color',
      },
      false: {},
    },
  },

  compoundVariants: [
    {
      listItem: false,
      selected: true,
      css: {
        $$color: '$colors$info300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$secondary800',
        },
        backgroundColor: '$$color',
      },
    },
    {
      listItem: true,
      selected: false,
      css: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$neutral300',
          [`.${darkTheme} &`]: {
            backgroundColor: '$neutral400',
          },
        },
      },
    },
  ],
});

export const stepsDetailsStyles = css({
  padding: '$10 $15',
});
export const AllRoutesButton = styled(Button, {
  backgroundColor: 'transparent',
  border: '1px solid $secondary',
});
export const SummaryContainer = styled('div', {
  borderRadius: '$xm',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'space-between',
  color: '$foreground',
  boxSizing: 'border-box',
  position: 'relative',
  variants: {
    selected: {
      true: {},
      false: {
        $$color: '$colors$neutral200',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral500',
        },
        backgroundColor: '$$color',
      },
    },
    basic: { true: { borderTopRightRadius: '0', borderTopLeftRadius: '0' } },
    listItem: {
      true: {
        $$color: '$colors$neutral200',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral500',
        },
        backgroundColor: '$$color',
        '&:hover': {
          backgroundColor: '$neutral300',
          [`.${darkTheme} &`]: {
            backgroundColor: '$neutral400',
          },
        },
        cursor: 'pointer',
      },
      false: {},
    },
  },

  compoundVariants: [
    {
      listItem: true,
      selected: true,
      css: {
        border: '1px solid $secondary',
      },
    },
    {
      listItem: false,
      selected: true,
      css: {
        $$color: '$colors$info100',
        [`.${darkTheme} &`]: {
          $$color: '$colors$secondary600',
        },
        backgroundColor: '$$color',
        '&:hover': {
          backgroundColor: '$$color',
        },
      },
    },
    {
      listItem: true,
      selected: false,
      css: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '$neutral300',
          [`.${darkTheme} &`]: {
            backgroundColor: '$neutral400',
          },
        },
      },
    },
  ],
});

export const summaryStyles = css({
  width: '100%',
  padding: '$15 $15 $10 $15',
});

export const summaryHeaderStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '$10',
  position: 'relative',
});

export const rowStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  '.blockchainImage': {
    marginLeft: '-$8',
  },
});
export const basicInfoStyles = css({
  display: 'flex',
  alignItems: 'center',
  '.usd-value': {
    $$color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral700',
    },
    color: '$$color',
  },
});

export const Trigger = styled(Collapsible.Trigger, {
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
    selected: {
      true: {},
      false: {
        $$color: '$colors$neutral400',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral200',
        },
        backgroundColor: '$$color',
      },
    },
    listItem: {
      true: {
        $$color: '$colors$neutral400',
        [`.${darkTheme} &`]: {
          $$color: '$colors$neutral200',
        },
        backgroundColor: '$$color',
      },
      false: {},
    },
  },

  compoundVariants: [
    {
      listItem: false,
      selected: true,
      css: {
        $$color: '$colors$info300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$secondary800',
        },
        backgroundColor: '$$color',
      },
    },
  ],
  '.blockchains_section': {
    display: 'none',
  },
  '@xs': {
    '.blockchains_section': {
      display: 'block',
    },
  },
});

export const ImageContainer = styled('div', {
  width: '18px',
  height: '18px',
  borderRadius: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1.5px transparent solid',
  img: {
    borderRadius: '100%',
  },
  variants: {
    state: {
      error: {
        borderColor: '$error500',
      },
      warning: { borderColor: '$warning500' },
    },
  },
});

export const Content = styled(CollapsibleContent, {
  width: '100%',
  background: 'inherit',
});

export const IconContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$2',
  transition: `all ${EXPANDABLE_QUOTE_TRANSITION_DURATION}ms ease`,
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

export const BasicInfoOutput = styled(Typography, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  letterSpacing: 0.4,
});

export const ContainerInfoOutput = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
});

export const MoreStep = styled('div', {
  width: '18px',
  height: '18px',
  borderRadius: '100%',
  backgroundColor: '$background',
  cursor: 'default',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1.5px transparent solid',
  variants: {
    state: {
      error: {
        borderColor: '$error500',
      },
      warning: { borderColor: '$warning500' },
    },
  },
});

export const TagContainer = styled('div', {
  display: 'flex',
});

export const Line = styled('div', {
  width: '100%',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: '$neutral',
  margin: '$5 0',
  [`.${darkTheme} &`]: {
    borderTopColor: '$neutral400',
  },
});
