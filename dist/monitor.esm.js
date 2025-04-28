//自己定义的参数
var config = {
  url: 'http://localhost:3000/api/monitor',
  projectName: 'feMonitor',
  //项目名字
  appID: "123",
  userId: "123",
  isImageUpload: false,
  batchSize: 10 //批量上报的大小
};
function setConfig(options) {
  for (var key in config) {
    if (options[key]) {
      config[key] = options[key];
    }
  }
}

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

//公共第三方工具
function deepCopy(target) {
  if (_typeof(target) === 'object') {
    var result = Array.isArray(target) ? [] : {};
    for (var key in target) {
      if (_typeof(target[key]) == 'object') {
        result[key] = deepCopy(target[key]);
      } else {
        result[key] = target[key];
      }
    }
    return result;
  }
  return target;
}
function generateUniqueId() {
  return "ID-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

var cache = [];
function getCache() {
  return deepCopy(cache);
}
function addCache(data) {
  cache.push(data);
}
function clearCache() {
  cache.length = 0;
}

var originalProto$1 = XMLHttpRequest.prototype;
var originalOpen$1 = originalProto$1.open;
var originalSend$1 = originalProto$1.send;

//减少一条一条上报
function report(data) {
  if (!config.url) {
    console.error("请配置上报url地址");
  }
  var reportData = JSON.stringify({
    id: generateUniqueId(),
    //唯一的id，后续看怎么生成
    data: data
  });
  //tood:上报数据
  //gif > sendBeacon > xhr
  var value = beaconRequest(config.url);
  if (!value) {
    config.isImageUpload ? imgRequest(reportData) : xhrRequest(reportData);
  }
}

//实际业务调用这个函数去上报
function lazyReportBatch(data) {
  //定义一些缓存的方法
  addCache(data);
  var dataCache = getCache();
  if (dataCache.length && dataCache.length > config.batchSize) {
    report(dataCache);
    clearCache();
  }
}

//三种上报方式

function imgRequest(data) {
  var img = new Image();
  img.src = config.url + "?data=" + encodeURIComponent(JSON.stringify(data));
}
function xhrRequest(url, data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      var xhr = new XMLHttpRequest();
      originalOpen$1.call(xhr, "POST", url);
      originalSend$1.call(xhr, JSON.stringify(data));
    }, {
      timeout: 2000
    });
  } else {
    setTimeout(function () {
      var xhr = new XMLHttpRequest();
      originalOpen$1.call(xhr, "POST", url);
      originalSend$1.call(xhr, JSON.stringify(data));
    }, 2000);
  }
}

//sendBeacon有兼容性
function beaconRequest(data) {
  //空闲时间内去上传
  if (window.requestIdleCallback) {
    window.requestIdleCallback(function () {
      return sendBeacon(config.url, data);
    }, {
      timeout: 2000
    });
  } else {
    setTimeout(function () {
      return sendBeacon(config.url, data);
    }, 2000);
  }
}

var originalFetch = window.fetch;
function overwriteFetch() {
  window.fetch = function newFetch(url, config) {
    //计算时间
    var startTime = Date.now();
    var reportData = {
      type: "performance",
      subType: "fetch",
      url: url,
      method: config === null || config === void 0 ? void 0 : config.method,
      startTime: startTime
    };
    return originalFetch(url, config).then(function (response) {
      var endTime = Date.now();
      var duration = endTime - startTime;
      reportData.endTime = endTime;
      reportData.duration = duration;
      //   reportData.success = status >= 200 && status < 300; //请求是否成功,200-300认为成功 response.ok
      //   reportData.success = response.ok; //请求是否成功,200-300认为成功
      //   reportData.status = response.status;;

      //克隆响应对象，以便在不影响原始响应的情况下读取其内容或属性

      // Response 对象的流特性：
      // Response 对象的 body 是一个流（ReadableStream），只能被读取一次。
      // 如果直接读取 response 的内容（如 response.json() 或 response.text()），原始响应的流会被消耗，导致后续代码无法再使用该响应。
      var data = response.clone();
      reportData.status = data.status;
      reportData.success = data.ok;
      //todo：上报数据
      return response;
    }).catch(function (err) {
      var endTime = Date.now();
      var duration = endTime - startTime;
      reportData.endTime = endTime;
      reportData.duration = duration;
      reportData.success = false;
      reportData.status = 0;

      //todo：上报数据
      // return Promise.reject(err);
      lazyReportBatch(reportData);
    });
  };
}
function fetch() {
  overwriteFetch();
}

