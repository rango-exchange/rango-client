import type { PropTypes } from './CustomTokenWarning.types';

import { i18n } from '@lingui/core';
import React from 'react';

import { WarningIcon } from '../../icons';
import { IconHighlight } from '../Alert/Alert.styles';
import { Divider } from '../Divider';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

import {
  StyledIconHighlight,
  TooltipContent,
  tooltipStyles,
} from './CustomTokenWarning.styles';

export function CustomTokenWarning(props: PropTypes) {
  return (
    <Tooltip
      styles={tooltipStyles}
      side="bottom"
      align="center"
      sideOffset={20}
      container={props.container}
      content={
        <TooltipContent>
          <IconHighlight type="warning" className="warning-icon-container">
            <WarningIcon color="warning" size={13} />
          </IconHighlight>
          <Divider size={4} direction="horizontal" />
          <Typography variant="body" size="xsmall">
            {i18n.t(
              'This token may involve potential security risks; proceed with caution.'
            )}
          </Typography>
        </TooltipContent>
      }>
      <StyledIconHighlight type="warning">
        <WarningIcon color="warning" size={9} />
      </StyledIconHighlight>
    </Tooltip>
  );
}
