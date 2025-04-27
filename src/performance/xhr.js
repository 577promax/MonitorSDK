//统计ajax请求时间、ajax，使用axios发送

//axios是封装的xhr
//重写ajax，添加功能

export const originalProto = XMLHttpRequest.prototype;
// export const originalSend = XMLHttpRequest.prototype.send;

//拿到原生send、open方法
export const originalSend = originalProto.send;
export const originalOpen = originalProto.open;

export default function xhr() {
  overwriteSendAndOpen();
}

function overwriteSendAndOpen() {
  // 重写open方法
  // 重写就是为了取url和method
  originalProto.open = function newOpen(...args) {
    this.url = args[1]; //保存url
    this.method = args[0]; //保存请求方法
    originalOpen.apply(this, args); //调用原生open方法
  };

  originalProto.send = function newSend(...args) {
    this.startTime = Data.now(); //保存请求开始时间
    const onLoaded = () => {
      this.endTime = Data.now(); //保存请求结束时间
      this.duration = this.endTime - this.startTime; //计算请求耗时
      // const duration = Data.now() - this.startTime; //计算请求耗时
      const { url, method, startTime, endTime, duration, status } = this; //status是ajax状态

      //我们需要统计的数据
      const reportData = {
        status,
        duration,
        url,
        method: method.toUpperCase(), //请求方法
        startTime,
        endTime,
        type: "performance",
        success: status >= 200 && status < 300, //请求是否成功,200-300认为成功
        subType: "xhr",
      };
      //上报数据 todo
      // report(reportData);

      this.removeEventListener("loadend", onLoaded, true); //移除事件监听
    };
    // loadend 是一个事件，表示一个网络请求（如 XMLHttpRequest 或 fetch）的生命周期结束，无论请求是成功完成、失败还是被取消，都会触发该事件。
    // load：仅在请求成功完成时触发（状态码 200-299）。
    // error：仅在请求失败时触发（如网络错误）。
    // abort：仅在请求被取消时触发。
    // timeout：仅在请求超时时触发。
    // loadend：无论请求成功、失败、取消或超时，都会触发。

    // 这里的loadend是一个资源加载进度停止后被触发（XML的调用、img、video之类）
    this.addEventListener("loadend", onLoaded, true);
    originalSend.apply(this, args);
  };
}
