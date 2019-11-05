# front-end-deploy
  - 前端部署
  - 钉钉消息发送

##### 第一步
  - 需配置好NODE、ssh相关环境
  - 钉钉开发文档自定义机器人 https://open-doc.dingtalk.com/microapp/serverapi2/qf2nxq

##### 第二步
使用 pm2 运行 index.js

##### nodejs部署关键点
```
git fetch
git rev-parse --short HEAD
git rev-parse --short origin/master
git checkout -f
```

##### 其它说明
目录 /php-history/* 为自动部署webhook的PHP实现版本，gitlab与tfs会有细微差异，仅供参考



### 2019.07.11 技术方案
    - pm2 node 管理工具使用
    - 权限验证模块，集成u2进行验证
    - nginx配置模版设计
    - 增加、删除nginx配置
    - 增加、删除git项目
    - 操作定时任务配置文件增加、删除、修改功能
    - 定时任务模块，每{{1}}分钟进行一次远程获取，对比差异,更新代码
        - git fetch origin {{master}}
        - git rev-parse --short HEAD
        - git rev-parse --short origin/{{master}}
        - git checkout -f {{commit}}
    - nginx服务管理

### 2019.11.05 技术方案feNginx
```

/usr/local/nginx/conf/vhost-fe1/
/neworiental/fe1code/

========== v1.x
[
  {"id":"t.joyffp.com", "type":"default", "path":"xxxCode", "https": 1},
  {"id":"q.joyffp.com", "type":"proxy", "ip":"127.0.0.1", "https": 1},
  {"id":"|dev|mock|www|.joyffp.com", "type":"default", "path":"xxxCode", "https": 1}
]

========== v2.x
前端：
React、Axios

权限:
接U2

数据库结构：
{
  "t.joyffp.com": ["default", "/webhome/fe1code/xxxCode/wwwroot", "/webhome/fe1code/xxxCode/mock",0],
  "q.joyffp.com": ["proxy", "/", "http://127.0.0.1", "q.joyffp.com", 1],
  "x.joyffp.com": ["proxy", "/", "http://127.0.0.1", "x.joyffp.com", 2]
}

Api（增加）：
  http://api.joyffp.com/add?
    a=t.joyffp.com&
    b=default,/webhome/fe1code/xxxCode/wwwroot,/webhome/fe1code/xxxCode/mock,0

  http://api.joyffp.com/add?
    a=q.joyffp.com&
    b=proxy,/,http://127.0.0.1,q.joyffp.com,1

  http://api.joyffp.com/add?
    a=www.joyffp.com,dev.joyffp.com,mock.joyffp.com&
    b=default,/webhome/fe1code/xxxCode/wwwroot,/webhome/fe1code/xxxCode/mock,0

Api（删除）：
  http://api.joyffp.com/delete?a=t.joyffp.com,q.joyffp.com

```