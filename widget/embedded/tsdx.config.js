// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
    // This function will run for each entry/format/env combination
    rollup(config, options) {
        console.log("tsdx config", config, options)
      return config; // always return a config.
    },
  };