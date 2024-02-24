import * as Select from '@radix-ui/react-select';

import { darkTheme, styled } from '../../theme';

export const EXPANDABLE_QUOTE_TRANSITION_DURATION = 300;

export const SelectTrigger = styled(Select.Trigger, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '$5 $10',
  border: 0,
  outline: 0,
  whiteSpace: 'nowrap',
  borderRadius: '$sm',
  backgroundColor: '$neutral300',
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral400',
  },
  width: '100%',
  '&:hover': {
    backgroundColor: '$info100',
    [`.${darkTheme} &`]: {
      backgroundColor: '$neutral',
    },
  },
  '& svg': {
    transition: `all ${EXPANDABLE_QUOTE_TRANSITION_DURATION}ms ease`,
  },
  '& ._typography': {
    whiteSpace: 'nowrap',
  },
  variants: {
    open: {
      true: {
        '& svg': {
          transform: 'rotate(180deg)',
        },
      },
      false: {
        '& svg': {
          transform: 'rotate(0)',
        },
      },
    },
  },
});

export const SelectContent = styled(Select.Content, {
  width: 'var(--radix-select-trigger-width)',
  maxHeight: 'var(--radix-select-content-available-height)',
  overflowY: 'auto',
  borderRadius: '$sm',
  boxShadow: '-5px 5px 10px 0px rgba(86, 86, 86, 0.10)',
  backgroundColor: '$background',
});

export const SelectItem = styled(Select.Item, {
  padding: '$10',
  listStyleType: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  '&:focus': {
    outline: 'none',
  },

  '&:hover': {
    backgroundColor: '$info100',
    [`.${darkTheme} &`]: {
      backgroundColor: '$neutral',
    },
  },
});
