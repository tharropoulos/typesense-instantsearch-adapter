const path = require("path");
const clonedeep = require("lodash.clonedeep");

const browserMinifiedConfiguration = {
  name: "browser-min",
  entry: path.resolve(__dirname, "./src/TypesenseInstantsearchAdapter.js"),
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "typesense-instantsearch-adapter.min.js",
    library: {
      name: "TypesenseInstantSearchAdapter",
      type: "umd",
      export: "default",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};

const browserUnminifiedConfiguration = clonedeep(browserMinifiedConfiguration);
browserUnminifiedConfiguration.name = "browser-dev";
browserUnminifiedConfiguration.mode = "development";
browserUnminifiedConfiguration.output.filename = "typesense-instantsearch-adapter.js";

const nodeBaseConfiguration = {
  entry: path.resolve(__dirname, "./src/TypesenseInstantsearchAdapter.js"),
  target: "node",
  mode: "development",
  devtool: "source-map",
  externalsPresets: {
    node: true,
  },
  optimization: {
    minimize: false,
  },
};

const nodeCjsConfiguration = {
  ...nodeBaseConfiguration,
  name: "node-cjs",
  externalsType: "commonjs",
  externals: {
    typesense: "typesense",
  },
  output: {
    path: path.resolve(__dirname, "./lib"),
    filename: "TypesenseInstantsearchAdapter.cjs",
    library: {
      type: "commonjs2",
      export: "default",
    },
    chunkFormat: "commonjs",
    chunkLoading: false,
  },
};

module.exports = [nodeCjsConfiguration, browserMinifiedConfiguration, browserUnminifiedConfiguration];
