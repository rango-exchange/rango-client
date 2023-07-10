/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'es', 'jp', 'fr'],
  sourceLocale: 'en',
  format: 'po',
  catalogs: [
    {
      path: '<rootDir>/translations/{locale}',
      include: ['<rootDir>/widget/embedded/src'],
      exclude: ['**/node_modules/**'],
    },
    {
      path: '<rootDir>/translations/{locale}',
      include: ['<rootDir>/widget/ui/src'],
      exclude: ['**/node_modules/**'],
    },
  ],
};
