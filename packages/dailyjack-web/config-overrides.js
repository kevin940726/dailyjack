const babelLoader = (conf) => {
  if (!conf.loader) return false;
  return conf.loader.indexOf('babel-loader') > -1;
};

const rewireEmotion = (config) => {
  const babelrc = config.module.rules.find(babelLoader).options;
  babelrc.plugins = ['emotion/babel'].concat(babelrc.plugins || []);

  return config;
};

module.exports = (config, env) => {
  let override = config;

  override = rewireEmotion(config, env);

  return override;
};
