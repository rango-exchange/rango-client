import * as RadixTooltip from '@radix-ui/react-tooltip';

import { styled } from '../../theme';
import { Typography } from '../Typography';

export const TooltipContent = styled(RadixTooltip.Content, {
  zIndex: '999999',
  variants: {
    align: {
      right: {
        position: 'absolute',
      },
    },
  },
});

export const TooltipTypography = styled(Typography, {
  borderRadius: '$md',
  padding: '$5 $10',
  boxShadow:
    'inset 0 0 0.5px 1px rgba(255, 255, 255, 0.075), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0.3px 0.4px rgba(0, 0, 0, 0.02), 0.9px 1.5px rgba(0, 0, 0, 0.045), 0 3.5px 6px rgba(0, 0, 0, 0.09)',
  backgroundColor: '$neutral100',
});

export const TriggerContent = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
