import type { Mode } from '../../store/config';

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
