import { styled, theme } from '../../theme';

export const TokenSectionContainer = styled('div', {
  width: '10.625rem',
  padding: '$2 $5',
  display: 'flex',
  borderRadius: '$xs',
  justifyContent: 'start',
  boxSizing: 'border-box',
  alignItems: 'center',
  '&:hover': {
    //#rrggbbaa format
    backgroundColor: `${theme.colors.secondary300}80`,
  },
  '& .token-chain-name': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    paddingLeft: '$10',
  },
});
