import { css, darkTheme, styled } from '@rango-dev/ui';

export const groupStyles = css();

export const SwapItemContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '$5',
});

export const Group = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$background',
  padding: '$10 $5 0 $5',
  [`& .${groupStyles}`]: {
    $$color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral700',
    },
    color: '$$color',
  },
});

export const Time = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '$2',
});

export const SwapList = styled('div', {
  gap: '$10',
  display: 'flex',
  flexDirection: 'column',
});

export const NotFoundContainer = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
