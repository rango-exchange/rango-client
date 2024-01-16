import type { ExportType, Language } from './ExportConfigModal.types';

export interface CodeBlockProps {
  selectedType: ExportType;
  language: Language;
  theme: any;
  children: string;
}
