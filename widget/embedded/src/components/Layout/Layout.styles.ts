import { css, styled } from '@arlert-dev/ui';

import { WIDGET_MAX_HEIGHT, WIDGET_MIN_HEIGHT } from './Layout.constants';

export const LayoutContainer = css({
  borderRadius: '$primary',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: '$mainContainer',
});

export const Container = styled('div', {
  position: 'relative',
  width: '100vw',
  minWidth: '300px',
  maxWidth: '390px',
  backgroundColor: '$background',
  variants: {
    height: {
      auto: {
        height: 'auto',
        maxHeight: WIDGET_MAX_HEIGHT,
      },
      fixed: {
        minHeight: WIDGET_MIN_HEIGHT,
        maxHeight: WIDGET_MAX_HEIGHT,
        height: WIDGET_MAX_HEIGHT,
      },
    },
    showBanner: {
      true: {
        overflow: 'visible',
      },
    },
  },
});

export const Content = styled('div', {
  position: 'relative',
  overflow: 'hidden',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  overflowY: 'auto',
});

export const Footer = styled('div', {
  padding: '0 $20 $10',
  '& .footer__alert': {
    paddingTop: '$10',
  },
  '& .footer__logo': {
    opacity: 0,
    transition: 'opacity 1s ease-in-out',
    '&.logo__show': {
      opacity: 1,
    },
    '&.logo__hidden': {
      visibility: 'hidden',
    },
  },
});

export const BannerContainer = styled('div', {
  width: '100%',
  position: 'absolute',
  bottom: '-$10',
  transform: 'translateY(100%)',
  overflow: 'hidden',
});
