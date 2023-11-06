import type { LanguageItem } from '../constants/languages';

import { type Language } from '@rango-dev/ui';

import { DEFAULT_LANGUAGE, LANGUAGES } from '../constants/languages';
import { useSettingsStore } from '../store/settings';

interface UseLanguage {
  languages: LanguageItem[];
  defaultLanguage: Language;
  activeLanguage: Language;
  changeLanguage: (language: Language) => void;
}

export function useLanguage(): UseLanguage {
  const language = useSettingsStore.use.language();
  const setLanguage = useSettingsStore.use.setLanguage();
  const languages = LANGUAGES;
  const defaultLanguage = DEFAULT_LANGUAGE;

  return {
    activeLanguage: language,
    languages,
    defaultLanguage,
    changeLanguage: setLanguage,
  };
}
