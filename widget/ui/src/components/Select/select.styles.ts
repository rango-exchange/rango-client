import * as Select from '@radix-ui/react-select';

import { darkTheme, styled } from '../../theme';

export const EXPANDABLE_QUOTE_TRANSITION_DURATION = 300;

export const SelectTrigger = styled(Select.Trigger, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: '$secondary',
  padding: '$5 $10',
  border: 0,
  whiteSpace: 'nowrap',

  '& svg': {
    transition: `all ${EXPANDABLE_QUOTE_TRANSITION_DURATION}ms ease`,
  },

  variants: {
    open: {
      true: {
        borderTopLeftRadius: '$sm',
        borderTopRightRadius: '$sm',
        '& ._typography, & svg': {
          color: '$secondary',
        },

        '& svg': {
          transform: 'rotate(180deg)',
        },
        backgroundColor: '$neutral100',
        [`.${darkTheme} &`]: {
          backgroundColor: '$neutral300',
        },
      },
      false: {
        borderRadius: '$md',
        '& ._typography, & svg': {
          color: '$background',
          [`.${darkTheme} &`]: {
            color: '$foreground',
          },
        },
        '& svg': {
          transform: 'rotate(0)',
        },
      },
    },
  },
  width: '100%',
  '& ._typography': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '52px',
    '@xs': {
      width: 'auto',
    },
  },
});

export const SelectContent = styled(Select.Content, {
  padding: '$5 $10',
  width: '100%',
  position: 'absolute',
  top: '38px',
  maxHeight: '146px',
  overflowY: 'auto',
  borderBottomLeftRadius: '$sm',
  borderBottomRightRadius: '$sm',
  boxShadow: '-5px 5px 10px 0px rgba(86, 86, 86, 0.10)',
  backgroundColor: '$neutral100',
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral300',
  },
});

export const SelectItem = styled(Select.Item, {
  padding: '$10 0',
  borderTop: '1px solid',
  borderColor: '$neutral300',
  [`.${darkTheme} &`]: {
    borderColor: '$neutral400',
  },
  listStyleType: 'none',
  cursor: 'pointer',
  '&:hover': {
    '& ._typography': {
      color: '$colors$secondary',
    },
  },
  '&:focus': {
    outline: 'none',
    '& ._typography': {
      color: '$colors$secondary',
    },
  },
});
