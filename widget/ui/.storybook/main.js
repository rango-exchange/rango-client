import { dirname, join } from "path";
module.exports = {
  stories: ['../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-essentials")],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true // type-check stories during Storybook build
  },

  features: {
    storyStoreV7: true
  },
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },
  docs: {
    autodocs: true,
    reactDocgen: false
  }
};
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}