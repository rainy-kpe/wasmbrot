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
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.wasm$/,
        type: "webassembly/experimental"
      }
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js", ".wasm" ]
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "public/*", flatten: true }])
  ],
  externals: [
    "child_process",
    "worker_threads"
  ]
});