// document.readyState === 'complete' ?

//{2}
//页面加载完调用observeEvent方法函数

// document.readyState 是一个表示文档加载状态的属性，可能的值包括：
// "loading"：文档仍在加载。
// "interactive"：文档已加载完成，文档已被解析，但子资源（如图片、样式表等）可能尚未加载完成。
// "complete"：文档和所有子资源都已加载完成

// 利用函数执行？
function observerEntries() {
  if (document.readyState === "complete") {
    observeEvent();
  } else {
    var _onLoad = function onLoad() {
      observeEvent();
      window.removeEventListener("load", _onLoad, true);
    };
    window.addEventListener("load", _onLoad, true);
  }
}

//{1}
function observeEvent() {
  var entryHandler = function entryHandler(list) {
    var data = list.getEntries();
    var _iterator = _createForOfIteratorHelper(data),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (observer) {
          //停止 PerformanceObserver 对性能条目的监听。
          observer.disconnect();
        }

        //选择entr里你需要的资源进行上报就行
        var reportData = {
          name: entry.name,
          type: "performance",
          subType: entry.entryType,
          sourceType: entry.initiatorType,
          //资源来源
          duration: entry.duration,
          //资源加载时间 持续
          //dns解析时间 差值计算
          dns: entry.domainLookupEnd - entry.domainLookupStart,
          tcp: entry.connectEnd - entry.connectStart,
          //tcp连接时间
          redirect: entry.redirectEnd - entry.redirectStart,
          //重定向时间
          ttfb: entry.responseStart,
          //首字节时间，Time to First Byte
          protocol: entry.nextHopProtocol,
          //请求协议
          responseBodySize: entry.encodedBodySize,
          //响应内容大小
          responseHeaderSize: entry.transferSize - entry.encodedBodySize,
          //响应头部大小
          transferSize: entry.transferSize,
          //请求内容大小（头部+body）
          resourceSize: entry.decodedBodySize,
          //资源解压后的大小（解码，压解）
          startTime: performance.now()
        };
        //   console.log(entry);
        lazyReportBatch(reportData);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: ["resource"],
    buffered: true
  });
}

function observeLCP() {
  var observer = new PerformanceObserver(entryHandler);

  //监听lcp type需要变化一下  最大绘制时间
  observer.observe({
    type: "largest-contentful-paint",
    buffered: true
  });
  function entryHandler(list, obj) {
    //lcp断开的位置不一样
    if (observer) {
      observer.disconnect();
    }

    //不需要判断条件
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        var json = entry.toJSON();
        console.log(json);
        var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
          type: "performance",
          //性能相关的
          subType: entry.name,
          pageUrl: window.location.href
        });
        lazyReportBatch(reportData);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

