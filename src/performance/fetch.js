import { lazyReportBatch } from "../report";

const originalFetch = window.fetch;

function overwriteFetch() {
  window.fetch = function newFetch(url, config) {
    //计算时间
    const startTime = Date.now();
    const reportData = {
      type: "performance",
      subType: "fetch",
      url,
      method: config?.method,
      startTime,
    };

    return originalFetch(url, config)
      .then((response) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        reportData.endTime = endTime;
        reportData.duration = duration;
        //   reportData.success = status >= 200 && status < 300; //请求是否成功,200-300认为成功 response.ok
        //   reportData.success = response.ok; //请求是否成功,200-300认为成功
        //   reportData.status = response.status;;

        //克隆响应对象，以便在不影响原始响应的情况下读取其内容或属性

        // Response 对象的流特性：
        // Response 对象的 body 是一个流（ReadableStream），只能被读取一次。
        // 如果直接读取 response 的内容（如 response.json() 或 response.text()），原始响应的流会被消耗，导致后续代码无法再使用该响应。
        const data = response.clone();
        reportData.status = data.status;
        reportData.success = data.ok;
        //todo：上报数据
        return response;
      })
      .catch((err) => {
        const endTime = Date.now();
        const duration = endTime - startTime;
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

export default function fetch() {
  overwriteFetch();
}
