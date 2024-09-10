import { darkTheme, styled } from '../../theme.js';
import { ImageContainer } from '../common/index.js';

export const Chip = styled('button', {
  padding: '$10',
  borderRadius: '$sm',
  width: '100%',
  $$color: '$colors$neutral100',
  [`.${darkTheme} &`]: {
    $$color: '$colors$neutral300',
  },
  backgroundColor: '$$color',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  border: 0,
  fontFamily: 'inherit',
  [`& ${ImageContainer}`]: {
    borderRadius: '$xm',
    overflow: 'hidden',
  },
  '&:hover': {
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$neutral100',
    },
    backgroundColor: '$$color',
  },
  '&:focus-visible': {
    outline: 0,
    $$color: '$colors$secondary100',
    [`.${darkTheme} &`]: {
      $$color: '$colors$info700',
    },
    backgroundColor: '$$color',
  },
  variants: {
    selected: {
      true: { outline: '1px solid $secondary500' },
      false: { outline: 0 },
    },
  },
});
