module.exports = function override(config, env) {
  // Suppress face-api.js source map warnings
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    {
      module: /face-api\.js/,
      message: /Failed to parse source map/
    }
  ];

  return config;
};