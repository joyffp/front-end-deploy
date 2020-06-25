// 2020.06.24 去除config文件依赖、token变更为必选参数
// 2019.07.18 by joyffp
const https = require("https")
module.exports = function (msg, token) {
    const queryParams = {
        msgtype: "text",
        text: {
            content: msg,
        },
    }
    const requestData = JSON.stringify(queryParams)
    const url = "oapi.dingtalk.com"
    const req = https.request({
        hostname: url,
        port: 443,
        path: "/robot/send?access_token=" + token,
        method: "POST",
        json: true,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
    req.write(requestData)
    req.on("error", function (err) {
        console.error(err)
    })
    req.end()
}
