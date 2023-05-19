import React, { PropsWithChildren, useEffect } from 'react';
import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { defaultLocale, dynamicActivate } from './i18n';

function Provider({ children }: PropsWithChildren) {
  useEffect(() => {
    // With this method we dynamically load the catalogs
    dynamicActivate(defaultLocale);
  }, []);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
export default Provider;
