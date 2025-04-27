
export default function observeLoad() {
    //监听pageShow事件 
    window.addEventListener('pageshow', function (event) {
        requestAnimationFrame(() => {
            ['load', 'DOMContentLoaded'].forEach((type) => {
                //计算、上报数据
                const reportData = {
                    type: 'performance',
                    subType: type,
                    pageUrl: window.location.href,
                    // 
                    startTime: performance.now() - event.timeStamp, //当前时间点 - 显示时间点（计算从页面显示到当前的时间间隔）
                }
            });

        });
    });
}