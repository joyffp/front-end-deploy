// 2020.06.24 by joyffp
// 2020-06-24 16:03:40 token变更为必选参数
const https = require("https")
module.exports = function (msg, token) {
    const queryParams = {
        msgtype: "text",
        text: {
            content: msg,
        },
    }
    const requestData = JSON.stringify(queryParams)
    const token = token
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