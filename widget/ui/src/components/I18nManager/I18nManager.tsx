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
import { messages as enMessages } from '../../../../../translations/en/messages';
import { messages as esMessages } from '../../../../../translations/es/messages';
import { messages as frMessages } from '../../../../../translations/fr/messages';
import { messages as jaMessages } from '../../../../../translations/ja/messages';

const messages = {
  en: enMessages,
  es: esMessages,
  ja: jaMessages,
  fr: frMessages,
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
