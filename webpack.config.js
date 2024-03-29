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
const DEV_SERVER_PORT = process.env.NODE_HOST_PORT || 3000
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
  NONE: undefined,
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
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].chunk.js',
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
    new webpack.HotModuleReplacementPlugin(),
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
        use: [
          { loader: 'vue-loader' },
        ],
        exclude: [
          /node_modules/,
        ],
      },
      {
        test: /\.js$/i,
        use: [
          { loader: 'babel-loader' },
          { loader: 'eslint-loader' },
        ],
        exclude: [
          /node_modules/,
        ],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: 'vue-style-loader' },
          { loader: 'css-loader' }, // appends require to css files
          // { loader: 'style-loader' }, // inserts css styles on html
          { loader: 'postcss-loader' },
        ],
        exclude: [
          /node_modules/,
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/img',
          esModule: false,
        },
      },
    ],
  },
  devServer: {
    allowedHosts: 'all',
    compress: true,
    hot: true,
    port: DEV_SERVER_PORT,
    client: {
      logging: 'log',
      overlay: true,
      webSocketURL: 'ws://0.0.0.0/ws',
    },
    static: {
      directory: SRC_DIR,
      watch: {
        usePolling: true,
        ignored: ['**/node_modules', '**/dist'],
      },
    },
    watchFiles: {
      paths: [SRC_DIR],
      options: {
        usePolling: true,
        ignored: ['**/node_modules', '**/dist'],
      },
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
console.log('NODE_HOST_PORT', DEV_SERVER_PORT)

module.exports = config
