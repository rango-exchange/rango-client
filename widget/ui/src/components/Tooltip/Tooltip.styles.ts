import { styled } from '../../theme';
import { Typography } from '../Typography';

export const TooltipTypography = styled(Typography, {
  borderRadius: '$md',
  padding: '$5 $10',
  boxShadow: '5px 5px 10px 0px rgba(0, 0, 0, 0.10)',
  backgroundColor: '$neutral100',
});
