const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin') // require('vue-loader')

const DIST_DIR = path.resolve(__dirname, 'dist')
const SRC_DIR = path.resolve(__dirname, 'src')
// const NODE_DIR = path.resolve(__dirname, 'node_modules')

const config = {
  devtool: 'source-map',
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
      // 'vue$': isDev ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
      'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1
      main: SRC_DIR
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin({ DEBUG: true }),
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
        use: [
          {
            loader: 'vue-loader',
            // exclude: [ NODE_DIR ],
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader',
            // exclude: [ NODE_DIR ],
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.css$/i,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/i,
        use: [
          {
            loader: 'file-loader',
            // exclude: [ NODE_DIR ],
            options: { sourceMap: true }
          }
        ]
      }
    ]
  },
  devServer: {
    hot: true,
    port: 9000
  }
};

module.exports = config
