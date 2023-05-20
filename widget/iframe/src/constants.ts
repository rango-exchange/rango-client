import { WidgetConfig } from '@rango-dev/widget-embedded';
import { PlaceholderStyles } from './types';

export const commonStyles = {
  width: '552px',
  height: '740px',
  maxWidth: '100%',
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
