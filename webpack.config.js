'use strict';

const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const packageJson = require('./package.json');
const babelConfig = require('./babel.config')();

/**
 * Generate a webpack configuration object.  The resulting configuration object
 * is currently suitable for all files this project exports.
 *
 * @see - https://webpack.js.org/configuration/
 *
 * @param {String} name
 *   The entry name, which will be used to construct the file name
 * @param {String} entry
 *   The entry point for the webpack configuration - must point to a single file
 *
 * @returns {Object}
 *   A webpack configuration object
 */
function generateConfig (name, entry) {
  return {
    mode: 'development',
    name,
    entry: {
      // @see - https://github.com/webpack-contrib/webpack-serve/issues/27
      [name]: [
        entry,
      ],
    },
    output: {
      path: path.resolve(
        __dirname,
        'dist',
      ),
      filename: '[name].[contenthash].js',
    },
    resolve: {
      extensions: [
        '.tsx',
        '.ts',
        '.js',
      ],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                ...babelConfig,
                cacheDirectory: true,
              },
            },
          ],
          exclude: /(node_modules|bower_components)/,
          // @see - https://github.com/webpack/webpack/issues/2031
          include: [
            path.resolve(
              __dirname,
              'src',
            ),
          ],
        },
        // @see - https://github.com/bensmithett/webpack-css-example/blob/master/webpack.config.js
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'url-loader',
        },
        {
          // @see - https://github.com/webpack-contrib/mini-css-extract-plugin
          // @see - https://github.com/webpack-contrib/sass-loader
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            // @todo
            // 'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        alwaysWriteToDisk: true,
        filename: path.resolve(
          __dirname,
          'dist',
          'index.html',
        ),
        template: 'src/index.html',
      }),
      // new HtmlWebpackHarddiskPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      }),
    ],
    devServer: {
      contentBase: path.join(
        __dirname,
        'dist',
      ),
      compress: true,
      port: 9000,
    },
  };
}

const configs = [
  generateConfig(
    packageJson.name,
    path.resolve(
      __dirname,
      'src',
      'index.ts',
    ),
  ),
];

module.exports = configs;
