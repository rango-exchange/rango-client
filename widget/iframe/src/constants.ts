import { WidgetConfig } from '@rango-dev/widget-embedded';
import { PlaceholderStyles } from './types';

export const commonStyles = {
  maxWidth: '512px',
  height: '720px',
  width: '100%',
  minWidth: '415px',
  overflow: 'hidden',
};

export const defaultStyles: { [key in 'light' | 'dark']: PlaceholderStyles } = {
  dark: {
    background: '#000',
    foreground: '#fff',
  },
  light: { background: '#fff', foreground: '#000' },
};
