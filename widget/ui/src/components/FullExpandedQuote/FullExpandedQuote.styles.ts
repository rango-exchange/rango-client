import { css, darkTheme, styled } from '../../theme.js';
import { PriceImpact } from '../PriceImpact/index.js';
import { Typography } from '../Typography/Typography.js';

export const tokenLabelStyles = css({});

export const FlexCenter = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
export const RouteContainer = styled('div', {
  border: '1px solid',
  padding: '$20 $15',
  backgroundColor: '$neutral200',
  borderRadius: '$xm',
  cursor: 'pointer',
  gap: '$20',
  display: 'flex',
  flexDirection: 'column',
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral500',
  },
  '&:hover': {
    backgroundColor: '$neutral300',
    [`.${darkTheme} &`]: {
      backgroundColor: '$neutral400',
    },
  },
  variants: {
    selected: {
      true: {
        $$color: '$colors$secondary500',
        [`.${darkTheme} &`]: {
          $$color: '$colors$secondary250',
        },
        borderColor: '$$color',
      },
      false: {
        borderColor: 'transparent',
      },
    },
    hovered: {
      true: {
        '&:hover': {
          backgroundColor: '$neutral200',
          [`.${darkTheme} &`]: {
            backgroundColor: '$neutral500',
          },
        },
      },
    },
  },
});

export const RouteHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  variants: {
    loading: {
      true: {
        padding: '$2',
      },
    },
  },
});

export const TagsContainer = styled('div', {
  display: 'flex',
  gap: '$5',
});

export const Steps = styled('div', {
  display: 'flex',
  height: '85px',
});

export const StepItem = styled('div', {
  padding: '$10 $5 $5 0',
  height: '100px',
  display: 'flex',
  width: '100%',
  variants: {
    isHovered: {
      true: {
        backgroundColor: '$neutral400',
        boxShadow: '4px 4px 10px 0 #0000001A',
        borderRadius: '$xs',
        zIndex: 10,
      },
    },
  },
});

export const StepItemContainer = styled('div', {
  width: '100%',
  display: 'flex',
  height: '100%',
});

export const TokenSectionContainer = styled(FlexCenter, {
  minWidth: '42px',
  position: 'relative',
  variants: {
    isInternalSwap: {
      true: {
        flexDirection: 'column',
        gap: '$5',

        '& .token-info': {
          position: 'static',
          flexDirection: 'column-reverse',
        },
      },
    },
  },
});

export const SwapperSection = styled('div', {
  width: '100%',
  height: '50%',
  borderBottom: '1px dashed',
  borderColor: '$secondary200',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: '2px',
  [`.${darkTheme} &`]: {
    borderColor: '$secondary550',
  },
});

export const TokenInfo = styled(FlexCenter, {
  position: 'absolute',
  flexDirection: 'column',
  bottom: 0,
  left: 0,
  right: 0,
  [`& .${tokenLabelStyles}`]: {
    color: '$neutral700',
    [`.${darkTheme} &`]: {
      color: '$neutral900',
    },
  },
});

export const SwapperContainer = styled(FlexCenter, {
  flexDirection: 'column',
  '& ._typography': {
    color: '$neutral700',
    [`.${darkTheme} &`]: {
      color: '$neutral900',
    },
  },
});

export const SwapperContent = styled(FlexCenter, {
  flexDirection: 'column',
  width: 'fit-content',
});

export const SwapperImagesContainer = styled(FlexCenter, {
  position: 'relative',
});

export const SwapperImage = styled(FlexCenter, {
  borderRadius: '$lg',
  position: 'relative',
  width: '$24',
  height: '$24',
  border: '1px solid transparent',
  variants: {
    state: {
      warning: {
        borderColor: '$warning500',
      },
      error: {
        borderColor: '$error500',
      },
    },
  },
});

export const IconHighlight = styled(FlexCenter, {
  borderRadius: '$lg',
  position: 'absolute',
  width: '$10',
  height: '$10',
  bottom: -3,
  right: -3,
  variants: {
    type: {
      warning: {
        $$color: '$colors$warning300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$warning600',
        },
        backgroundColor: '$$color',
      },
      error: {
        $$color: '$colors$error300',
        [`.${darkTheme} &`]: {
          $$color: '$colors$error600',
        },
        backgroundColor: '$$color',
      },
    },
  },
});

export const OutputSection = styled(FlexCenter, {
  flexDirection: 'column',
  paddingLeft: '$8',
});

export const VerticalLine = styled('div', {
  display: 'flex',
  width: 'calc(50% + 1px)',
  borderRight: '1px dashed',
  height: '$10',
  borderColor: '$secondary200',
  [`.${darkTheme} &`]: {
    borderColor: '$secondary550',
  },
});

export const StyledPriceImpact = styled(PriceImpact, {
  justifyContent: 'center',
  gap: '$4',
});

export const lastStepStyle = css({
  position: 'relative',
  '&::after': {
    content: '',
    position: 'absolute',
    bottom: '-6px',
    right: '-3px',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    width: '$6',
    height: '$6',
    borderTop: '2px solid',
    borderRight: '2px solid',
    borderColor: '$secondary200',
    [`.${darkTheme} &`]: {
      borderColor: '$secondary550',
    },
  },
});

// Styles for the skeleton

export const Separator = styled('div', {
  height: '$12',
  marginLeft: '$10',
  marginRight: '$10',
  borderLeft: '1px solid $neutral700',
});

export const OutputLoading = styled(FlexCenter, {
  padding: '$10 $2 0',
  height: '85px',
  gap: '$10',
  flexDirection: 'column',
});

export const SkeletonItemLeftContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  paddingTop: '$25',
});

// Styles for the tooltip

export const TooltipContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: '$10',
});

export const TooltipHeader = styled('div', {
  width: '100%',
  variants: {
    hasFooter: {
      true: {
        paddingBottom: '$5',
        borderBottom: '1px solid',
        borderColor: '$neutral500',
        [`.${darkTheme} &`]: {
          borderColor: '$neutral800',
        },
      },
    },
  },
});

export const TooltipFooter = styled(FlexCenter, {
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '$10',
});

export const Icon = styled('div', {
  paddingBottom: '$20',
});

export const OutputPriceValue = styled(Typography, {
  letterSpacing: 0.15,
  maxWidth: '65px',
});

export const AmountText = styled(Typography, {
  maxWidth: '34px',
});
