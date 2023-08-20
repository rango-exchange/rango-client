import * as RadioGroup from '@radix-ui/react-radio-group';

import { styled } from '../../theme';

export const RadioRoot = styled(RadioGroup.Root, {
  variants: {
    direction: {
      horizontal: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      vertical: {
        display: 'grid',
        gridGap: '$24',
      },
    },
  },
});

export const ItemContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginRight: '$8',
});

export const Container = styled('div', {
  display: 'flex',
});

export const Label = styled('label', {
  paddingLeft: '$8',
  cursor: 'pointer',
  color: '$foreground',
  '& > span': {
    display: 'block',
  },
});
