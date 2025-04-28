import performance from "./performance/index";
import error from "./error/index";
import behavior from "./behavior/index";
import { setConfig } from "./config";

//内部变量，两个杠杠
window.__webMonitorSDK__ = {
    version: '0.0.1',
}

//Vue 以插件的形式开发
export  function install(Vue, options) {
    if (__webMonitorSDK__.vue) return;
    __webMonitorSDK__.vue = true;
    const handler = Vue.config.errorHandler; //Vue官方的errorHandler
    Vue.config.errorHandler = function (err, vm, info) {
        //todo：上报具体数据
        if (handler) {
            handler.call(this, err, vm, info);
        }
    }
}


function errorBoundary(err) {
    if (__webMonitorSDK__.react) return;
    __webMonitorSDK__.react = true;
     //todo：上报具体数据
}

export default {
    install,
    errorBoundary,
    performance,
    error,
    behavior,
    init,
}


export function init(options) {
    setConfig(options);
}

// webMonitorSDK.init({
//     appID: '123'
// })
//当时腾讯地图的SDK封装