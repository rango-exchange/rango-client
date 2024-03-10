import type { PropsWithChildren } from 'react';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import React, { useEffect, useReducer } from 'react';

/*
 *Note: esbuild doesn't work properly with paths yet, so I couldn't use `paths` to make this path shorter.
 *e.g:
 *"paths": {
 *  "translations/*": ["../../translations/*"]
 *}
 */
import { messages as deMessages } from '../../../../../translations/de';
import { messages as elMessages } from '../../../../../translations/el';
import { messages as enMessages } from '../../../../../translations/en';
import { messages as esMessages } from '../../../../../translations/es';
import { messages as fiMessages } from '../../../../../translations/fi';
import { messages as frMessages } from '../../../../../translations/fr';
import { messages as itMessages } from '../../../../../translations/it';
import { messages as jaMessages } from '../../../../../translations/ja';
import { messages as nlMessages } from '../../../../../translations/nl';
import { messages as plMessages } from '../../../../../translations/pl';
import { messages as ptMessages } from '../../../../../translations/pt';
import { messages as ruMessages } from '../../../../../translations/ru';
import { messages as svMessages } from '../../../../../translations/sv';
import { messages as ukMessages } from '../../../../../translations/uk';
import { messages as zhMessages } from '../../../../../translations/zh';

const messages = {
  en: enMessages,
  es: esMessages,
  ja: jaMessages,
  fr: frMessages,
  pt: ptMessages,
  zh: zhMessages,
  ru: ruMessages,
  de: deMessages,
  uk: ukMessages,
  sv: svMessages,
  fi: fiMessages,
  nl: nlMessages,
  el: elMessages,
  it: itMessages,
  pl: plMessages,
};

i18n.load(messages);

export type Language = keyof typeof messages;
interface PropTypes {
  language: Language;
}

function I18nManager(props: PropsWithChildren<PropTypes>) {
  const [count, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    i18n.on('change', () => {
      forceUpdate();
    });
  }, [i18n]);
  useEffect(() => {
    i18n.activate(props.language);
  }, [props.language]);

  return (
    <I18nProvider i18n={i18n} key={count}>
      {props.children}
    </I18nProvider>
  );
}

export { I18nManager };
