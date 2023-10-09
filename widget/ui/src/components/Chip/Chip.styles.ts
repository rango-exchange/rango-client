import { darkTheme, styled } from '../../theme';

export const ChipContainer = styled('button', {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '$xs',
  padding: '$5 $15',
  cursor: 'pointer',
  transition: 'all 0.35s',
  backgroundColor: '$neutral100',
  border: '1px solid transparent',

  '&:hover': {
    $$color: '$colors$info100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral400',
    },
    backgroundColor: '$$color',
  },

  '&:focus': {
    outline: '1px solid gray',
  },

  variants: {
    selected: {
      true: { border: '1px solid $secondary500' },
    },
  },
});
