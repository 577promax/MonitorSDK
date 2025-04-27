const observer = new PerformanceObserver(entryHandler);

//监听lcp type需要变化一下  最大绘制时间
observer.observe({ type: "largest-contentful-paint", buffered: true });

function entryHandler(list, obj) {
  //lcp断开的位置不一样
  if (observer) {
    observer.disconnect();
  }

  //不需要判断条件
  for (const entry of list.getEntries()) {
      const json = entry.toJSON();
      console.log(json);

      const reportData = {
        ...json,
        type: "performance", //性能相关的
        subType: entry.name,
        pageUrl: window.location.href,
      };
  }
}


