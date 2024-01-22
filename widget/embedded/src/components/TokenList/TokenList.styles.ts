import {
  css,
  darkTheme,
  ImageContainer,
  styled,
  Typography,
} from '@rango-dev/ui';

export const tokenNameStyles = css({
  position: 'absolute',
  transform: 'none',
  transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: 100,
  overflow: 'hidden',
});
export const descriptionStyles = css({
  position: 'relative',
  height: 12,
  width: '30%',
  maxWidth: '150px',
});
export const tokenTitleStyles = css({
  position: 'absolute',
  transform: 'none',
  transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
  bottom: '-8px',
});
export const tokenAddressStyles = css({
  transform: 'translateY(12px)',
  visibility: 'hidden',
  '& a': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '$12',
    lineHeight: '$16',
    $$color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral700',
    },
    color: '$$color',
    textDecoration: 'none',
  },
});
export const tokenWithoutNameStyles = css({});
export const usdValueStyles = css();

export const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'hidden',
});

export const Title = styled('div', {
  display: 'flex',
  alignItems: 'center',
  '._typography': {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 100,
    overflow: 'hidden',
  },
});
export const List = styled('ul', {
  flexGrow: 1,
  padding: 0,
  margin: 0,
  listStyle: 'none',

  '& li': {
    alignItems: 'none',

    '&:hover': {
      [`& .${descriptionStyles}`]: {
        [`& .${tokenAddressStyles}`]: {
          position: 'absolute',
          transform: 'none',
          transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          visibility: 'visible',
        },

        [`& .${tokenWithoutNameStyles}`]: {
          bottom: '-15px',
        },
        [`& .${tokenNameStyles}`]: {
          position: 'absolute',
          transform: 'translateY(-12px)',
          visibility: 'hidden',
        },
        [`& .${tokenTitleStyles}`]: {
          position: 'absolute',
          transform: 'translateY(-12px)',
          bottom: '-10px',
        },
      },
    },
  },
});

export const Tag = styled('div', {
  paddingLeft: '$5',
  paddingRight: '$5',
  borderRadius: '$md',
  display: 'flex',
  alignItems: 'center',
});

export const TagTitle = styled(Typography, {});

export const BalanceContainer = styled('div', {
  textAlign: 'right',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  [`& .${usdValueStyles}`]: {
    $$color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral700',
    },
    color: '$$color',
  },
});

export const End = styled('div', {
  display: 'flex',
  alignItems: 'end',
  flexDirection: 'column',
});

export const Description = styled('div', {
  display: 'flex',
  alignItems: 'center',
});
export const ImageSection = styled('div', {
  position: 'relative',
  [`& ${ImageContainer}`]: {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
});
export const Pin = styled('div', {
  position: 'absolute',
  backgroundColor: '$neutral100',
  padding: '$4',
  borderRadius: '50%',
  bottom: -6,
  right: -6,
});

export const TokenBalance = styled(Typography, {
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
