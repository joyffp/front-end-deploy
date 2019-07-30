# front-end-deploy
前端部署

##### 第一步
需配置好NODE相关环境

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
