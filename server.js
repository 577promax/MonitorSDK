//模拟后端服务
//模拟上报到后端接口
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

//uBlock插件阻止post访问
app.post('/reportData', (req, res) => {
    console.log("上报数据", req.body);
    res.status(200).send("ok");
});

app.listen(9800, () => {
    console.log("服务已启动，监听9800端口");
});

//node server.js