

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

export default {
    install,
}