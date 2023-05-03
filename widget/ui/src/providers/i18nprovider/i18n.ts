import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LanguageKey, LanguageTranslationResources } from './types';
import * as supportedLanguages from '../../i18n';
import i18next from 'i18next';

const resources = (Object.keys(supportedLanguages) as LanguageKey[]).reduce(
  (resources, lng) => {
    resources[lng] = {
      translation: supportedLanguages[lng],
    };
    return resources;
  },
  {} as LanguageTranslationResources
);
// @ts-ignore
const i18n = i18next.createInstance({
  fallbackLng: 'en',
  debug: true,
  resources,
});

i18n.use(initReactI18next).use(LanguageDetector).use(Backend).init();

export default i18n;
