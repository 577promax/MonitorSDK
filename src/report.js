import config from "./config";
import { addCache, getCache, clearCache } from "./cache";
import { generateUniqueId } from "./utils";

export const originalProto = XMLHttpRequest.prototype;
export const originalOpen = originalProto.open;
export const originalSend = originalProto.send;

//减少一条一条上报
export function report(data) {
  if (!config.url) {
    console.error("请配置上报url地址");
  }
  const reportData = JSON.stringify({
    id: generateUniqueId(), //唯一的id，后续看怎么生成
    data,
  });
  //tood:上报数据
  //gif > sendBeacon > xhr
  const value = beaconRequest(config.url, reportData);
  if (!value) {
    config.isImageUpload ? imgRequest(reportData) : xhrRequest(reportData);
  }
}

//实际业务调用这个函数去上报
export function lazyReportBatch(data) {
  //定义一些缓存的方法
  addCache(data);
  const dataCache = getCache();
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

export function xhrRequest(url, data) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        const xhr = new XMLHttpRequest();
        originalOpen.call(xhr, "POST", url);
        originalSend.call(xhr, JSON.stringify(data));
      },
      {
        timeout: 2000,
      }
    );
  } else {
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      originalOpen.call(xhr, "POST", url);
      originalSend.call(xhr, JSON.stringify(data));
    }, 2000);
  }
}

//sendBeacon有兼容性
export function beaconRequest(data) {
  let flag = true;
  //空闲时间内去上传
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        return (flag = sendBeacon(config.url, data));
      },
      {
        timeout: 2000,
      }
    );
  } else {
    setTimeout(() => {
      return (flag = sendBeacon(config.url, data));
    }, 2000);
  }
}
export function isSupportBeacon() {
  return "sendBeacon" in navigator;
}
