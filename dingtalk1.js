// 2019.07.18 by joyffp
const https = require("https")
const config = require("./config.js")
function ddMsg(msg, _token) {
    const queryParams = {
        msgtype: "text",
        text: {
            content: msg,
        },
    }
    const requestData = JSON.stringify(queryParams)
    const token = _token || config.dingtalkTokenSuccess
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

module.exports = ddMsg
