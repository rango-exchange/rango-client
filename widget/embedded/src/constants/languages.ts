import type { FlagPropTypes, Language } from '@rango-dev/ui';

import {
  Bengali,
  Catalonia,
  Chinese,
  Cyprus,
  Denmark,
  English,
  Finland,
  French,
  German,
  Greece,
  Hungary,
  India,
  Indonesian,
  Italian,
  Japanese,
  Korea,
  Lithuania,
  Malay,
  Netherlands,
  Pakistan,
  Philippines,
  Poland,
  Portuguese,
  Russian,
  SaudiArabia,
  Serbia,
  Slovakia,
  SouthAfrica,
  Spanish,
  Swahili,
  Swedish,
  Thai,
  Turkish,
  Ukrainian,
  Vietnamese,
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
  {
    title: 'Chinese(Simplified)',
    label: '简体中文',
    local: 'zh',
    SVGFlag: Chinese,
  },
  { title: 'Russian', label: 'Русский', local: 'ru', SVGFlag: Russian },
  { title: 'German', label: 'Deutsch', local: 'de', SVGFlag: German },
  { title: 'Ukrainian', label: 'Україні', local: 'uk', SVGFlag: Ukrainian },
  { title: 'Swedish', label: 'svenska', local: 'sv', SVGFlag: Swedish },
  { title: 'Finnish', label: 'Suomalainen', local: 'fi', SVGFlag: Finland },
  { title: 'Dutch', label: 'Nederlands', local: 'nl', SVGFlag: Netherlands },
  { title: 'Greek', label: 'Grieks', local: 'el', SVGFlag: Greece },
  { title: 'Italian', label: 'Italiana', local: 'it', SVGFlag: Italian },
  { title: 'Polish', label: 'Polski', local: 'pl', SVGFlag: Poland },

  { title: 'Afrikaans', label: 'Afrikaans', local: 'af', SVGFlag: SouthAfrica },
  { title: 'Arabic', label: 'عربي', local: 'ar', SVGFlag: SaudiArabia },
  { title: 'Bengali', label: 'বাংলা', local: 'bn', SVGFlag: Bengali },
  { title: 'Catalan', label: 'català', local: 'ca', SVGFlag: Catalonia },
  { title: 'Danish', label: 'dansk', local: 'da', SVGFlag: Denmark },
  { title: 'Hindi', label: 'हिंदी', local: 'hi', SVGFlag: India },
  { title: 'Hungarian', label: 'magyar', local: 'hu', SVGFlag: Hungary },
  { title: 'Indonesian', label: 'Indonesia', local: 'id', SVGFlag: Indonesian },
  { title: 'Korean', label: '한국인', local: 'ko', SVGFlag: Korea },
  { title: 'Lithuanian', label: 'lietuvių', local: 'lt', SVGFlag: Lithuania },
  { title: 'Malay', label: 'Melayu', local: 'ms', SVGFlag: Malay },
  { title: 'Filipino', label: 'Filipino', local: 'fil', SVGFlag: Philippines },
  { title: 'Serbian', label: 'српски', local: 'sr', SVGFlag: Serbia },
  { title: 'Slovak', label: 'slovenský', local: 'sk', SVGFlag: Slovakia },
  { title: 'Swahili', label: 'kiswahili', local: 'sw', SVGFlag: Swahili },
  { title: 'Thai', label: 'แบบไทย', local: 'th', SVGFlag: Thai },
  { title: 'Turkish', label: 'Türkçe', local: 'tr', SVGFlag: Turkish },
  { title: 'Urdu', label: 'اردو', local: 'ur', SVGFlag: Pakistan },
  {
    title: 'Vietnamese',
    label: 'Tiếng Việt',
    local: 'vi',
    SVGFlag: Vietnamese,
  },
  {
    title: 'Greek(cyprus)',
    label: 'Ελληνικά(Κύπρος)',
    local: 'el-CY',
    SVGFlag: Cyprus,
  },
  {
    title: 'Chinese(Traditional)',
    label: '中文（繁體)',
    local: 'zh-TW',
    SVGFlag: Chinese,
  },
];

export const DEFAULT_LANGUAGE = 'en';
