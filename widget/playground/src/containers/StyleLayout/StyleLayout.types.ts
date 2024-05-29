import type { Mode } from '../../store/config';
import type { ColorsType } from '../../types';

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
  selectedPreset?: ColorsType;
  onResetPreset: () => void;
};

export enum ModalState {
  DEFAULT_FONT = 'font',
  DEFAULT_LANGUAGE = 'language',
  DEFAULT_VARIANT = 'variant',
}
