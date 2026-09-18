# 二次开发指南

## 目录结构

```
client/            Electron / Vue / TypeScript 客户端
server/            Fastify / PostgreSQL 中心数据服务
docs/              项目文档
compose.yaml       本地容器部署
```

## 客户端开发

```sh
cd client
npm ci --ignore-scripts
npm run prepare:client-data
npm run dev
```

数据准备和客户端运行默认使用 `http://127.0.0.1:8788`。首次 `dev` 会按上游脚本安装 Electron 运行时。Windows 游戏连接、窗口跟随及 OCR 实机验证仍需 Windows 环境。

自定义中心源：在 shell 设置 `ARAMGG_DATA_API_ORIGIN`，再执行数据准备、开发或构建命令。构建会把该地址写入主进程产物；运行时同名变量可覆盖。外部地址必须满足原客户端的 HTTPS / 信任来源校验。**不要向客户端配置 Developer API Key。**

## 中心服务

需要 Docker Desktop 已启动。在工作区根目录执行：

```sh
docker compose up -d --build api
docker compose exec api node dist/cli.js seed-demo
```

第二条命令显式导入三种语言的 demo 演示快照；所有数据均为人为构造，不能用于实际游戏推荐。它不会访问上游、需要 API Key 或消耗额度。重复执行不会重复发布。

服务只监听本机 `127.0.0.1:8788`；数据库不暴露宿主机端口。

### API 端点

- `GET /health/live`：进程状态。
- `GET /health/ready`：数据库状态及 `dataReady`。无快照时进程仍可正常运行，`dataReady=false`。
- `GET /api/client/v1/config`：简体中文当前版本；未导入快照时返回 503。
- `GET /api/client/v1/{locale}/config`：按语言获取当前版本。
- `GET /api/client/v1/data/{version}/{locale}/manifest.json`：不可变版本清单。
- `GET /api/client/v1/data/{version}/{locale}/{path}`：JSON 数据文件，支持 ETag / 304。

支持 `zh-CN`、`en-US`、`zh-TW`。兼容默认中文不带 locale 的文件路径。快照文件带 SHA-256 和长度；发布前检查英雄、分片和强化引用的完整性。数据库事务负责切换 current，PostgreSQL advisory lock 串行化同语言发布和回滚。

### 回滚

```sh
docker compose exec api node dist/cli.js rollback zh-CN demo.1
```

回滚先校验目标文件。已有版本不可覆写，重复发布也不会自动撤销一次有意的回滚。

### 停止服务

```sh
docker compose down
```

## 验证

### 服务端

```sh
docker compose --profile test run --build --rm tests
```

测试使用独立临时数据库 schema 与临时文件，不修改服务正在使用的快照。无 `TEST_DATABASE_URL` 时，宿主机 `npm test` 只执行内存目录测试并明确跳过数据库集成测试。

### 客户端

```sh
cd client
npm run test:unit
npm run lint
npm run type-check
npm run build
npm run test:augment-ocr
```

## 测试服务器部署

测试服务器使用独立的低内存配置 `compose.server.yaml`，部署方式、SSH 隧道和真实上游 Key 测试见 [服务器部署说明](server-deployment.md)。
