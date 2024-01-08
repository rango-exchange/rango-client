import type { LanguageItem } from '../constants/languages';

import { type Language } from '@rango-dev/ui';

import { DEFAULT_LANGUAGE, LANGUAGES } from '../constants/languages';
import { useAppStore } from '../store/AppStore';

interface UseLanguage {
  languages: LanguageItem[];
  defaultLanguage: Language;
  activeLanguage: Language;
  changeLanguage: (language?: Language | null) => void;
  resetLanguage: () => void;
}

export function useLanguage(): UseLanguage {
  const { setLanguage, language, config } = useAppStore();
  const languages = LANGUAGES;
  const defaultLanguage = config?.language || DEFAULT_LANGUAGE;

  return {
    activeLanguage: language || defaultLanguage,
    languages,
    defaultLanguage,
    changeLanguage: (language) => setLanguage(language || DEFAULT_LANGUAGE),
    resetLanguage: () => setLanguage(null),
  };
}
