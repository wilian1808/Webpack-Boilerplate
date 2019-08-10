const RemoveFilesWebpackPlugin = require('remove-files-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ImageMinPlugin = require('imagemin-webpack')
const autoprefixer = require('autoprefixer')
const path = require('path')

module.exports = {
  entry: {
    js: './src/index.js'
  },
  output: {
    filename: 'js/[name].[chunkhash].js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        use: [
          'file-loader?name=/[name].[ext]',
          'json-loader'
        ] 
      },
      {
        test: /\.pug$/,
        use: {
          loader: 'pug-loader',
          options: {
            pretty: true
          }
        }
      },{
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader?minimize&sourceMap',
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browser: ['last 2 versions']
              },
              sourceMap: true,
              plugins: () => [autoprefixer]
            }
          },
          'resolve-url-loader',
          'sass-loader?outputStyle=compressed&sourceMap'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/img/[name].[ext]',
              useRelativePath: true,
              useAbsolutePath: true
            }
          },
          'image-webpack-loader?bypassOnDebug',
        ]
      },
      {
        test: /\.(ttf|eof|woff2?|mp4|mp3|txt|xml|pdf)$/i,
        use: 'file-loader?name=assets/[name].[ext]'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist/**/**/*.*']),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      template: './src/views/nosotros/index.pug',
      filename: 'nosotros/index.html',
      chunks: ['js']
    }),

    new HtmlWebpackPlugin({
      template: './src/views/index.pug',
      filename: 'index.html',
      chunks: ['js']
    }),
    new WebpackPwaManifest({
      name: '----',
      short_name: '----',
      description: '----',
      orientation: 'portrait',
      display: 'standalone',
      start_url: 'index.html?utm=homescreen',
      scope: './',
      lang: 'es',
      background_color: '#444444',
      theme_color: '#cd3f3e',
      icons: [
        {
          destination: './assets/icons',
          src: path.resolve('src/assets/img/boilerplate.png'),
          sizes: [16, 32, 64, 96, 128, 192, 256, 384, 512, 1024],
          type: 'image/png',
        }
      ]
    }),
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js'
    }),
    new ImageMinPlugin({
      name: '[name].[ext]',
      bail: false,
      cache: true,
      imageminOptions: {
        plugin: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false
                }
              ]
            }
          ]
        ]
      }
    }),
    new RemoveFilesWebpackPlugin({
      after: {
        test: [
          {
            folder: 'dist',
            method: (filePath) => {
              return new RegExp(/\.(png|jpg|jpeg|webp|git)$/i, 'm').test(filePath)
            }
          },
        ]
      }
    })
  ]
}
