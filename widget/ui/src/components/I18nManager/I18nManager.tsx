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
import { messages as afMessages } from '../../../../../translations/af.js';
import { messages as arMessages } from '../../../../../translations/ar.js';
import { messages as bnMessages } from '../../../../../translations/bn.js';
import { messages as caMessages } from '../../../../../translations/ca.js';
import { messages as daMessages } from '../../../../../translations/da.js';
import { messages as deMessages } from '../../../../../translations/de.js';
import { messages as elMessages } from '../../../../../translations/el.js';
import { messages as enMessages } from '../../../../../translations/en.js';
import { messages as esMessages } from '../../../../../translations/es.js';
import { messages as fiMessages } from '../../../../../translations/fi.js';
import { messages as filMessages } from '../../../../../translations/fil.js';
import { messages as frMessages } from '../../../../../translations/fr.js';
import { messages as hiMessages } from '../../../../../translations/hi.js';
import { messages as huMessages } from '../../../../../translations/hu.js';
import { messages as idMessages } from '../../../../../translations/id.js';
import { messages as itMessages } from '../../../../../translations/it.js';
import { messages as jaMessages } from '../../../../../translations/ja.js';
import { messages as koMessages } from '../../../../../translations/ko.js';
import { messages as ltMessages } from '../../../../../translations/lt.js';
import { messages as msMessages } from '../../../../../translations/ms.js';
import { messages as nlMessages } from '../../../../../translations/nl.js';
import { messages as plMessages } from '../../../../../translations/pl.js';
import { messages as ptMessages } from '../../../../../translations/pt.js';
import { messages as ruMessages } from '../../../../../translations/ru.js';
import { messages as skMessages } from '../../../../../translations/sk.js';
import { messages as srMessages } from '../../../../../translations/sr.js';
import { messages as svMessages } from '../../../../../translations/sv.js';
import { messages as swMessages } from '../../../../../translations/sw.js';
import { messages as thMessages } from '../../../../../translations/th.js';
import { messages as trMessages } from '../../../../../translations/tr.js';
import { messages as ukMessages } from '../../../../../translations/uk.js';
import { messages as urMessages } from '../../../../../translations/ur.js';
import { messages as viMessages } from '../../../../../translations/vi.js';
import { messages as zh_CNMessages } from '../../../../../translations/zh-CN.js';
import { messages as zh_TWMessages } from '../../../../../translations/zh-TW.js';

const messages = {
  en: enMessages,
  es: esMessages,
  ja: jaMessages,
  fr: frMessages,
  pt: ptMessages,
  ru: ruMessages,
  de: deMessages,
  uk: ukMessages,
  sv: svMessages,
  fi: fiMessages,
  nl: nlMessages,
  el: elMessages,
  it: itMessages,
  pl: plMessages,
  af: afMessages,
  ar: arMessages,
  bn: bnMessages,
  ca: caMessages,
  da: daMessages,
  hi: hiMessages,
  hu: huMessages,
  id: idMessages,
  ko: koMessages,
  lt: ltMessages,
  ms: msMessages,
  fil: filMessages,
  sr: srMessages,
  sk: skMessages,
  sw: swMessages,
  th: thMessages,
  tr: trMessages,
  ur: urMessages,
  vi: viMessages,
  'zh-TW': zh_TWMessages,
  'zh-CN': zh_CNMessages,
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
