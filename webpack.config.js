const path = require('path');

module.exports = {
  entry: './app/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.sass$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  watchOptions: {
    poll: 1000,
	ignored: /node_modules/
  }
}
