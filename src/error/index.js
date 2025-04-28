import { lazyReportBatch } from "../report";

export default function error() {
  //监听全局的错误事件(只是捕获资源加载的错误：js css img等)
  window.addEventListener(
    "error",
    function (event) {
      // console.log(event);
      //根据target判断一下
      const target = event.target;
      if (!target) {
        //说明不是一个js、css或者图片这些静态资源的错误，应该是纯JS的错误
        return;
      }

      if (target.src || target.href) {
        const url = target.src || target.href;
        //组装要上报的data
        const reportData = {
          type: "error",
          subType: "static resource",
          url,
          // 计算当前时间 - 资源加载时间
          html: target.outerHTML,
          pageUrl: window.location.href,
          paths: event.path, //具体的资源路径
        };
        //todo:上报错误信息
        lazyReportBatch(reportData);
      }
    },
    true
  );

  //捕获真正JS的错误
  window.onerror = function (message, source, lineno, colno, error) {
    const reportData = {
      type: "error",
      subType: "js",
      message,
      source, //url
      lineno,
      colno,
      stack: error && error.stack, //错误堆栈
      pageUrl: window.location.href,
      startTime: performance.now(), //当前时间
    };
    lazyReportBatch(reportData);
  };
  //监听异步错误 promise、async await
  Window.addEventListener(
    "unhandledrejection",
    function (e) {
      const reportData = {
        type: "error",
        subType: "promise",
        reason: e.reason?.stack || e.reason, //存在再取
        pageUrl: window.location.href,
        startTime: performance.now(), //当前时间 e.timeStamp也行
      };
      // todo:上报数据
      lazyReportBatch(reportData);
    },
    true
  );
}
