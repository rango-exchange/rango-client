import type { Mode } from '../../store/config';
import type { WidgetColors } from '@yeager-dev/widget-embedded';

export enum StyleCollapseState {
  GENERAL = 'general',
  THEMES = 'themes',
}

export type PresetTypes = {
  tab: Mode;
};

export type ColorsTypes = {
  primary?: string;
  secondary?: string;
  background?: string;
};

export type CustomColorsTypes = {
  tab: Mode;
  selectedPreset?: {
    light: WidgetColors;
    dark: WidgetColors;
  };
  onResetPreset: () => void;
};

export enum ModalState {
  DEFAULT_FONT = 'font',
  DEFAULT_LANGUAGE = 'language',
}
