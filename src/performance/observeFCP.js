export default function observeFCP() {
  const observer = new PerformanceObserver(entryHandler);

  observer.observe({ type: "paint", buffered: true });

  function entryHandler(list, obj) {
    //list性能指标条目
    for (const entry of list.getEntries()) {
      //改下这里就行
      if (entry.name === "first-contentful-paint") {
        observer.disconnect();

        const json = entry.toJSON();
        //得到需要上报的数据
        console.log(json);

        //编写需要上报的数据格式
        const reportData = {
          ...json,
          type: "performance", //性能相关的
          // subType: 'paint'
          subType: entry.name,
          // 当前页面的URl
          pageUrl: window.location.href,
        };
      }
    }
  }
}
