const path = require('path')
// WEBPACK REQUIRES
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
// const dvt = require(WEBPACK_COMMON_DIR + '/devtool-level')

// FRAMEWORK FOLDERS
const NODE_DIR = path.resolve(__dirname, 'node_modules')
const VUE_DIST_DIR = path.resolve(__dirname, NODE_DIR + '/vue/dist')
// const WEBPACK_COMMON_DIR = path.resolve(__dirname, 'webpack')

// APPLICATION FOLDERS
const SRC_DIR = path.resolve(__dirname, 'src')
const DIST_DIR = path.resolve(__dirname, 'dist')

const isDev = process.env.NODE_ENV === 'development'

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
  NOSOURCES_SOURCE_MAP: 'nosources-source-map'
}

const config = {
  devtool: isDev ? DevtoolLevel.SOURCE_MAP : DevtoolLevel.CHEAP_SOURCE_MAP,
  entry: {
    app: SRC_DIR + '/main.js'
  },
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [ '.js', '.vue' ],
    alias: {
      // 'vue$': isDev ? VUE_DIST_DIR + '/vue.common.js' : VUE_DIST_DIR + '/vue.runtime.common.js', // CommonJS
      'vue$': isDev ? VUE_DIST_DIR + '/vue.esm.js' : VUE_DIST_DIR + '/vue.runtime.esm.js', // ESM (for bundlers)
      // 'vue$' : isDev ? VUE_DIST_DIR + '/vue.esm.browser.js' : VUE_DIST_DIR + '/vue.esm.browser.min.js', // ESM (for browsers)
      components: SRC_DIR + '/components',
      helpers: SRC_DIR + '/helpers',
      systems: SRC_DIR + '/systems',
      broadcast: SRC_DIR + '/systems/broadcast',
      geolocation: SRC_DIR + '/systems/geolocation',
      styles: SRC_DIR + '/styles'
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV // use 'development' unless process.env.NODE_ENV is defined
    }),
    new webpack.DefinePlugin({
      DEBUG: isDev // use DEBUG unless process.env.DEBUG is defined
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebPackPlugin({
      template: SRC_DIR + '/index.html',
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: [ 'vue-loader' ]
      },
      {
        test: /\.js$/i,
        use: [ 'babel-loader' ]
      },
      {
        test: /\.css$/i,
        use: [ 'vue-style-loader', 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        use: [ 'file-loader' ]
      }
    ]
  },
  devServer: {
    hot: true,
    port: 9000
  }
};

console.log('NODE_ENV', process.env.NODE_ENV)
console.log('DEBUG', isDev)
console.log('devtool', config.devtool)

module.exports = config
