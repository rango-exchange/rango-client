/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "cs"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "../../locales/{locale}",
      include: ["<rootDir>"],
      exclude: ["**/node_modules/**"],
    },
  ],
  format: "po",
}
