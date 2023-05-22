/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'cs'],
  sourceLocale: 'en',
  format: 'po',
  //   rootDir: '.',
  catalogs: [
    {
      path: '<rootDir>/translations/embedded/{locale}',
      include: ['<rootDir>/widget/embedded/src'],
      exclude: ['**/node_modules/**'],
    },
    {
      path: '<rootDir>/translations/ui/{locale}',
      include: ['<rootDir>/widget/ui/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
};
