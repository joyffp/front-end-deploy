// 2019.07.30 by joyffp
module.exports = {
    deployList: [
        { id: 100, name: "【FE1】", path: "/code/fe1", branch: "master", time: 5000 },
        {
            id: 200,
            name: "【FE2】",
            path: "/code/fe2",
            branch: "master",
            time: 5000,
            feshell: "cd /code/fe2 && npm install && npm run build",
        },
    ],
    ip: "127.0.0.1",
    dingtalkTokenSuccess: "******",
    dingtalkTokenWaring: "******",
    dingtalkTokenError: "******",
    delimiter: "\n",
    modifyVerTime: "2019-10-31 09:34:27",
}
