module.exports = {
  webpack: function override(config, env) {
    config.module.rules.push({
      test: /.+\.worker\.js/,
      use: { loader: 'worker-loader' },
    });
    return config;
  },
};
