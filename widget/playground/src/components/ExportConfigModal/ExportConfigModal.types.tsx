import type { WidgetConfig } from '@rango-dev/widget-embedded';

import { getEmbeddedCode, getIframeCode } from '../../helpers';

export type ExportType = 'embedded' | 'iframe' | 'config';
export type Language = 'jsx' | 'javascript';

export const typesOfCodeBlocks: {
  [key in ExportType]: {
    language: Language;
    generateCode: (config: string) => string;
  };
} = {
  embedded: {
    language: 'jsx',
    generateCode: (config) => getEmbeddedCode(config),
  },
  iframe: {
    language: 'javascript',
    generateCode: (config) => getIframeCode(config),
  },
  config: {
    language: 'javascript',
    generateCode: (config) => config,
  },
};

export interface ExportConfigModalProps {
  open: boolean;
  onClose: () => void;
  config: WidgetConfig;
}
