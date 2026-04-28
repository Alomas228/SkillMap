const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/main.js",

    output: {
        // Собираем сразу в ASP.NET wwwroot
        path: path.resolve(__dirname, "../SkillMap/wwwroot"),
        filename: "bundle.js",
        clean: true,
        publicPath: "/",
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: "asset/resource",
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./auth.html",
            filename: "index.html",
        }),
    ],

    devServer: {
        static: path.resolve(__dirname, "dist"),
        hot: true,
        open: true,
        historyApiFallback: true,
        proxy: [
            {
                context: ["/api"],
                target: "https://localhost:7020",
                changeOrigin: true,
                secure: false,
            },
        ],
    },
};