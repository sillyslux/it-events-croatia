const path = require('path');
const webpack = require('webpack');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config = {
  port: 3001,
  context: path.join(__dirname, 'admin-js'),
  entry: [
    './router.jsx',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3001/',
  ],
  devtool: '#inline-source-map',
  output: {
    path: path.join(__dirname, 'admin'),
    filename: 'admin-bundle.js',
    publicPath: '/admin',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [nodeModulesPath],
        query: { presets: ['es2015', 'react'] },
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: 'admin',
    filename: 'admin-bundle.js',
    publicPath: '/',
    stats: {
      chunks: false,
      colors: true,
    },
    historyApiFallback: true,
  },
};
module.exports = config;
