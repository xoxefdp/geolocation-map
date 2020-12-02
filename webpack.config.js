const path = require('path')
// WEBPACK REQUIRES
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const dvt = require(WEBPACK_COMMON_DIR + '/devtool-level')

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
  devtool: isDev ? DevtoolLevel.SOURCE_MAP : DevtoolLevel.CHEAP_SOURCE_MAP,
  entry: {
    app: SRC_DIR + '/main.js',
  },
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [SRC_DIR, 'node_modules'],
    alias: {
      'vue$': vueBuildType[ buildType ],
      'components': SRC_DIR + '/components',
      'helpers': SRC_DIR + '/helpers',
      'systems': SRC_DIR + '/systems',
      'broadcast': SRC_DIR + '/systems/broadcast',
      'geolocation': SRC_DIR + '/systems/geolocation',
      'network': SRC_DIR + '/systems/network',
      'styles': SRC_DIR + '/styles',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: isDev, // use DEBUG unless process.env.DEBUG is defined
    }),
    new VueLoaderPlugin(),
    new HtmlWebPackPlugin({
      favicon: SRC_DIR + '/favicon.ico',
      template: SRC_DIR + '/index.html',
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: ['vue-loader'],
      },
      {
        test: /\.js$/i,
        use: ['eslint-loader'],
      },
      {
        test: /\.css$/i,
        use: ['vue-style-loader', 'style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/i,
        use: ['file-loader'],
      },
    ],
  },
  devServer: {
    hot: true,
    port: 9000,
    host: '0.0.0.0',
  },
}

console.log('BUILD_TYPE', buildType)
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('DEBUG', isDev)
console.log('devtool', config.devtool)

module.exports = config
