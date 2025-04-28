const path = require("path");
const json = require("@rollup/plugin-json");  //json转es6
const { babel } = require("@rollup/plugin-babel");  //转换高级语法
const resolveFile = function (filePath) {
    return path.join(__dirname, filePath);
};

//打包用到的插件
const plugins = [
    json({
        compact: true,
    }),
    babel({
        extensions: [".js", ".ts"],
        babelHelpers: "bundled",
        presets: [
            [
                "@babel/env",
                {
                    targets: {
                        browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
                    },
                },
            ],
        ],
    }),
];
module.exports = [
    {
        plugins,
        input: resolveFile("../src/webMonitorSDK.js"),
        output: {
            file: resolveFile("../dist/monitor.js"),
            format: "iife",  //适合在JavaScript标签直接使用，全局变量方式
            name: "monitor",
            sourcemap: true,
        },
    },
    {
        plugins,
        input: resolveFile("../src/webMonitorSDK.js"),
        output: {
            file: resolveFile("../dist/monitor.esm.js"),
            format: "esm",  //es6环境
            name: "monitor",
            sourcemap: true,
        },
    },
    {
        plugins,
        input: resolveFile("../src/webMonitorSDK.js"),
        output: {
            file: resolveFile("../dist/monitor.cjs.js"),
            format: "cjs",  //nodejs环境
            name: "monitor",
            sourcemap: true,
        },
    },
];
