/**
 * Created by haoweirui
 * modified on 2017/8/22
 */
const path = require('path');
const webpack = require('webpack');

//单独打包css
const extractTextPlugin = require('extract-text-webpack-plugin');
// const extractLESS = new extractTextPlugin('css/index.[contenthash:6].css');

//自动上传到服务器
const WebpackSftpClient = require('webpack-sftp-client');
//单独处理生成html
const htmlWebpackPlugin = require('html-webpack-plugin');
//生成日期标志
const buildTime = new Date().toLocaleString();
//编译之前清理目录
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        vendor:["./example/test.js"]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].[chunkhash:6].js",
        chunkFilename: 'js/[name].[chunkhash:6].js',
        publicPath: ""
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)?$/,
                loader: "babel-loader",
                options: {
                    plugins: ["transform-runtime", ["import", { "libraryName": "antd"}]],
                    presets: ["es2015","react"]
                },
                exclude: /node_modules/
            },
            // {
            //     test: /\.less$/,
            //     use: extractLESS.extract(['css-loader', 'postcss-loader', 'less-loader'])
            // },
            // {
            //     test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/,
            //     loader: "url-loader",
            //     query: {
            //         name: "image/cssImg/[hash].[ext]",
            //         limit: 5000,
            //         publicPath:"../"
            //     }
            // }

        ]
    },
    plugins: [
        // extractLESS,
        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         postcss: [
        //             require('autoprefixer')
        //         ]
        //     }
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name : "vendor"
        }),
        new htmlWebpackPlugin({
          title: buildTime,
          filename: 'index.html',
          template: "./example/index.html"
        }),
        new webpack.BannerPlugin("The file is created by innovationer--"+ new Date()),
       
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'developer')
        }),
        new CleanWebpackPlugin(['dist/js/*.js*','dist/css/*.css*','dist/image/cssImg/*']),
        //
        // new WebpackSftpClient({
        //     port: '22',
        //     host: '172.16.16.30',
        //     username: 'tian',
        //     password: '51talk',
        //     path: './dist/',
        //     remotePath: '/var/www/html/Mebutoo2/web',
        //     verbose: true
        // }),
        //new webpack.optimize.UglifyJsPlugin()
    ]
};