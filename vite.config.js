import { defineConfig } from "vite";
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default defineConfig({
    base: '/monthyly-expenditure-visualisation/',
    configureWebpack: (config) => {
        config.plugins.push(
            new CopyWebpackPlugin({
                patterns: [
                    { from: '/assets', to: 'dist/assets' },
                ],
            })
        );
    },
});