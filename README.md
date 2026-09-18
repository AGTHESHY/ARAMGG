# ARAMGG 助手

海克斯大乱斗桌面辅助工具，基于 Electron + Vue 3 + TypeScript 构建。

## 功能

### 选人阶段

- 识别当前英雄与可换英雄（Bench）
- 展示英雄胜率、Pick Rate、Tier / Rank
- 队友近期战绩展示（胜率、胜负场、KDA、样本场次）
- 队友当前英雄统计数据
- 五级渐变色条与粒子特效展示
- 点击队友卡片查看详细战绩

### 组队大厅

- 查询大厅成员近期 50 场游戏记录
- 计算胜率、KDA、综合评分
- 队友数据实时轮询更新

### 对局阶段

- PaddleOCR 识别三张海克斯卡片
- 展示当前英雄对应的海克斯推荐
- 海克斯 Rank / Tier、胜率、Pick Rate、样本数
- 推荐顺序与相关 Build 信息

### 皮肤中心

- 浏览已拥有皮肤
- 皮肤历史记录
- 客户端装饰（表情、图标、守卫眼皮肤、旗帜）
- 自定义 Mod 目录管理

### 战绩偏好

- 选人阶段队友战绩悬浮窗（可开关，默认开启）
- 组队大厅队友战绩（可开关，默认开启）
- 队友卡片粒子特效（可开关，默认开启）

### 其他功能

- ARAM 无冷却换英雄
- 战报分享
- 本地数据缓存与版本切换
- 中心数据同步服务
- 窗口大小 960 x 760

## 目录结构

```
client/            Electron / Vue / TypeScript 客户端
server/            Fastify / PostgreSQL 中心数据服务
docs/              项目文档
compose.yaml       本地容器部署
```

## 快速开始

### 客户端

```sh
cd client
npm ci --ignore-scripts
npm run prepare:client-data
npm run dev
```

### 中心服务

```sh
docker compose up -d --build api
docker compose exec api node dist/cli.js seed-demo
```

服务监听本机 `127.0.0.1:8788`，数据库不暴露宿主机端口。

## 参考代码库

- [ARAMGG Client](https://github.com/valkia/aramgg_client) - 客户端基础框架
- [Sona](https://github.com/WJZ-P/sona) - 友方战力分析与选人阶段增强参考
- [Rose](https://github.com/Alban1911/Rose) - 皮肤中心功能参考
- [ARAMGG](https://aramgg.com/zh-CN) - 数据来源
