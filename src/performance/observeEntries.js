// document.readyState === 'complete' ?

//{2}
//页面加载完调用observeEvent方法函数

// document.readyState 是一个表示文档加载状态的属性，可能的值包括：
// "loading"：文档仍在加载。
// "interactive"：文档已加载完成，文档已被解析，但子资源（如图片、样式表等）可能尚未加载完成。
// "complete"：文档和所有子资源都已加载完成
export default function observerEntries() {
  if (document.readyState === "complete") {
    observeEvent();
  } else {
    const onLoad = () => {
      observeEvent();
      window.removeEventListener("load", onLoad, true);
    };
    window.addEventListener("load", onLoad, true);
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
