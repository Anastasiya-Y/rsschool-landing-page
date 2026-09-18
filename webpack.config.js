const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
    const isDev = env.mode === 'development';

    return {
        mode: env.mode ?? 'development',
        entry: path.resolve(__dirname, 'source/js', 'index.js'),
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'js/main.js',
            clean: true
        },
        optimization: {
            minimize: false
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new MiniCssExtractPlugin( {
                filename: 'css/style.css'
            }),
            new CopyPlugin({
                patterns: [
                  { from: 'source/img', to: 'img' },
                  { from: 'source/fonts', to: 'fonts' },
                  { from: 'source/public' },
                  { from: 'source/favicon', to: 'favicon' },
                  { from: 'source/video', to: 'video' },
                ],
              }),
        ],
        module: {
            rules: [
              {
                test: /\.s[ac]ss$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                                sassOptions: { outputStyle: 'expanded' }
                            }
                        },
                    ],
                },
                {
                    test: /\.html$/i,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2)$/i,
                    type: 'asset/resource',
                    generator: {
                      filename: 'fonts/[name][ext]'
                    }
                },
                {
                    test: /\.(png|jpg|jpeg)$/i,
                    type: 'asset/resource',
                    generator: {
                      filename: 'img/content/[name][ext]'
                    }
                },
                {
                    test: /\.svg$/i,
                    type: 'asset/resource',
                    generator: {
                      filename: 'img/svg/[name][ext]'
                    }
                }
            ],
        },
        watch: isDev,
        devtool: 'source-map',
        devServer: isDev ? {
            open: true,
        } : undefined,
    }
}
