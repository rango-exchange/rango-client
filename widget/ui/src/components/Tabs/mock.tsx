import React from 'react';

import { AutoThemeIcon, DarkModeIcon, LightModeIcon } from '../../icons';
import { Typography } from '../Typography';

export const themes = [
  {
    id: 'light',
    icon: <LightModeIcon color="black" size={24} />,
    tooltip: (
      <Typography size="xsmall" variant="body">
        Light
      </Typography>
    ),
  },
  {
    id: 'dark',
    icon: <DarkModeIcon color="black" size={24} />,
    tooltip: (
      <Typography size="xsmall" variant="body">
        Dark
      </Typography>
    ),
  },
  {
    id: 'auto',
    icon: <AutoThemeIcon color="black" size={24} />,
    tooltip: (
      <Typography size="xsmall" variant="body">
        Auto
      </Typography>
    ),
  },
];
