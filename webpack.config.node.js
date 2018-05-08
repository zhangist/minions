const fs = require("fs");
const path = require("path");

const isDev = process.env.NODE_ENV === "production" ? false : true;

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    mode: isDev ? "development" : "production",
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    context: __dirname,
    entry: {
        server: "./src/server.ts",
        client: "./src/client.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    externals: nodeModules,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    compilerOptions: {
                        target: "es6",
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
    },
};
