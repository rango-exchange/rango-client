import * as RadioGroup from '@radix-ui/react-radio-group';
import { styled } from '../../theme';

export const StyledRoot = styled(RadioGroup.Root, {
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
export const StyledItem = styled(RadioGroup.Item, {
  padding: '0',
  width: '16px',
  height: '16px',
  borderRadius: '100%',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: '1px solid $neutral400',

  '&:hover': {
    borderColor: '$primary',
  },
  '&[data-state="checked"]': {
    backgroundColor: '$primary',
  },
});

export const Container = styled('div', {
  display: 'flex',
});

export const StyledIndicator = styled(RadioGroup.Indicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
  '&::after': {
    content: '',
    display: 'block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '$neutral100',
  },
});

export const Label = styled('label', {
  paddingLeft: '$8',
  cursor: 'pointer',
  color: '$foreground',
  '& > span': {
    display: 'block',
  },
});
