import config from "./config";

export const originalProto = XMLHttpRequest.prototype;
export const originalOpen = originalProto.open;
export const originalSend = originalProto.send;

export function report(data) {
  if (!config.url) {
    console.error("请配置上报url地址");
  }
  const reportData = JSON.stringify({
    id: "11", //唯一的id，后续看怎么生成
    data,
  });
  //tood:上报数据
  //gif > sendBeacon > xhr
  const value = beaconRequest(config.url, reportData);
  if (!value) {
    config.isImageUpload ? imgRequest(reportData) : xhrRequest(reportData);
  }
}

//s三种上报方式

export function generateUniqueId() {
  return "ID-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
}

export function imgRequest(data) {
  const img = new Image();
  img.src = config.url + "?data=" + encodeURIComponent(JSON.stringify(data));
}

export function xhrRequest(url, data) {
  const xhr = new XMLHttpRequest();
  originalOpen.call(xhr, "POST", url);
  originalSend.call(xhr, JSON.stringify(data));
}

//sendBeacon有兼容性
export function beaconRequest(data) {
    let flag = true;
  //空闲时间内去上传
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        return flag = sendBeacon(config.url, data);
      },
      {
        timeout: 2000,
      }
    );
  } else {
    setTimeout(() => {
      return flag = sendBeacon(config.url, data);
    }, 2000);
  }
}
export function isSupportBeacon() {
  // return !!navigator.sendBeacon;
  return "sendBeacon" in navigator;
}

// const sendBeacon = isSupportBeacon() ? navigator.sendBeacon : xhrRequest;
