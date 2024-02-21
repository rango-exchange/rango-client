import { css, darkTheme, styled } from '../../theme';
import { PriceImpact } from '../PriceImpact';

export const tokenLabelStyles = css({});

const FlexCenter = styled('div', {
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
});

export const TagsContainer = styled('div', {
  display: 'flex',
  gap: '$5',
});

export const Steps = styled('div', {
  display: 'flex',
  height: '85px',
  padding: '$2',
});

export const Step = styled('div', {
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
  width: '$18',
  height: '$18',
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
  width: '$8',
  height: '$8',
  bottom: -2,
  right: -2,
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
  paddingLeft: '$4',
});

export const VerticalLine = styled('div', {
  display: 'flex',
  width: '50%',
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
    right: '0',
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
