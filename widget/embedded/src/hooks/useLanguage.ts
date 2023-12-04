import type { LanguageItem } from '../constants/languages';

import { type Language } from '@rango-dev/ui';

import { DEFAULT_LANGUAGE, LANGUAGES } from '../constants/languages';
import { useAppStore } from '../store/AppStore';

interface UseLanguage {
  languages: LanguageItem[];
  defaultLanguage: Language;
  activeLanguage: Language;
  changeLanguage: (language?: Language) => void;
}

export function useLanguage(): UseLanguage {
  const { setLanguage, language } = useAppStore();
  const languages = LANGUAGES;
  const defaultLanguage = DEFAULT_LANGUAGE;

  return {
    activeLanguage: language,
    languages,
    defaultLanguage,
    changeLanguage: (language) => setLanguage(language || DEFAULT_LANGUAGE),
  };
}
