const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry:  './src/app.js',
  output: {
    filename: 'app.js',
    path:     path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash:     true,
      inject:   true,
      minify:   {
        removeComments:        true,
        collapseWhitespace:    true,
        removeAttributeQuotes: true,
      },
    }),
    new ExtractTextPlugin('app.css'),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader:         [ 'css-loader', 'postcss-loader' ],
        }),
      },
      {
        test:    /\.svg$/,
        loader:  'url-loader',
        options: { limit: 100000 },
      },
      {
        test:    /\.js$/,
        exclude: /node_modules/,
        loader:  'babel-loader',
        options: { babelrc: true },
      }
    ],
  },
};
