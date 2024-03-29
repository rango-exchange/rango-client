import { css, darkTheme, styled } from '../../theme';
import { PriceImpact } from '../PriceImpact';

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
          $$color: '$colors$secondary400',
        },
        borderColor: '$$color',
      },
      false: {
        borderColor: 'transparent',
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
  padding: '$2',
  display: 'flex',
  width: '100%',
});

export const LeftSection = styled(FlexCenter, {
  minWidth: '42px',
  position: 'relative',
});

export const RightSection = styled('div', {
  width: '100%',
  height: '50%',
  borderBottom: '1px dashed',
  borderColor: '$info300',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: '2px',
  [`.${darkTheme} &`]: {
    borderColor: '$secondary600',
  },
});

export const FromToken = styled(FlexCenter, {
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
  borderColor: '$info300',
  [`.${darkTheme} &`]: {
    borderColor: '$secondary600',
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
    top: '50%',
    right: '-3px',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    width: '$6',
    height: '$6',
    borderTop: '2px solid',
    borderRight: '2px solid',
    borderColor: '$info300',
    [`.${darkTheme} &`]: {
      borderColor: '$secondary600',
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
