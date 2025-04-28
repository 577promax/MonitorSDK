import { generateUniqueId } from "../utils";
import { lazyReportBatch } from "../report";

export default function pv() {
    const reportData = {
        type: "behavior",
        subType: "pv",
        pageUrl: window.location.href,
        startTime: performance.now(),
        referror: document.referrer, //上一个页面的url(页面从哪来的)
        uuid: generateUniqueId() , //用户唯一标识
    };
    lazyReportBatch(reportData);
}