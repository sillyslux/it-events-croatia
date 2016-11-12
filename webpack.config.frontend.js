const path = require('path');
const webpack = require('webpack');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const DEBUG = process.env.NODE_ENV !== 'production';

module.exports = {
  port: 3000,
  context: path.join(__dirname, 'gh-pages-js'),
  entry: [
    './router.jsx',
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:3000/',
  ],
  devtool: 'source-map',
  output: {
    path: '/gh-pages',
    filename: 'frontend-bundle.js',
    publicPath: '/',
  },
  module: {
    preLoaders: [
      { test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/ },
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [nodeModulesPath],
        query: {
          presets: [
            'es2015',
            'react',
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  eslint: {
    failOnWarning: false,
    failOnError: true,
  },
  devServer: {
    contentBase: 'gh-pages',
    filename: 'frontend-bundle.js',
    publicPath: '/',
    stats: {
      chunks: false,
      colors: true,
    },
    proxy: {
      '/admin': {
        target: {
          host: 'localhost',
          protocol: 'http:',
          port: 3001,
        },
        pathRewrite: {
          '^/admin': '',
        },
      },
    },
    historyApiFallback: {
      index: '404.html',
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
      ],
    },
  },
};
