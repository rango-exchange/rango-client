import { i18n } from '@lingui/core';

export const locales = {
  en: 'English',
  cs: 'Česky',
};
export const defaultLocale = 'en';

// CRA mark all resources which are not JS as 'asset/resource'
// Since we don't have access to the webpack config here is a dirty
// way to avoid this limitation.
// https://github.com/webpack/webpack/pull/10097#issuecomment-567116011

// Unfortunately this workaround dosent work with dynamic loading
// so we have to explicitly enumerate all catalogs here.
const loadCatalog = async locale => {
  return import(
    /* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
    `../../locales/${locale}.js`
  );
};

/**
 * We do a dynamic import of just the catalog that we need
 * @param locale any locale string
 */
export async function dynamicActivate(locale: string) {
  const messages = await loadCatalog(locale as any);
  i18n.loadAndActivate({ locale, messages });
}

// If not we can just load all the catalogs and do a simple i18n.active(localeToActive)
// i18n.load({
//   en: messagesEn,
//   cs: messagesCs,
// });
