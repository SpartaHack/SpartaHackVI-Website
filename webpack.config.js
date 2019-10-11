const path = require('path');

const nodeExternals = require("webpack-node-externals"); // bug fix
const WebpackMd5Hash = require("webpack-md5-hash");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: { main: './src/js/index.js' },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].js'
    },

    module: {
      rules: [
          {
              test: "/\.js$/",
              exclude: /node_modules/,
              use: {
                  loader: "babel-loader",
                  options: {
                  presets: ["env"]
                  }
              }
          },
        {
          test: /\.scss$/,
          use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
        },
          
        {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: './assets/[name].[ext]?[hash]',
                }
              }
            ]
        },
        {
          test: /\.ico$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
              }
            }
          ]
      }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'main.[contenthash].css',
      }),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: './src/index.html',
        filename: 'index.html'
      }),
      new WebpackMd5Hash()
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
      host: '0.0.0.0'
    },
    watchOptions: {
      aggregateTimeout: 600
    }
  };