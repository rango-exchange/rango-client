import { styled } from '../../theme';

export const Button = styled('button', {
  padding: '$10 $5',
  borderRadius: '$xs',
  display: 'flex',
  border: '0',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'unset',
  '&:hover': {
    backgroundColor: '$surface600',
    opacity: 60,
  },
});
export const TitleSection = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginLeft: '$6',
});
export const Div = styled('div', {
  display: 'flex',
  alignItems: 'center',
});

export const Tag = styled('div', {
  marginLeft: '$5',
  backgroundColor: '$secondary300',
  paddingLeft: '$4',
  paddingRight: '$4',
  borderRadius: '$md',
});
