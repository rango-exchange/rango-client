import 'i18next';
import en from './en.json';

const defaultResource = { translation: en };

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof defaultResource;
  }
}
