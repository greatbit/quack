const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      $: "jquery",
      _: "lodash",
      ReactDOM: "react-dom",
      cssModule: "react-css-modules",
      Promise: "bluebird",
    }),
  ],
};
