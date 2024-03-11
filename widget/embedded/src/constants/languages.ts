import type { FlagPropTypes, Language } from '@rango-dev/ui';

import {
  Chinese,
  English,
  Finland,
  French,
  German,
  Greece,
  Italian,
  Japanese,
  Netherlands,
  Poland,
  Portuguese,
  Russian,
  Spanish,
  Swedish,
  Ukrainian,
} from '@rango-dev/ui';

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
  { title: 'Chinese', label: '中国人', local: 'zh', SVGFlag: Chinese },
  { title: 'Russian', label: 'Русский', local: 'ru', SVGFlag: Russian },
  { title: 'German', label: 'Deutsch', local: 'de', SVGFlag: German },
  { title: 'Ukrainian', label: 'Україні', local: 'uk', SVGFlag: Ukrainian },
  { title: 'Swedish', label: 'svenska', local: 'sv', SVGFlag: Swedish },
  { title: 'Finnish', label: 'Suomalainen', local: 'fi', SVGFlag: Finland },
  { title: 'Dutch', label: 'Nederlands', local: 'nl', SVGFlag: Netherlands },
  { title: 'Greek', label: 'Grieks', local: 'el', SVGFlag: Greece },
  { title: 'Italian', label: 'Italiana', local: 'it', SVGFlag: Italian },
  { title: 'Polish', label: 'Polski', local: 'pl', SVGFlag: Poland },
];

export const DEFAULT_LANGUAGE = 'en';
