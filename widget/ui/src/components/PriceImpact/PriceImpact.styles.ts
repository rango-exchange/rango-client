import { styled } from '../../theme';
import { Typography } from '../Typography';

export const Container = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
});

export const OutputUsdValue = styled(Typography, {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
