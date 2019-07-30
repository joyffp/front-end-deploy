// 2019.07.11 by joyffp
const child_process = require("child_process");
const ddMsg = require("./dingtalk.js");

var deployList = [
    { "id": 100, "name": "【项目fe1】", "path": "/code/fe1", "branch": "master", "time": 5000 },
    { "id": 101, "name": "【项目fe2】", "path": "/code/fe2", "branch": "develop", "time": 5000 }
]

ddMsg('【服务重启成功】127.0.0.1=>' + new Date())

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
                reject('error execFetch')
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
                reject('error execCommit1')
            }
        })
    })
}

function execCommit2(fepath, febranch, feid, dataCommit1, fename) {
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
                                ddMsg('【部署成功】' + fename + '\r' + dataLog)
                            })
                            resolve(dataCommit1 + '!==' + dataCommit2 + new Date() + feid)
                        } else {
                            reject('error checkout -f')
                        }
                    })
                }
            } else {
                reject('error execCommit2')
            }
        })
    })
}

function runInit(fepath, febranch, feid, fename) {
    execFetch(fepath)
        .then(function () {
            return execCommit1(fepath)
        }).then(function (dataCommit1) {
            return execCommit2(fepath, febranch, feid, dataCommit1, fename)
        }).then(function (data) {
            console.log(data)
        }).catch(function (err) {
            deployObj[feid] = false
            ddMsg('【部署失败】' + fename + '\r' + err)
        })
}

function deployInit() {
    for (let index = 0; index < deployList.length; index++) {
        const element = deployList[index];
        if (!deployObj[element.id]) {
            deployObj[element.id] = true
            setTimeout(function () {
                runInit(element.path, element.branch, element.id, element.name)
            }, element.time)
        }
    }
    setTimeout(function () {
        deployInit()
    }, 5000)
}

deployInit()