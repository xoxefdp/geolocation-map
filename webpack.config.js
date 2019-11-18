const path = require('path')
const Webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const DIST_DIR = path.resolve('dist')
const SRC_DIR = path.resolve('src')
// const NODE_DIR = path.resolve(__dirname, 'node_modules')

const config = {
  entry: {
    app: SRC_DIR + '/main.js'
  },
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  plugins: [
    new Webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: SRC_DIR + '/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    hot: true,
    port: 9000
  }
};

module.exports = config
