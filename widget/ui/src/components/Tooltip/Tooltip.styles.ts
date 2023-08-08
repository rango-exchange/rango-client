import { Typography } from '../Typography';
import { styled } from '../../theme';
export const TooltipTypography = styled(Typography, {
  borderRadius: '$md',
  padding: '$5 $10',
  boxShadow: '5px 5px 10px 0px rgba(0, 0, 0, 0.10)',
  backgroundColor: '$surface100',
});
