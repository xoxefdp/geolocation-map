const path = require('path')
// WEBPACK REQUIRES
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin')

// FRAMEWORK FOLDERS
const NODE_DIR = path.resolve(__dirname, 'node_modules')
const VUE_DIST_DIR = path.resolve(__dirname, NODE_DIR + '/vue/dist')

// APPLICATION FOLDERS
const SRC_DIR = path.resolve(__dirname, 'src')
const DIST_DIR = path.resolve(__dirname, 'dist')

const isDev = process.env.NODE_ENV === 'development'
const buildType = process.env.BUILD_TYPE

const vueBuildType = {
  umd: isDev // UMD
    ? VUE_DIST_DIR + '/vue.js'
    : VUE_DIST_DIR + '/vue.min.js',
  commonjs: VUE_DIST_DIR + '/vue.common.js', // CommonJS
  bundlers: VUE_DIST_DIR + '/vue.esm.js', // ESM (for bundlers)
  browsers: isDev // ESM (for browsers)
    ? VUE_DIST_DIR + '/vue.esm.browser.js'
    : VUE_DIST_DIR + '/vue.esm.browser.min.js',
}

const DevtoolLevel = {
  NONE: 'none',
  EVAL: 'eval',
  CHEAP_EVAL_SOURCE_MAP: 'cheap-eval-source-map',
  CHEAP_MODULE_EVAL_SOURCE_MAP: 'cheap-module-eval-source-map',
  EVAL_SOURCE_MAP: 'eval-source-map',
  CHEAP_SOURCE_MAP: 'cheap-source-map',
  CHEAP_MODULE_SOURCE_MAP: 'cheap-module-source-map',
  INLINE_CHEAP_SOURCE_MAP: 'inline-cheap-source-map',
  INLINE_CHEAP_MODULE_SOURCE_MAP: 'inline-cheap-module-source-map',
  SOURCE_MAP: 'source-map',
  INLINE_SOURCE_MAP: 'inline-source-map',
  HIDDEN_SOURCE_MAP: 'hidden-source-map',
  NO_SOURCES_SOURCE_MAP: 'nosources-source-map',
}

const config = {
  mode: process.env.NODE_ENV,
  devtool: isDev ? DevtoolLevel.SOURCE_MAP : DevtoolLevel.NONE,
  entry: `${SRC_DIR}/main.js`,
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    sourceMapFilename: '[name].map',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [SRC_DIR, NODE_DIR],
    alias: {
      vue$: vueBuildType[buildType],
      components: `${SRC_DIR}/components`,
      systems: `${SRC_DIR}/systems`,
      geolocation: `${SRC_DIR}/systems/geolocation`,
      permissions: `${SRC_DIR}/systems/permissions`,
      styles: `${SRC_DIR}/styles`,
      assets: `${SRC_DIR}/assets`,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: isDev, // use DEBUG unless process.env.DEBUG is defined
    }),
    new VueLoaderPlugin(),
    new HtmlWebPackPlugin({
      favicon: `${SRC_DIR}/favicon.ico`,
      template: `${SRC_DIR}/index.html`,
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: ['vue-loader'],
        exclude: [
          /\.spec\.js/,
        ],
      },
      {
        test: /\.js$/i,
        use: ['eslint-loader'],
        exclude: [
          /node_modules/,
          /\.spec\.js/,
        ],
      },
      {
        test: /\.css$/i,
        use: ['vue-style-loader', 'style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/img',
        },
      },
    ],
  },
  devServer: {
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    // disableHostCheck: true, // through proxy with domain
    watchOptions: {
      poll: true,
      ignored: ['**/node_modules', '**/dist'],
    },
  },
}
if (!isDev) {
  config.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,
    })],
  }
}

console.log('BUILD_TYPE', buildType)
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('DEBUG', isDev)
console.log('devtool', config.devtool)

module.exports = config
