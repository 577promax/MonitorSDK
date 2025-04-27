// document.readyState === 'complete' ?

//{2}
//页面加载完调用observeEvent方法函数
export default function observeEntries() {
  if (document.readyState === "complete") {
    observeEvent();
  } else {
    const onLoad = () => {
      observeEvent();
      window.addEventListener("load", onLoad, true); //没必要冒泡
    };
    window.removeEventListener("load", onLoad, true); 
  }
}

//{1}
export function observeEvent() {
  const entryHandler = (list) => {
    const data = list.getEntries();
    for (let entry of data) {
      if (observer) {
        //停止 PerformanceObserver 对性能条目的监听。
        observer.disconnect();
      }

      //选择entr里你需要的资源进行上报就行
      const reportData = {
        name: entry.name,
        type: "performance",
        subType: entry.entryType,
        sourceType: entry.initiatorType, //资源来源
        duration: entry.duration, //资源加载时间 持续
        //dns解析时间 差值计算
        dns: entry.domainLookupEnd - entry.domainLookupStart,
        tcp: entry.connectEnd - entry.connectStart, //tcp连接时间
        redirect: entry.redirectEnd - entry.redirectStart, //重定向时间
        ttfb: entry.responseStart, //首字节时间，Time to First Byte
        protocol: entry.nextHopProtocol, //请求协议
        responseBodySize: entry.encodedBodySize, //响应内容大小
        responseHeaderSize: entry.transferSize - entry.encodedBodySize, //响应头部大小
        transferSize: entry.transferSize, //请求内容大小（头部+body）
        resourceSize: entry.decodedBodySize, //资源解压后的大小（解码，压解）
        startTime: performance.now(),
      };
      //   console.log(entry);
    }
  };
  let observer = new PerformanceObserver(entryHandler);

  observer.observe({ type: ["resource"], buffered: true });
}
