'user strict';

const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        chunks: [pageName],
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

module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    // mode: 'production',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /.scss$/,
                use: [
                    'style-loader', 'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: "file-loader"
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin()
    ].concat(htmlWebpackPlugins),
    devServer: {
        contentBase: './dist',
        hot: true
    },
    devtool: 'cheap-source-map'
};