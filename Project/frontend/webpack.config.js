const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', 
                    ["@babel/preset-react", {"runtime": "automatic"}]
                ]
                }
            }
        }],
    },
    plugins: [new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html'
    }),
    new CopyPlugin({
        patterns: [
            { from: "public/manifest.json" },
        ],
    }),


    ],
};