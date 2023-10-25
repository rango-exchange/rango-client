import type { Mode } from '../store/config';
import type { WidgetColors } from '@rango-dev/widget-embedded';

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

export const PRESETS: {
  id: number;
  dark?: WidgetColors;
  light?: WidgetColors;
}[] = [
  {
    id: 1,
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
    id: 2,
    light: {
      primary: '#1C3CF1',
      secondary: '#469BF5',
      neutral: '#E6E6E6',
      background: '#FDFDFD',
      foreground: '#010101',
    },
  },
  {
    id: 3,
    dark: {
      primary: '#1C3CF1',
      secondary: '#2284ED',
      neutral: '#222222',
      background: '#010101',
      foreground: '#FDFDFD',
    },
  },

  {
    id: 4,
    dark: {
      primary: '#502f82ff',
      secondary: '#9b6de2ff',
      neutral: '#a4a0bd',
      // info: '#000022',
      foreground: '#fcfaffff',
      background: '#120f29ff',
    },
    light: {
      primary: '#31007aff',
      secondary: '#653ba3ff',
      neutral: '#84809d',
      // info: '#8e6abf',
      foreground: '#120f29ff',
      background: '#fcfaffff',
    },
  },
  {
    id: 5,
    light: {
      primary: '#31007aff',
      secondary: '#653ba3ff',
      neutral: '#84809d',
      // info: '#8e6abf',
      foreground: '#120f29ff',
      background: '#fcfaffff',
    },
  },
  {
    id: 6,
    dark: {
      primary: '#502f82ff',
      secondary: '#9b6de2ff',
      neutral: '#a4a0bd',
      // info: '#000022',
      foreground: '#fcfaffff',
      background: '#120f29ff',
    },
  },
  {
    id: 7,
    dark: {
      background: '#110114ff',
      secondary: '#2d2a2dff',
      primary: '#d400cbff',
    },
    light: {
      background: '#fffeffff',
      primary: '#d400cbff',
      foreground: '#2f0146ff',
      secondary: '#f5f1f7ff',
      neutral: '#eae5eaff',
    },
  },
  {
    id: 8,

    light: {
      background: '#fffeffff',
      primary: '#d400cbff',
      foreground: '#2f0146ff',
      secondary: '#f5f1f7ff',
      neutral: '#eae5eaff',
    },
  },
  {
    id: 9,
    dark: {
      background: '#110114ff',
      secondary: '#2d2a2dff',
      primary: '#d400cbff',
    },
  },

  {
    id: 10,
    dark: {
      primary: '#353038ff',
      neutral: '#353038ff',
      secondary: '#353038ff',
      background: '#252028ff',
      foreground: '#88818cff',
    },
  },
  {
    id: 11,
    dark: {
      foreground: '#fff',
      background: '#171721ff',
      secondary: '#1c1c28ff',
      primary: '#7720e9ff',
      neutral: '#1c1c28ff',
    },
    light: {
      background: '#fff',
      foreground: '#171721ff',
      neutral: '#f9fafbff',
      secondary: '#f9fafbff',
      primary: '#7f1fffff',
    },
  },
  {
    id: 12,
    light: {
      background: '#fff',
      foreground: '#171721ff',
      neutral: '#f9fafbff',
      secondary: '#f9fafbff',
      primary: '#7f1fffff',
    },
  },
  {
    id: 13,
    dark: {
      foreground: '#fff',
      background: '#171721ff',
      secondary: '#1c1c28ff',
      primary: '#7720e9ff',
      neutral: '#1c1c28ff',
    },
  },
  {
    id: 14,
    dark: {
      background: '#0c1536ff',
      primary: '#6c5be0ff',
      foreground: '#c4d1fdff',
      secondary: '#13164eff',
      neutral: '#181c63ff',
    },
  },
  {
    id: 15,
    dark: {
      background: '#0c0f12ff',
      primary: '#e0c072ff',
      foreground: '#e0c072ff',
      secondary: '#12171cff',
      neutral: '#202327ff',
    },
  },
];
