import * as RadixTooltip from '@radix-ui/react-tooltip';

import { darkTheme, styled } from '../../theme';
import { Typography } from '../Typography';

export const TooltipContent = styled(RadixTooltip.Content, {
  zIndex: '999999',
});

export const TooltipTypography = styled(Typography, {
  borderRadius: '$md',
  padding: '$5 $10',
  boxShadow: '5px 5px 10px 0px rgba(0, 0, 0, 0.10)',
  backgroundColor: '$neutral200',
  [`.${darkTheme} &`]: {
    backgroundColor: '$neutral500',
  },
});

export const TriggerContent = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
