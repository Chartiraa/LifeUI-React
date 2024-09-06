module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Mevcut react-grid-layout ayarını koru
            webpackConfig.module.rules.push({
                test: /\.js$/,
                include: /node_modules\/react-grid-layout/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-proposal-optional-chaining',
                            '@babel/plugin-proposal-nullish-coalescing-operator',
                        ],
                    },
                },
            });

            // Chart.js ve diğer modern JavaScript özelliklerini destekle
            webpackConfig.module.rules.push({
                test: /\.js$/,
                exclude: /node_modules[\\/](?!chart\.js)/, // chart.js hariç tüm node_modules'ü dışla
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-transform-class-properties', // Güncel eklenti
                            '@babel/plugin-proposal-optional-chaining',
                            '@babel/plugin-proposal-nullish-coalescing-operator',
                        ],
                    },
                },
            });

            return webpackConfig;
        },
    },
};
