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