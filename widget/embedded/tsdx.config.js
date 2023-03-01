// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config) {
    config.plugins = config.plugins.filter((plugin) => plugin.name !== 'terser');
    return config; // always return a config.
  },
};
