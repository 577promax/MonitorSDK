
//自己定义的参数
const config = {
    url: 'http://localhost:3000/api/monitor',
    projectName: 'feMonitor', //项目名字
    appID: "123",
    userId: "123",
    isImageUpload: false,
    batchSize: 5, //批量上报的大小
}


export function setConfig(options) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key];
        }
    }
}

export default config;