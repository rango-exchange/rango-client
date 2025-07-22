import { darkTheme, styled } from '@arlert-dev/ui';

export const Container = styled('div', {
  position: 'relative',
});

export const TooltipContainer = styled('div', {
  width: 165,
  borderRadius: '$sm',
  backgroundColor: '$background',

  $$color: '$colors$neutral500',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral100',
  },

  boxShadow: '0px 5px 20px 0px $$color',
});

export const TooltipInfoRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  fontSize: '$12',
  justifyContent: 'space-between',
  padding: '$8 $10',
  fontWeight: '$medium',
  color: '$foreground',
});

export const Line = styled('div', {
  height: 1,
  width: '100%',
  backgroundColor: '$neutral300',
});

export const InfoContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '$10',
  padding: '$5 $10',
  color: '$foreground',
});

export const Circle = styled('div', {
  width: '$6',
  height: '$6',
  borderRadius: 3,
});

export const NameWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
});
