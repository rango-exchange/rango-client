import { darkTheme, styled, TextField } from '@arlert-dev/ui';

export const Container = styled('div', {
  padding: '$10 $0',
  '& .button__content': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .alarms': { paddingTop: '$5' },
  '& .collapsible_content': {
    backgroundColor: '$neutral100',
  },
  '& .collapsible_root': {
    backgroundColor: '$neutral100',
  },
});

export const StyledTextField = styled(TextField, {
  backgroundColor: '$neutral100',
  padding: '$15',
});

export const CustomDestinationButton = styled('div', {
  width: '100%',
  borderRadius: '$sm',
  display: 'flex',
  padding: '$15',
  justifyContent: 'space-between',
  alignItems: 'center',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  borderBottomRightRadius: '0',
  borderBottomLeftRadius: '0',
  '&:focus-visible': {
    $$background: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$background: '$colors$info700',
    },
    backgroundColor: '$$background',
    outline: 0,
  },
});
