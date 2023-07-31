import React, { useEffect } from 'react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { PropsWithChildren } from 'react';
/* 
  Note: esbuild doesn't work properly with paths yet, so I couldn't use `paths` to make this path shorter. 
  e.g:
  "paths": {
    "translations/*": ["../../translations/*"]
  }  
*/
import { messages as enMessages } from '../../../../../translations/en';
import { messages as esMessages } from '../../../../../translations/es';
import { messages as jpMessages } from '../../../../../translations/jp';
import { messages as frMessages } from '../../../../../translations/fr';

const DEFAULT_LANGUAGE = 'en';
const messages = {
  en: enMessages,
  es: esMessages,
  jp: jpMessages,
  fr: frMessages,
};

i18n.load(messages);

export type Language = keyof typeof messages;
interface PropTypes {
  language?: Language;
}

function I18nManager(props: PropsWithChildren<PropTypes>) {
  useEffect(() => {
    i18n.activate(props?.language || DEFAULT_LANGUAGE);
  }, [props?.language]);

  return <I18nProvider i18n={i18n}>{props.children}</I18nProvider>;
}

export { I18nManager };