function observeFCP() {
  var observer = new PerformanceObserver(entryHandler);
  observer.observe({
    type: "paint",
    buffered: true
  });
  function entryHandler(list, obj) {
    //list性能指标条目
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        //改下这里就行
        if (entry.name === "first-contentful-paint") {
          observer.disconnect();
          var json = entry.toJSON();
          //得到需要上报的数据
          console.log(json);

          //编写需要上报的数据格式
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: "performance",
            //性能相关的
            // subType: 'paint'
            subType: entry.name,
            // 当前页面的URl
            pageUrl: window.location.href
          });
          lazyReportBatch(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

function observeLoad() {
  //监听pageShow事件 
  window.addEventListener('pageshow', function (event) {
    requestAnimationFrame(function () {
      ['load', 'DOMContentLoaded'].forEach(function (type) {
        //计算、上报数据
        var reportData = {
          type: 'performance',
          subType: type,
          pageUrl: window.location.href,
          // 
          startTime: performance.now() - event.timeStamp //当前时间点 - 显示时间点（计算从页面显示到当前的时间间隔）
        };
        lazyReportBatch(reportData);
      });
    });
  });
}

function observePaint() {
  //new 一个
  //需要传一个回调函数
  var observer = new PerformanceObserver(entryHandler);

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
  observer.observe({
    type: "paint",
    buffered: true
  });

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
    var _iterator = _createForOfIteratorHelper(list.getEntries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        // FP
        if (entry.name === "first-paint") {
          //监听到对应就停止
          //当等于FP，取消监听
          observer.disconnect();
          var json = entry.toJSON();
          //得到需要上报的数据
          console.log(json);

          //编写需要上报的数据格式
          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            type: "performance",
            //性能相关的
            // subType: 'paint'
            subType: entry.name,
            // 当前页面的URl
            pageUrl: window.location.href
          });
          //发送数据 上报 todo;
          lazyReportBatch(reportData);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
}

//统计ajax请求时间、ajax，使用axios发送

//axios是封装的xhr
//重写ajax，添加功能

var originalProto = XMLHttpRequest.prototype;
// export const originalSend = XMLHttpRequest.prototype.send;

//拿到原生send、open方法
var originalSend = originalProto.send;
var originalOpen = originalProto.open;
function xhr() {
  overwriteSendAndOpen();
}
function overwriteSendAndOpen() {
  // 重写open方法
  // 重写就是为了取url和method
  originalProto.open = function newOpen() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    this.url = args[1]; //保存url
    this.method = args[0]; //保存请求方法
    originalOpen.apply(this, args); //调用原生open方法
  };
  originalProto.send = function newSend() {
    var _this = this;
    this.startTime = Data.now(); //保存请求开始时间
    var _onLoaded = function onLoaded() {
      _this.endTime = Data.now(); //保存请求结束时间
      _this.duration = _this.endTime - _this.startTime; //计算请求耗时
      // const duration = Data.now() - this.startTime; //计算请求耗时
      var url = _this.url,
        method = _this.method,
        startTime = _this.startTime,
        endTime = _this.endTime,
        duration = _this.duration,
        status = _this.status; //status是ajax状态

      //我们需要统计的数据
      var reportData = {
        status: status,
        duration: duration,
        url: url,
        method: method.toUpperCase(),
        //请求方法
        startTime: startTime,
        endTime: endTime,
        type: "performance",
        success: status >= 200 && status < 300,
        //请求是否成功,200-300认为成功
        subType: "xhr"
      };
      //上报数据 todo
      // report(reportData);
      lazyReportBatch(reportData);
      _this.removeEventListener("loadend", _onLoaded, true); //移除事件监听
    };
    // loadend 是一个事件，表示一个网络请求（如 XMLHttpRequest 或 fetch）的生命周期结束，无论请求是成功完成、失败还是被取消，都会触发该事件。
    // load：仅在请求成功完成时触发（状态码 200-299）。
    // error：仅在请求失败时触发（如网络错误）。
    // abort：仅在请求被取消时触发。
    // timeout：仅在请求超时时触发。
    // loadend：无论请求成功、失败、取消或超时，都会触发。

    // 这里的loadend是一个资源加载进度停止后被触发（XML的调用、img、video之类）
    this.addEventListener("loadend", _onLoaded, true);
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    originalSend.apply(this, args);
  };
}

function performance$1() {
  fetch();
  observerEntries();
  observeLCP();
  observeFCP();
  observeLoad();
  observePaint();
  xhr();
}

function error() {
  //监听全局的错误事件(只是捕获资源加载的错误：js css img等)
  window.addEventListener("error", function (event) {
    // console.log(event);
    //根据target判断一下
    var target = event.target;
    if (!target) {
      //说明不是一个js、css或者图片这些静态资源的错误，应该是纯JS的错误
      return;
    }
    if (target.src || target.href) {
      var url = target.src || target.href;
      //组装要上报的data
      var reportData = {
        type: "error",
        subType: "static resource",
        url: url,
        // 计算当前时间 - 资源加载时间
        html: target.outerHTML,
        pageUrl: window.location.href,
        paths: event.path //具体的资源路径
      };
      //todo:上报错误信息
      lazyReportBatch(reportData);
    }
  }, true);

  //捕获真正JS的错误
  window.onerror = function (message, source, lineno, colno, error) {
    var reportData = {
      type: "error",
      subType: "js",
      message: message,
      source: source,
      //url
      lineno: lineno,
      colno: colno,
      stack: error && error.stack,
      //错误堆栈
      pageUrl: window.location.href,
      startTime: performance.now() //当前时间
    };
    lazyReportBatch(reportData);
  };
  //监听异步错误 promise、async await
  Window.addEventListener("unhandledrejection", function (e) {
    var _e$reason;
    var reportData = {
      type: "error",
      subType: "promise",
      reason: ((_e$reason = e.reason) === null || _e$reason === void 0 ? void 0 : _e$reason.stack) || e.reason,
      //存在再取
      pageUrl: window.location.href,
      startTime: performance.now() //当前时间 e.timeStamp也行
    };
    // todo:上报数据
    lazyReportBatch(reportData);
  }, true);
}

function click() {
  ['mousedown', 'touchstart'].forEach(function (eventType) {
    window.addEventListener(eventType, function (e) {
      var target = e.target;
      //点到元素上才进行上报
      if (target.tagName) {
        var reportData = {
          // scrollTop: document.documentElement.scrollTop,
          type: 'behavior',
          subType: 'click',
          target: target.tagName,
          startTime: e.timeStamp,
          innerHtml: target.innerHTML,
          outerHtml: target.outerHTML,
          with: target.offsetWidth,
          height: target.offsetHeight,
          eventType: eventType,
          path: e.path
        };
        lazyReportBatch(reportData);
      }
    });
  });
}

function pageChange() {
  // hash histroy
  var oldUrl = '';
  window.addEventListener('hashchange', function (event) {
    console.error('hashchange', event);
    var newUrl = event.newURL;
    var reportData = {
      form: oldUrl,
      to: newUrl,
      type: 'behavior',
      subType: 'hashchange',
      startTime: performance.now(),
      uuid: generateUniqueId()
    };
    lazyReportBatch(reportData);
    oldUrl = newUrl;
  }, true //尽早捕获事件
  );
  var from = '';
  window.addEventListener('popstate', function (event) {
    console.error('popstate', event);
    var to = window.location.href;
    var reportData = {
      form: from,
      to: to,
      type: 'behavior',
      subType: 'popstate',
      startTime: performance.now(),
      uuid: generateUniqueId()
    };
    lazyReportBatch(reportData);
    from = to;
  }, true);
}

function pv() {
  var reportData = {
    type: "behavior",
    subType: "pv",
    pageUrl: window.location.href,
    startTime: performance.now(),
    referror: document.referrer,
    //上一个页面的url(页面从哪来的)
    uuid: generateUniqueId() //用户唯一标识
  };
  lazyReportBatch(reportData);
}

//入口文件
function behavior() {
  click(), pageChange(), pv();
}

//内部变量，两个杠杠
window.__webMonitorSDK__ = {
  version: '0.0.1'
};

//Vue 以插件的形式开发
function install(Vue, options) {
  if (__webMonitorSDK__.vue) return;
  __webMonitorSDK__.vue = true;
  var handler = Vue.config.errorHandler; //Vue官方的errorHandler
  Vue.config.errorHandler = function (err, vm, info) {
    //todo：上报具体数据
    if (handler) {
      handler.call(this, err, vm, info);
    }
  };
}
function errorBoundary(err) {
  if (__webMonitorSDK__.react) return;
  __webMonitorSDK__.react = true;
  //todo：上报具体数据
}
var webMonitorSDK = {
  install: install,
  errorBoundary: errorBoundary,
  performance: performance$1,
  error: error,
  behavior: behavior,
  init: init
};
function init(options) {
  setConfig(options);
}

// webMonitorSDK.init({
//     appID: '123'
// })
//当时腾讯地图的SDK封装

export { webMonitorSDK as default, init, install };
//# sourceMappingURL=monitor.esm.js.map
