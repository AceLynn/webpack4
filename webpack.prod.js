"user strict";

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// 打包速度分析插件
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
// 体积大小分析插件
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
// 多进程压缩打包
const TerserWebpackPlugin = require("terser-webpack-plugin");

const smp = new SpeedMeasureWebpackPlugin();

// 多页面打包配置
const glob = require("glob");
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  Object.keys(entryFiles).map(index => {
    const entryFile = entryFiles[index];

    // entryfile 'F:/wamp/www/study/webpack/my-project/src/index/index.js'
    // 正则匹配规则
    const match = entryFile.match(/src\/(.*)\/index\.js/);

    const pageName = match && match[1];

    entry[pageName] = entryFile;
    // entry[pageName] = match && match[0];
    // console.log('match:', match);

    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        // 一个页面对应一个hwp 有更简单的写法
        // hwp提供的html模板
        template: path.join(__dirname, `src/${pageName}/index.html`),
        // 打包出来的html文件名称
        filename: `${pageName}.html`,
        // html生成后使用哪些chunks
        chunks: ["vendors", pageName],
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
      })
    );
  });

  return {
    entry,
    htmlWebpackPlugins
  };
};
// setMPA();
const { entry, htmlWebpackPlugins } = setMPA();

// console.log(entry, htmlWebpackPlugins)
// console.log(htmlWebpackPlugins)

// 打包速度分析插件
module.exports = smp.wrap({
  entry: entry,
  output: {
    // __dirname webpack配置文件是所在目录
    path: path.join(__dirname, "dist"),
    filename: "[name]_[chunkhash:8].js"
  },
  mode: "production",
  // mode: "none",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 3
            }
          },
          "babel-loader"
          //  "eslint-loader"
        ]
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
                require("autoprefixer")({
                  // 兼容到浏览器最近2个版本，浏览器占有率，兼容到ios7
                  // 该配置目前调整到package.json里面的browserslist属性中，赋值与browsers一样
                  // browsers: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          },
          // px2rem-loader的配置使用
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75, // 1rem=75px; 750px设计稿
              // px->rem后的小数点位数
              remPrecision: 8
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
      }
      // autoprefixer postcss-loader
      // {
      //   test: /.css$/,
      //   use
      // }
    ]
  },
  plugins: [
    // new webpack.optimize.ModuleConcatenationPlugin(),
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
    // 优化构建提示文本
    new FriendlyErrorsWebpackPlugin(),
    // 主动捕获构建错误
    function() {
      this.hooks.done.tap("done", stats => {
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf("--watch") == -1
        ) {
          console.log("build error");
          process.exit(1);
        }
      });
    },
    // new HtmlWebpackPlugin({
    //   // 一个页面对应一个hwp 有更简单的写法
    //   // hwp提供的html模板
    //   template: path.join(__dirname, "src/index.html"),
    //   // 打包出来的html文件名称
    //   filename: "index.html",
    //   // html生成后使用哪些chunks
    //   chunks: ["index"],
    //   // js，css会自动加入到html里面
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false
    //   }
    // }),
    // new HtmlWebpackPlugin({
    //   // 一个页面对应一个hwp
    //   // hwp提供的html模板
    //   template: path.join(__dirname, "src/search.html"),
    //   // 打包出来的html文件名称
    //   filename: "search.html",
    //   // html生成后使用哪些chunks
    //   chunks: ["search"],
    //   // js，css会自动加入到html里面
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false
    //   }
    // }),
    new CleanWebpackPlugin(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
    //       global: 'ReactDOM'
    //     }
    //   ]
    // })
    new BundleAnalyzerPlugin()
  ].concat(htmlWebpackPlugins),
  stats: "errors-only",
  // devtool: 'inline-source-map',
  optimization: {
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       test: /(react|react-dom)/,
    //       name: "vendors",
    //       chunks: "all"
    //     }
    //   }
    // }
    // 并行压缩
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true
      })
    ],
    splitChunks: {
      minSize: 10000,
      cacheGroups: {
        commons: {
          name: "common",
          chunks: "all",
          minChunks: 2
        }
      }
    }
  }
});
