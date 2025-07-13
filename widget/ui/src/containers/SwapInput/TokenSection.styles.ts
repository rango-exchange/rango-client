import { ChainImageContainer } from '../../components/ChainToken/ChainToken.styles.js';
import {
  Button,
  type TooltipPropTypes,
  Typography,
} from '../../components/index.js';
import { css, darkTheme, styled } from '../../theme.js';

export const Container = styled(Button, {
  width: '100%',
  maxWidth: '180px',
  minWidth: '130px',
  backgroundColor: 'transparent',
  borderRadius: '$xs',

  color: '$neutral700',
  '&:disabled': {
    color: '$neutral600',
  },
  '&:focus-visible': {
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$info700',
    },
    backgroundColor: '$$color !important',
    outline: 0,
  },
  '&:disabled:hover': {
    backgroundColor: 'transparent',
  },
  '&:hover': {
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color !important',

    [`& ${ChainImageContainer}`]: {
      $$color: '$colors$secondary100',
      [`.${darkTheme} &`]: {
        $$color: '$colors$neutral100',
      },
      backgroundColor: '$$color !important',
    },
  },

  '& > span': {
    width: '100%',
  },
});

export const chainNameStyles = css();

export const TokenSectionContainer = styled('div', {
  width: '100%',
  maxWidth: '170px',
  padding: '$2 $5',
  display: 'flex',
  borderRadius: '$xs',
  justifyContent: 'start',
  boxSizing: 'border-box',
  alignItems: 'center',
  [`& .${chainNameStyles}`]: {
    $$color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral700',
    },
    color: '$$color',
  },
});

export const tokenChainStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'start',
  paddingLeft: '$10',
  flexGrow: 1,
  textAlign: 'left',
  width: '100%',
  overflow: 'hidden',
});

export const skeletonStyles = css({
  width: '100%',
  padding: '$5 $0',
});

export const TitleContainer = styled('div', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
});

export const Title = styled(Typography, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  letterSpacing: '1px',
});

export const SymbolTooltipStyles: TooltipPropTypes['styles'] = {
  content: {
    padding: '$10',
  },
  root: {
    zIndex: 10,
    maxWidth: 'calc(100% - 18px)',
    display: 'flex',
    justifyContent: 'start',
  },
};

export const SymbolTooltipContent = styled(Typography, {
  maxWidth: 217,
  lineBreak: 'anywhere',
});

export const BlockChainTypography = styled(Typography, {
  maxWidth: 96,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  letterSpacing: 0.25,
  whiteSpace: 'nowrap',
});
