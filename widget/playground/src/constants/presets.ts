import type { Mode } from '../store/config';
import type {
  WidgetColors,
  WidgetColorsKeys,
} from '@yeager-dev/widget-embedded';

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
      info: '#5BABFF',
    },
    light: {
      primary: '#1C3CF1',
      secondary: '#469BF5',
      neutral: '#E6E6E6',
      background: '#FDFDFD',
      foreground: '#010101',
      info: '#5BABFF',
    },
  },
  {
    id: 2,
    dark: {
      neutral: '#434965',
      primary: '#1C3CF1',
      secondary: '#2284ED',
      background: '#070917',
      foreground: '#FDFDFD',
      info: '#5BABFF',
    },
    light: {
      primary: '#1C3CF1',
      secondary: '#469BF5',
      neutral: '#E6E6E6',
      background: '#FDFDFD',
      foreground: '#010101',
      info: '#5BABFF',
    },
  },
  {
    id: 3,
    light: {
      primary: '#1C3CF1',
      secondary: '#469BF5',
      neutral: '#E6E6E6',
      background: '#FDFDFD',
      foreground: '#010101',
    },
  },
  {
    id: 4,
    dark: {
      primary: '#1C3CF1',
      secondary: '#2284ED',
      neutral: '#222222',
      background: '#010101',
      foreground: '#FDFDFD',
      info: '#5BABFF',
    },
  },
  {
    id: 5,
    dark: {
      neutral: '#484b5f',
      primary: '#1C3CF1',
      secondary: '#2284ED',
      background: '#070917',
      foreground: '#FDFDFD',
      info: '#5BABFF',
    },
  },
  {
    id: 6,
    dark: {
      primary: '#4c228a',
      secondary: '#815dba',
      neutral: '#5e5a7d',
      info: '#9d6ee3',
      foreground: '#fcfaffff',
      background: '#120f29ff',
    },
    light: {
      primary: '#4c228a',
      secondary: '#653ba3ff',
      neutral: '#a29ec1',
      info: '#9d6ee3',
      foreground: '#120f29ff',
      background: '#fcfaffff',
    },
  },
  {
    id: 7,
    light: {
      primary: '#4c228a',
      secondary: '#653ba3ff',
      neutral: '#a29ec1',
      info: '#9d6ee3',
      foreground: '#120f29ff',
      background: '#fcfaffff',
    },
  },
  {
    id: 8,
    dark: {
      primary: '#4c228a',
      secondary: '#815dba',
      neutral: '#5e5a7d',
      info: '#9d6ee3',
      foreground: '#fcfaffff',
      background: '#120f29ff',
    },
  },
  {
    id: 9,
    dark: {
      foreground: '#fffeffff',
      background: '#110114ff',
      primary: '#bb00b2',
      secondary: '#93398f',
      neutral: '#585358',
      info: '#df72df',
    },
    light: {
      background: '#fffeffff',
      foreground: '#2f0146ff',
      primary: '#bb00b2',
      secondary: '#7c1ca4',
      neutral: '#919191',
      info: '#df72df',
    },
  },
  {
    id: 10,
    light: {
      background: '#fffeffff',
      foreground: '#2f0146ff',
      primary: '#bb00b2',
      secondary: '#7c1ca4',
      neutral: '#919191',
      info: '#df72df',
    },
  },
  {
    id: 11,
    dark: {
      foreground: '#fffeffff',
      background: '#110114ff',
      primary: '#bb00b2',
      secondary: '#93398f',
      neutral: '#585358',
      info: '#df72df',
    },
  },

  {
    id: 12,
    dark: {
      primary: '#4e4951',
      neutral: '#757078',
      secondary: '#a002b0',
      background: '#252028ff',
      foreground: '#cdc8d0',
    },
  },
  {
    id: 13,
    dark: {
      foreground: '#fff',
      background: '#171721ff',
      secondary: '#885ac4',
      primary: '#6606e6',
      neutral: '#5c5c68',
      info: '#7d5ea6',
    },
    light: {
      background: '#fff',
      foreground: '#171721ff',
      neutral: '#928e94',
      secondary: '#6606e6',
      primary: '#6606e6',
      info: '#7d5ea6',
    },
  },
  {
    id: 14,
    light: {
      background: '#fff',
      foreground: '#171721ff',
      neutral: '#928e94',
      secondary: '#6606e6',
      primary: '#6606e6',
      info: '#7d5ea6',
    },
  },
  {
    id: 15,
    dark: {
      foreground: '#fff',
      background: '#171721ff',
      secondary: '#885ac4',
      primary: '#6606e6',
      neutral: '#5c5c68',
      info: '#7d5ea6',
    },
  },
  {
    id: 16,
    dark: {
      background: '#0c1536ff',
      primary: '#8574f9',
      foreground: '#c4d1fdff',
      secondary: '#7161ff',
      neutral: '#43478e',
    },
  },
  {
    id: 17,
    dark: {
      background: '#0c0f12ff',
      primary: '#e0c072ff',
      foreground: '#f2e8d0',
      secondary: '#b0a385',
      neutral: '#5c5f64',
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
    key: 'info',
    label: 'Info',
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
export const DEFAULT_COLORS = {
  dark: {
    primary: undefined,
    secondary: undefined,
    neutral: undefined,
    background: undefined,
    foreground: undefined,
    info: undefined,
  },
  light: {
    primary: undefined,
    secondary: undefined,
    neutral: undefined,
    background: undefined,
    foreground: undefined,
    info: undefined,
  },
};
