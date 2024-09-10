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
import { messages as deMessages } from '../../../../../translations/de.js';
import { messages as elMessages } from '../../../../../translations/el.js';
import { messages as enMessages } from '../../../../../translations/en.js';
import { messages as esMessages } from '../../../../../translations/es.js';
import { messages as fiMessages } from '../../../../../translations/fi.js';
import { messages as frMessages } from '../../../../../translations/fr.js';
import { messages as itMessages } from '../../../../../translations/it.js';
import { messages as jaMessages } from '../../../../../translations/ja.js';
import { messages as nlMessages } from '../../../../../translations/nl.js';
import { messages as plMessages } from '../../../../../translations/pl.js';
import { messages as ptMessages } from '../../../../../translations/pt.js';
import { messages as ruMessages } from '../../../../../translations/ru.js';
import { messages as svMessages } from '../../../../../translations/sv.js';
import { messages as ukMessages } from '../../../../../translations/uk.js';
import { messages as zhMessages } from '../../../../../translations/zh.js';

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
