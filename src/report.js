import config from "./config";
import { addCache, getCache, clearCache } from "./cache";
import { generateUniqueId } from "./utils";

export const originalProto = XMLHttpRequest.prototype;
export const originalOpen = originalProto.open;
export const originalSend = originalProto.send;

//减少一条一条上报
export function report(data) {
    if (!config.url) {
        console.error('请设置上传 url 地址');
    }
    const reportData = JSON.stringify({
        id: generateUniqueId(),
        data,
    });
    // 上报数据，使用图片的方式
    if (config.isImageUpload) {
        imgRequest(reportData);
    } else {
        // 优先使用 sendBeacon
        if (window.navigator.sendBeacon) {
            return beaconRequest(reportData);
        } else {
            xhrRequest(reportData);
        }
    }
}

//实际业务调用这个函数去上报
export function lazyReportBatch(data) {
  //定义一些缓存的方法
  addCache(data);
  const dataCache = getCache();
  console.error("缓存数据", dataCache);
  if (dataCache.length && dataCache.length > config.batchSize) {
    report(dataCache);
    clearCache();
  }
}

//三种上报方式

export function imgRequest(data) {
  const img = new Image();
  img.src = config.url + "?data=" + encodeURIComponent(JSON.stringify(data));
}

export function xhrRequest(data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        const xhr = new XMLHttpRequest();
        originalOpen.call(xhr, "post", config.url);
        originalSend.call(xhr, JSON.stringify(data));
      },
      { timeout: 3000 }
    );
  } else {
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      originalOpen.call(xhr, "post", url);
      originalSend.call(xhr, JSON.stringify(data));
    });
  }
}

//sendBeacon有兼容性
export function beaconRequest(data) {
  //空闲时间内去上传
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        window.navigator.sendBeacon(config.url, data);
      },
      {
        timeout: 2000,
      }
    );
  } else {
    setTimeout(() => {
      window.navigator.sendBeacon(config.url, data);
    }, 2000);
  }
}
export function isSupportBeacon() {
  return "sendBeacon" in navigator;
}
