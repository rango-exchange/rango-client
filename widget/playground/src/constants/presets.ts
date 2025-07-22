import type { Mode } from '../store/config';
import type { PresetType } from '../types';
import type {
  WidgetColors,
  WidgetColorsKeys,
} from '@arlert-dev/widget-embedded';

import { rangoDarkColors } from '@arlert-dev/ui';

export const DEFAULT_PRESET_ID = 'DEFAULT_THEME_COLORS';

export const TABS: { id: Mode; title: string }[] = [
  {
    id: 'light',
    title: 'Light',
  },

  {
    id: 'dark',
    title: 'Dark',
  },

  {
    id: 'auto',
    title: 'System',
  },
];

export const PRESETS: PresetType = [
  {
    id: 'DEFAULT_THEME_COLORS',
    dark: {
      primary: '#1C3CF1',
      secondary: '#2284ED',
      neutral: '#222222',
      background: '#010101',
      foreground: '#FDFDFD',
    },
    light: {
      primary: '#1C3CF1',
      secondary: '#469BF5',
      neutral: '#E6E6E6',
      background: '#FDFDFD',
      foreground: '#010101',
    },
  },
  {
    id: 'RANGO_THEME',
    dark: {
      ...rangoDarkColors,
      primary: '#1C3CF1',
      secondary: '#2284ED',
    },
    light: {
      primary: '#1C3CF1',
      secondary: '#469BF5',
      neutral: '#E6E6E6',
      background: '#FDFDFD',
      foreground: '#010101',
    },
  },
  {
    id: 1,
    dark: {
      primary: '#4c228a',
      secondary: '#51278F',
      neutral: '#222222',
      foreground: '#FDFDFD',
      background: '#010101',
    },
    light: {
      primary: '#4c228a',
      secondary: '#51278F',
      neutral: '#E6E6E6',
      foreground: '#010101',
      background: '#FDFDFD',
    },
  },
  {
    id: 2,
    dark: {
      foreground: '#FDFDFD',
      background: '#010101',
      primary: '#bb00b2',
      secondary: '#7c1ca4',
      neutral: '#222222',
    },
    light: {
      background: '#FDFDFD',
      foreground: '#010101',
      primary: '#bb00b2',
      secondary: '#7c1ca4',
      neutral: '#E6E6E6',
    },
  },
  {
    id: 3,
    dark: {
      primary: '#574660',
      neutral: '#222222',
      secondary: '#a002b0',
      background: '#010101',
      foreground: '#FDFDFD',
    },
  },
  {
    id: 4,
    dark: {
      foreground: '#FDFDFD',
      background: '#010101',
      secondary: '#6606e6',
      primary: '#6606e6',
      neutral: '#222222',
    },
    light: {
      background: '#FDFDFD',
      foreground: '#010101',
      neutral: '#E6E6E6',
      secondary: '#6606e6',
      primary: '#6606e6',
    },
  },
  {
    id: 5,
    dark: {
      background: '#010101',
      primary: '#4838D4',
      foreground: '#FDFDFD',
      secondary: '#7161ff',
      neutral: '#222222',
    },
  },
  {
    id: 6,
    dark: {
      background: '#010101',
      primary: '#E0C072',
      foreground: '#FDFDFD',
      secondary: '#B0A385',
      neutral: '#222222',
    },
  },
];

export const WIDGET_COLORS: { key: WidgetColorsKeys; label: string }[] = [
  {
    key: 'primary',
    label: 'Primary',
  },
  {
    key: 'secondary',
    label: 'Secondary',
  },
  {
    key: 'neutral',
    label: 'Neutral',
  },
  {
    key: 'background',
    label: 'Background',
  },
  {
    key: 'foreground',
    label: 'Foreground',
  },
];

export const DEFAULT_THEME_COLORS = {
  dark: PRESETS.find((preset) => preset.id === DEFAULT_PRESET_ID)
    ?.dark as WidgetColors,
  light: PRESETS.find((preset) => preset.id === DEFAULT_PRESET_ID)
    ?.light as WidgetColors,
};
