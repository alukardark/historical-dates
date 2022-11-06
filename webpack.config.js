const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = !isDevelopment;
const isReport = !isDevelopment;

const filename = (ext) =>
  isDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`;

module.exports = {
  target: "web",
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: {
    main: "./assets/js/index.ts",
    // analytics: "./assets/js/analytics.js",
  },
  output: {
    filename: "assets/js/" + filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".png"],
    alias: {
      "@models": path.resolve(__dirname, "src/models"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendor",
    },
  },
  devServer: {
    port: 9000,
    hot: isDevelopment,
    static: {
      directory: path.join(__dirname, "src"),
    },
  },
  devtool: isDevelopment ? "source-map" : false,
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: false,
      },
    }),
    new CleanWebpackPlugin(),

    // ---Копирование из одной папки в другую
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "src/assets/img"),
    //       to: path.resolve(__dirname, "dist/assets/img"),
    //     },
    //   ],
    // }),
    new MiniCssExtractPlugin({
      filename: "styles/" + filename("css"),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.NODE_ENV === "report" ? "static" : "disabled",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "less-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name][ext][query]",
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext][query]",
        },
      },
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },


        {
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },




    ],
  },
};
