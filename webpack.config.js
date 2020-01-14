const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const nodeExternals = require("webpack-node-externals"); // bug fix
const WebpackMd5Hash = require("webpack-md5-hash");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: { 
      main: './src/js/index.js', 
      // apps: './src/js/applications/main.js', 
      // dashboard: './src/js/dashboard.js',
      navFooter: './src/js/navFooter.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].js'
    },
    node: {fs: "empty"},
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
          {test: "/\.json$/", loader: "json-loader"},
        {
          test: /\.scss$/,
          use:  [  MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
        filename: '[name].[hash].css'
        // chunkFilename: '[id].css'
      }),
      new CopyPlugin(
        [{ from: './src/js/data/out', to: 'data' }]
      ),
      new HtmlWebpackPlugin({
        inject: false,
        hash: true,
        template: './src/index.html',
        filename: 'index.html'
      }),
      // new HtmlWebpackPlugin({
      //   inject: false,
      //   hash: true,
      //   template: './src/application.html',
      //   filename: 'application.html'
      // }),
      // new HtmlWebpackPlugin({
      //   inject: false,
      //   hash: true,
      //   template: './src/dashboard.html',
      //   filename: 'dashboard.html'
      // }),
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