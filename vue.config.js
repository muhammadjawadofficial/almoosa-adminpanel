module.exports = {
    baseUrl: "/",
    publicPath: "/",
    outputDir: "dist/almoosa-adminpanel",
    devServer: {
        disableHostCheck: true
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: /node_modules\/@zoom\/videosdk/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        }
    }
};
