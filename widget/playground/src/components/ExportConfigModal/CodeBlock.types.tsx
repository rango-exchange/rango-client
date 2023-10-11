import type { Language } from './ExportConfigModal.types';

export interface CodeBlockProps {
  language: Language;
  theme: any;
  children: string;
}
