# <%= name %>

> 监控后台服务

## Usage

初次启动，需要先初始化数据库

```bash
npm run prisma
```

初始化完成后即可启动服务

```bash
npm run dev
```

默认地址：[http://localhost:<%= server_port %>](http://localhost:<%= server_port %>)

（确保 <%= mysql_port %>、<%= listen_port %>、<%= server_port %> 端口未被占用）
