const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const CracoAlias = require('craco-alias');

process.env.BROWSER = 'none';

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Remove or modify the Prettier plugin
      webpackConfig.plugins = webpackConfig.plugins.filter(plugin => 
        !(plugin.constructor && plugin.constructor.name === 'PrettierPlugin')
      );
      return webpackConfig;
    },
    plugins: [
      new WebpackBar({ profile: true }),
      ...(process.env.NODE_ENV === 'development' ? [new BundleAnalyzerPlugin({ openAnalyzer: false })] : []),
    ],
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        // baseUrl SHOULD be specified
        // plugin does not take it from tsconfig
        baseUrl: './src/',
        /* tsConfigPath should point to the file where "baseUrl" and "paths"
         are specified*/
        tsConfigPath: './tsconfig.paths.json',
      },
    },
  ],
};