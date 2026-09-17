# Mayhem Companion

海克斯大乱斗助手的开发工作区。需求原文见 [项目文档](docs/project-v2.md)。当前是**首阶段开发底座，不是可发布的完整产品**。

## 目录

```text
client/            git 拉取的 ARAMGG Electron / Vue / TypeScript 客户端
references/sona/   git 拉取的 Sona，仅用于参考，不参与构建
server/            新建的 Fastify / PostgreSQL 中心数据服务
docs/              项目需求与实施状态
compose.yaml       本地容器部署
sources.lock.json  两个参考仓库的基线 commit
```

本仓库包含完整客户端与中心服务源码。客户端来源和基线 commit 记录在 `sources.lock.json`；Sona 仅作为本地参考，不上传或参与构建。原开发工作区保留的嵌套 Git 元数据、依赖、构建产物和运行时数据不进入提交。

本轮相对上游的客户端改动另存于 `patches/aramgg-client.patch`，供追溯使用。本仓库已包含这些改动，克隆后无需再次拉取客户端或应用补丁。详细验证结果和后续工作见 [实施记录](docs/implementation-status.md)。

## 启动中心服务

需要 Docker Desktop 已启动。在工作区根目录执行：

```sh
docker compose up -d --build api
docker compose exec api node dist/cli.js seed-demo
```

第二条命令显式导入三种语言的 **demo.1 演示快照**；所有数据均为人为构造，不能用于实际游戏推荐。它不会访问上游、需要 API Key 或消耗额度。重复执行不会重复发布。

服务只监听本机 `127.0.0.1:8788`；数据库不暴露宿主机端口。

测试服务器使用独立的低内存配置 `compose.server.yaml`；部署方式、SSH 隧道和真实上游 Key 测试见 [服务器部署说明](docs/server-deployment.md)。

- `GET /health/live`：进程状态。
- `GET /health/ready`：数据库状态及 `dataReady`。无快照时进程仍可正常运行，`dataReady=false`。
- `GET /api/client/v1/config`：简体中文当前版本；未导入快照时返回 503。
- `GET /api/client/v1/{locale}/config`：按语言获取当前版本。
- `GET /api/client/v1/data/{version}/{locale}/manifest.json`：不可变版本清单。
- `GET /api/client/v1/data/{version}/{locale}/{path}`：JSON 数据文件，支持 ETag / 304。

支持 `zh-CN`、`en-US`、`zh-TW`。兼容默认中文不带 locale 的文件路径。快照文件带 SHA-256 和长度；发布前检查英雄、分片和强化引用的完整性。数据库事务负责切换 current，PostgreSQL advisory lock 串行化同语言发布和回滚。

回滚到已经发布的版本：

```sh
docker compose exec api node dist/cli.js rollback zh-CN demo.1
```

回滚先校验目标文件。已有版本不可覆写，重复发布也不会自动撤销一次有意的回滚。

停止本项目（保留数据）：

```sh
docker compose down
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

## 验证

服务端完整测试（含真实 PostgreSQL 并发发布）：

```sh
docker compose --profile test run --build --rm tests
```

测试使用独立临时数据库 schema 与临时文件，不修改服务正在使用的快照。无 `TEST_DATABASE_URL` 时，宿主机 `npm test` 只执行内存目录测试并明确跳过数据库集成测试。

客户端：

```sh
cd client
npm run test:unit
npm run lint
npm run type-check
npm run build
npm run test:augment-ocr
```

## 尚未完成

- ARAMGG Developer API 真实数据转换、版本监听、同步重试与 Sync Job 持久化。
- 用户注册登录、设置同步、共享 Key 加密与贡献额度管理。
- SGP / LCU 队友近期战绩服务及选人浮窗。
- 原客户端写入操作、战绩上传等现有功能的只读产品边界收敛。
- Windows 游戏实测、安装包验收、发布授权确认。

未添加没有实际实现的 worker，也未把演示数据冒充真实上游数据。源码衍生使用、数据缓存分发及共享额度授权按项目文档留待公开发布前落实。
