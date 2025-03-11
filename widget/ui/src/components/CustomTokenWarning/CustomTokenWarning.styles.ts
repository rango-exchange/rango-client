import type { Tooltip } from '../Tooltip';
import type { ComponentProps } from 'react';

import { styled } from '../../theme';
import { IconHighlight } from '../Alert/Alert.styles';

export const tooltipStyles: ComponentProps<typeof Tooltip>['styles'] = {
  root: {
    zIndex: 10,
  },
};

export const TooltipContent = styled('div', {
  width: '217px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  '& .warning-icon-container': {
    width: '$20',
    height: '$20',
    alignSelf: 'unset',
  },
});

export const StyledIconHighlight = styled(IconHighlight, {
  width: '14px',
  height: '14px',
  alignSelf: 'unset',
});
