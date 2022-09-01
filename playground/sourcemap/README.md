# 说明

简单模拟一个含有js错误的压缩版 bundle.js 和bundle.js.map

先开启服务
```bash
yarn dev
```

打包
通过发送请求 => http://localhost:8888/uploadFile 把map文件复制到playground/server/<projectId>目录下
注意:必须先在playground/server下手动创建tempSourceMap目录, 否则打包时移动map文件会失败
```bash
yarn workspace @heimdallr-sdk/sourcemap build:webpack
```

进入http://localhost:8888/sourcemap/

刷新页面，使页面加载包含错误的main.bundle.js文件

会发送报错信息到 => http://localhost:8888/errors/sendMsg

根据传入的lineno, colno解析源码的line和column
