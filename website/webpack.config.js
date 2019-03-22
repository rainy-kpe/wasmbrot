const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = env => ({
  entry: "./src/bootstrap.js",
  mode: env === "prod" ? "production" : "development",
  devtool: env === "prod" ? "none" : "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js", ".wasm" ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "public/*", flatten: true }])
  ],
});
