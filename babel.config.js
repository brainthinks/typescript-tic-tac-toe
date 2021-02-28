/**
 * This babel config file was broken out of the Webpack config file so that
 * it can be used with `jest` and to make things easier for clients who wish
 * to use `src` files.
 *
 * Note that the following "peer" dependencies are required:
 * - `@babel/core`
 * - `babel-loader`
 * - `@babel/runtime-corejs3`
 * - All other `@babel` dependencies listed below
 *
 * @see - https://babeljs.io/docs/en/config-files#config-function-api
 * @see - https://jestjs.io/docs/en/getting-started#using-babel
 * @see - https://jestjs.io/docs/en/webpack
 * @see - https://webpack.js.org/loaders/babel-loader/
 */
module.exports = (api) => {
  const babelConfig = {
    // @see - https://github.com/vuejs/vue-cli/issues/2746
    sourceType: 'unambiguous',
    ignore: [],
    presets: [
      [
        '@babel/preset-env',
        {
          exclude: [
            // Prevents "ReferenceError: _typeof is not defined" error
            '@babel/plugin-transform-typeof-symbol',
          ],
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
    ],
  };

  if (api && api.env('test')) {
    // @todo - is it ok that jest is testing a transpiled version, when that
    // isn't what actually gets used in the browser?
    delete babelConfig.ignore;
  }

  return babelConfig;
};
