import { Button, darkTheme, ListItemButton, styled } from '@rango-dev/ui';

export const Container = styled('div', {
  padding: '$10',
  width: '350px',
  maxWidth: '90vw',
  minHeight: '150px',
});

export const Header = styled('div', {
  padding: '0 $10',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const ClearAllButton = styled(Button, {
  padding: '$5 !important',
});

export const List = styled('ul', {
  padding: 0,
  margin: 0,
  listStyle: 'none',

  '.to-chain-token': {
    transform: 'translateX(-3px)',
  },
});

export const ListItem = styled(ListItemButton, {
  variants: {
    actionRequired: {
      true: {
        backgroundColor: '$error300',
        [`.${darkTheme} &`]: {
          backgroundColor: '$error600',
        },
      },
    },
  },
});

export const Images = styled('div', {
  display: 'flex',
  padding: '0 0 0 $5',
  alignItems: 'center',
  alignSelf: 'stretch',
});

export const NotFoundContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '$10',
  width: '100%',
  height: '150px',
});

export const IconContainer = styled('span', {
  paddingRight: '$8',
});
