import type { FlagPropTypes, Language } from '@rango-dev/ui';

import { English, French, Japanese, Portuguese, Spanish } from '@rango-dev/ui';

export type LanguageItem = {
  title: string;
  label: string;
  local: Language;
  SVGFlag: React.ComponentType<FlagPropTypes>;
};

export const LANGUAGES: LanguageItem[] = [
  { title: 'English', label: 'English', local: 'en', SVGFlag: English },
  { title: 'Spanish', label: 'Español', local: 'es', SVGFlag: Spanish },
  { title: 'French', label: 'Français', local: 'fr', SVGFlag: French },
  { title: 'Japanese', label: '日本語', local: 'ja', SVGFlag: Japanese },
  { title: 'Portuguese', label: 'Português', local: 'pt', SVGFlag: Portuguese },
];

export const DEFAULT_LANGUAGE = 'en';
