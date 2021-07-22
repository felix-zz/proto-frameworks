const path = require('path');

const assetsBase = path.resolve(__dirname, 'demo-dist');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // Demo dev mode only
    entry: {
        'index': './src/demo/index.tsx',
    },
    output: {
        filename: '[name].js?[hash]',
        path: assetsBase,
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        modules: ['src', 'node_modules'],
    },
    devtool: 'inline-source-map',
    watch: true,
    devServer: {
        contentBase: assetsBase,
        port: 18080,
        watchContentBase: true,
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
        }),
    ],
    module: {
        rules: [{
            test: /\.less$/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader',
            }, {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true,
                },
            }],
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ],
        }, {
            test: /\.s[ac]ss$/i,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        }, {
            test: /\.(ts|tsx)$/i,
            use: [{
                loader: 'ts-loader',
                options: {
                    configFile: 'dev.tsconfig.json',
                },
            }],
            exclude: /node_modules/,
        }],
    },
};
