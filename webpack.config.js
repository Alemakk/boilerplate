const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const env = process.env.NODE_ENV

module.exports = {
  entry: {
    home: './src/assets/scripts/home.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  resolve: {
    alias: {
      vue$:
        env === 'development' ? 'vue/dist/vue.esm.js' : 'vue/dist/vue.min.js'
    }
  },
  devtool: env === 'development' ? '#eval-source-map' : ''
}
