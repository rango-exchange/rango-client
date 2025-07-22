import { Button, darkTheme, styled } from '@arlert-dev/ui';

export const Alerts = styled('div', {
  width: '100%',
});

export const Flex = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$5',
  width: '100%',
});

export const Item = styled('div', {
  display: 'flex',
  padding: '$5 0',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  '._title': {
    $$color: '$colors$neutral600',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral700',
    },
    color: '$$color',
  },
});

export const Action = styled('div', {
  padding: '$2',
  alignSelf: 'flex-start',
  cursor: 'pointer',
});

export const SwapButton = styled(Button, {
  '& ._text': {
    gap: '$5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
