"user strict";

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js",
    search: "./src/search.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]_[chunkhash:8].js"
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      },
      {
        test: /.css$/,
        use: [
          // 和mini插件互斥
          //   'style-loader',
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require('autoprefixer') ({
                  // 兼容到浏览器最近2个版本，浏览器占有率，兼容到ios7
                  // 该配置目前调整到package.json里面的browserslist属性中，赋值与browsers一样
                  // browsers: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          }
        ]
      },
      // file-loader 加载资源
      {
        test: /.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]"
            }
          }
        ]
      },
      // autoprefixer postcss-loader
      // {
      //   test: /.css$/,
      //   use
      // }
    ]
  },
  plugins: [
    // css抽取插件
    new MiniCssExtractPlugin({
      filename: "[name]_[contentHash:8].css"
    }),
    // css压缩插件 目前测试sass样式经过抽取插件抽离后，本身就会压缩
    // 单独css需要以下插件进行压缩。或者加入sass-loader
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano")
    }),
    new HtmlWebpackPlugin({
      // 一个页面对应一个hwp 有更简单的写法
      // hwp提供的html模板
      template: path.join(__dirname, "src/index.html"),
      // 打包出来的html文件名称
      filename: "index.html",
      // html生成后使用哪些chunks
      chunks: ["index"],
      // js，css会自动加入到html里面
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new HtmlWebpackPlugin({
      // 一个页面对应一个hwp
      // hwp提供的html模板
      template: path.join(__dirname, "src/search.html"),
      // 打包出来的html文件名称
      filename: "search.html",
      // html生成后使用哪些chunks
      chunks: ["search"],
      // js，css会自动加入到html里面
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new CleanWebpackPlugin()
  ]
};
