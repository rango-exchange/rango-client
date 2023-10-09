import { styled } from '../../theme';

export const Container = styled('div', {
  borderRadius: '$xs',
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  paddingBottom: '$10',
  '& .item': {
    display: 'flex',
    alignItems: 'center',
  },
  '& .icon': {
    width: '$16',
    height: '$16',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
