const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "babel-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            { test: /.s?css$/, use: [
                MiniCssExtractPlugin.loader,
                { loader: "css-loader", options: {
                    modules: true,
                    localIdentName: "[name]-[hash:6]",
                    importLoaders: 1,
                    camelCase: true
                }},
                "sass-loader"
            ] }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "redux": "Redux",
        "react-redux": "ReactRedux",
    },

    plugins: [
        //new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html"
        })
    ]
};