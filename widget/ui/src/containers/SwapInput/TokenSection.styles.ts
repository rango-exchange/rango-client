import { ChainImageContainer } from '../../components/ChainToken/ChainToken.styles.js';
import { Button } from '../../components/index.js';
import { css, darkTheme, styled } from '../../theme.js';

export const Container = styled(Button, {
  maxWidth: '180px',
  minWidth: '130px',
  flexGrow: 1,
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
});

export const chainNameStyles = css();

export const TokenSectionContainer = styled('div', {
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
});

export const skeletonStyles = css({
  width: '100%',
  padding: '$5 $0',
});

export const TitleContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
});
