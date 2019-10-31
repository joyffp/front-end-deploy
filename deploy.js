// 2019.07.11 by joyffp
const child_process = require("child_process");
const ddMsg = require("./dingtalk.js");
const config = require("./config.js");

var deployList = config.deployList
var delimiter = config.delimiter

ddMsg('【服务重启成功】' + config.ip + '=>' + new Date(), config.dingtalkTokenWaring)

var deployObj = {}

function runExec(fecmd, fecallback) {
    child_process.exec(fecmd, (error, stdout, stderr) => {
        if (error !== null) {
            fecallback('error')
        } else {
            fecallback(stdout)
        }
    });
}

function execFetch(fepath) {
    return new Promise(function (resolve, reject) {
        runExec('cd ' + fepath + ' && git fetch', function (data1) {
            if (data1 !== 'error') {
                resolve()
            } else {
                reject('execFetch')
            }
        })
    })
}

function execCommit1(fepath) {
    return new Promise(function (resolve, reject) {
        runExec('cd ' + fepath + ' && git rev-parse --short HEAD', function (dataCommit1) {
            if (dataCommit1 !== 'error') {
                resolve(dataCommit1)
            } else {
                reject('execCommit1')
            }
        })
    })
}

function execCommit2(fepath, febranch, feid, dataCommit1, fename, feshell) {
    return new Promise(function (resolve, reject) {
        runExec('cd ' + fepath + ' && git rev-parse --short origin/' + febranch, function (dataCommit2) {
            if (dataCommit2 !== 'error') {
                if (dataCommit1 === dataCommit2) {
                    deployObj[feid] = false
                    resolve(dataCommit1 + '===' + dataCommit2 + new Date() + feid)
                } else {
                    runExec('cd ' + fepath + ' && git checkout -f ' + dataCommit2, function (dataEnd) {
                        deployObj[feid] = false
                        if (dataEnd !== 'error') {
                            runExec('cd ' + fepath + ' && git log -1', function (dataLog) {
                                ddMsg('【部署成功】' + fename + delimiter + 'IP：' + config.ip + delimiter + 'Branch：' + febranch + delimiter + dataLog)
                                if (feshell) {
                                    runExec(feshell, function (dataLogShell) {
                                        ddMsg('【构建完成】' + fename + delimiter + 'Branch：' + febranch + delimiter + dataLogShell)
                                    })
                                }
                            })
                            resolve(dataCommit1 + '!==' + dataCommit2 + new Date() + feid)
                        } else {
                            reject('error checkout -f')
                        }
                    })
                }
            } else {
                reject('execCommit2')
            }
        })
    })
}

function runInit(fepath, febranch, feid, fename, feshell) {
    execFetch(fepath)
        .then(function () {
            return execCommit1(fepath)
        }).then(function (dataCommit1) {
            return execCommit2(fepath, febranch, feid, dataCommit1, fename, feshell)
        }).then(function (data) {
            console.log(data)
        }).catch(function (err) {
            deployObj[feid] = false
            let dingtalkTokenCatch = config.dingtalkTokenWaring
            if (err === 'execCommit2') {
                dingtalkTokenCatch = config.dingtalkTokenError
            }
            ddMsg('【部署失败】' + fename + delimiter + 'IP：' + config.ip + delimiter + 'Branch：' + febranch + delimiter + 'Error: ' + err, dingtalkTokenCatch)
        })
}

function deployInit() {
    for (let index = 0; index < deployList.length; index++) {
        const element = deployList[index];
        if (!deployObj[element.id]) {
            deployObj[element.id] = true
            setTimeout(function () {
                runInit(element.path, element.branch, element.id, element.name, element.feshell)
            }, element.time)
        }
    }
    setTimeout(function () {
        deployInit()
    }, 5000)
}

deployInit()