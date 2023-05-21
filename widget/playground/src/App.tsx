import React from 'react';
import { Config } from './containers/Config';
import { Widget } from '@rango-dev/widget-embedded';
import { useConfigStore } from './store/config';
import { useTheme } from './hook/useTheme';
import { Route, Routes } from 'react-router-dom';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { messages as enMessages } from '../../../translations/embedded/en';
import { messages as csMessages } from '../../../translations/embedded/cs';

i18n.load({
  en: enMessages,
  cs: csMessages,
});
i18n.activate('cs');

export function App() {
  const { activeTheme } = useTheme();
  const config = useConfigStore.use.config();

  return (
    <div className={activeTheme}>
      <I18nProvider i18n={i18n}>
        <Config>
          <Routes>
            <Route path="/*" element={<Widget config={config} />} />
          </Routes>
        </Config>
      </I18nProvider>
    </div>
  );
}
