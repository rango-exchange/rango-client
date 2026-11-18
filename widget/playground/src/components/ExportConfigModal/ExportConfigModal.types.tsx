import type { PlaygroundConfig } from '../../store/config';

import {
  formatConfig,
  getEmbeddedCode,
  getIframeCode,
} from '../../utils/export';

export type ExportType = 'embedded' | 'iframe' | 'config';
export type Language = 'jsx' | 'javascript';

export const typesOfCodeBlocksTabs = [
  {
    id: 'embedded',
    title: 'Embedded',
  },
  {
    id: 'iframe',
    title: 'Iframe',
  },
  {
    id: 'config',
    title: 'Config',
  },
];

export const typesOfCodeBlocks: {
  [key in ExportType]: {
    language: Language;
    generateCode: (config: PlaygroundConfig) => string;
  };
} = {
  embedded: {
    language: 'jsx',
    generateCode: (config) => getEmbeddedCode(config),
  },
  iframe: {
    language: 'javascript',
    generateCode: (config) => getIframeCode(formatConfig(config)),
  },
  config: {
    language: 'javascript',
    generateCode: (config) => formatConfig(config),
  },
};

export interface ExportConfigModalProps {
  open: boolean;
  onClose: () => void;
  config: PlaygroundConfig;
}
