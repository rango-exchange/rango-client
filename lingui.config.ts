/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'es', 'ja', 'fr', 'pt', 'zh', 'ru', 'de', 'uk', 'sv', 'fi', 'nl', 'el', 'it', 'pl'],
  sourceLocale: 'en',
  format: 'po',
  catalogs: [
    {
      path: '<rootDir>/translations/{locale}',
      include: ['<rootDir>/widget/embedded/src', '<rootDir>/widget/ui/src'],
      exclude: ['**/node_modules/**'],
    }
  ],
  rootDir: '.',
};
