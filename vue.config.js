const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_GOOGLE_MAPS_API_KEY: JSON.stringify(process.env.VUE_APP_GOOGLE_MAPS_API_KEY)
        }
      })
    ]
  }
};
