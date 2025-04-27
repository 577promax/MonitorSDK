export default function observePaint() {
  //new 一个
  //需要传一个回调函数
  const observer = new PerformanceObserver(entryHandler);

  //缓冲区，arrayBuffer，缓存  这里的buffered: true 是确保观察到所有的paint时间
  //buffered  检查已缓冲的性能条目

  // entryTypes：一个数组，包含要观察的性能条目类型。可以填的值包括:
  // frame： 指的是整个页面，包括页面的导航性能和整体加载时间。它可以监测与整个页面的性能相关的数据。
  // navigation： 与页面导航和加载时间相关，提供有关导航事件（如页面加载、重定向等）的性能数据。
  // resource： 与页面中加载的各种资源相关，如图像、脚本、样式表等。它可以监测单个资源的加载性能，包括资源的开始和结束时间，以及其他相关信息。
  // mark： 与性能标记（mark）相关，性能标记是在代码中设置的时间戳，通常用于记录特定事件的时间，以便后续性能分析。这提供了在页面加载期间创建性能标记的方式。
  // measure： 与性能测量（measure）相关，性能测量用于测量两个性能标记之间的时间间隔，以获取更详细的性能数据。这提供了测量和分析特定事件之间的时间差的方式。
  // paint： 与页面绘制性能相关，可以是 "first-paint"（首次绘制）或 "first-contentful-paint"（首次内容绘制fcp）之一。这些指标表示页面呈现的关键时间点，可以帮助我们评估用户视觉上的加载体验。
  // observer.observe({ entryTypes: ['resource', 'paint'] });

  //编写的总体流程
  observer.observe({ type: "paint", buffered: true });

  /**
   *
   * @param {*} list  性能观察条目列表
   * @param {*} obj   观察者对象
   */

  // 回调函数会在性能指标发生变化时被触发，它接受一个参数：entries，它是一个性能条目对象的数组，每个对象描述了一个性能条目。
  // const callback = entries => {
  //     entries.forEach(entry => {
  //       // 处理性能指标数据
  //     });
  //   };
  function entryHandler(list, obj) {
    //循环一下
    for (const entry of list.getEntries()) {
      // FP
      if (entry.name === "first-paint") {
        //监听到对应就停止
        //当等于FP，取消监听
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
        //发送数据 上报 todo;
      }
    }
  }
}
