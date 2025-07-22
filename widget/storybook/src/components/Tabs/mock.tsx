import type { TabsPropTypes } from '@arlert-dev/ui';

import {
  AutoThemeIcon,
  DarkModeIcon,
  LightModeIcon,
  Typography,
} from '@arlert-dev/ui';
import React from 'react';

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

export const numbers: TabsPropTypes['items'] = [
  {
    id: 'one',
    title: 'one',
    tooltip: (
      <Typography size="xsmall" variant="body">
        1
      </Typography>
    ),
  },
  {
    id: 'two',
    title: 'two',
    tooltip: (
      <Typography size="xsmall" variant="body">
        2
      </Typography>
    ),
  },
  {
    id: 'three',
    title: 'three',
    tooltip: (
      <Typography size="xsmall" variant="body">
        3
      </Typography>
    ),
  },
  {
    id: 'four',
    title: 'four',
    tooltip: (
      <Typography size="xsmall" variant="body">
        4
      </Typography>
    ),
  },
  {
    id: 'five',
    title: 'five',
    tooltip: (
      <Typography size="xsmall" variant="body">
        5
      </Typography>
    ),
  },
  {
    id: 'six',
    title: 'six',
    tooltip: (
      <Typography size="xsmall" variant="body">
        6
      </Typography>
    ),
  },
  {
    id: 'seven',
    title: 'seven',
    tooltip: (
      <Typography size="xsmall" variant="body">
        7
      </Typography>
    ),
  },
  {
    id: 'eight',
    title: 'eight',
    tooltip: (
      <Typography size="xsmall" variant="body">
        8
      </Typography>
    ),
  },
  {
    id: 'nine',
    title: 'nine',
    tooltip: (
      <Typography size="xsmall" variant="body">
        9
      </Typography>
    ),
  },
  {
    id: 'ten',
    title: 'ten',
    tooltip: (
      <Typography size="xsmall" variant="body">
        10
      </Typography>
    ),
  },
];
