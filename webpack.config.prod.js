const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require('cssnano');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: ['./src/app'],
    // vendor: ['react', 'react-dom', 'react-router', 'redux', 'react-redux', 'react-router-redux'],
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: ['babel-loader'],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            query: {
              includePaths: [
                path.resolve(__dirname, './src/styles'),
                path.resolve(__dirname, './node_module/simple-line-icons/sass'),
              ],
              sourceMap: true,
              sourceMapContents: true,
            }
          }
        ]
      },
    ],
  },

  resolve: {
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react'),
      'components': path.join(__dirname, './src/components'),
      'layouts': path.join(__dirname, './src/layouts'),
      'views': path.join(__dirname, './src/views'),
      'utils': path.join(__dirname, './src/utils'),
      'styles': path.join(__dirname, './src/styles'),
      'docs': path.join(__dirname, './src/docs'),
    },
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: false,
      __DEVTOOLS__: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: '/',
        sassLoader: {
          includePaths: [path.resolve(__dirname, './src/styles')]
        },
        postcss: [
          cssnano({
            sourcemap: true,
            autoprefixer: {
              add: true,
              remove: true,
              browsers: ['last 2 version'],
            },
            discardComments: {
              removeAll: true,
            },
          }),
        ],
      }
    }),
  ],
};
