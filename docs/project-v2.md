# 海克斯大乱斗助手项目设计文档（全新版）

> 文档版本：v2.0  
> 日期：2026-09-17  
> 项目代号：Mayhem Companion  
> 目标平台：Windows  
> 核心原则：**只读游戏状态、分析、展示；不自动替玩家执行操作，不使用 Pengu/客户端注入。**

---

## 1. 项目概述

本项目基于 `valkia/aramgg_client` 作为 Windows 客户端主体，保留其现有的：

- League Client LCU 只读接入
- ChampSelect 当前英雄与 Bench 识别
- PaddleOCR 海克斯识别
- 海克斯三卡 Overlay
- 英雄、海克斯、Build、召唤师技能、技能加点展示
- 本地优先的数据缓存与版本切换机制

在此基础上新增两类能力：

1. **中心版本缓存与数据同步服务**
   - 由服务器统一检测 ARAMGG 数据版本。
   - 只在上游 `dataVersion` 变化时生成新快照。
   - 客户端只访问自己的中心服务器，不让每个客户端直接请求 ARAMGG Developer API。
   - 支持用户主动选择共享自己的 ARAMGG Developer API Key，用于公共数据同步。

2. **组队 / 选人阶段的友方战力分析**
   - 功能设计参考 `WJZ-P/sona` 中的“分析友方战力”和“英雄选择阶段增强”。
   - 只迁移这部分业务逻辑思路。
   - 使用 LCU + SGP 获取当前模式近期战绩。
   - 计算队友近期胜率、胜负场、KDA。
   - 与 ARAMGG 的“当前英雄统计数据”同时展示。
   - 不采用 Sona 的 Pengu Loader、DOM 注入和任何自动化操作。

最终产品定位：

> 一个面向海克斯大乱斗的只读桌面助手：  
> 选人时告诉玩家“这个队友最近表现如何、他手里的英雄强不强”；  
> 对局中识别三张海克斯并展示真实统计推荐；  
> 所有最终选择和操作都由玩家完成。

---

# 2. 项目目标

## 2.1 核心目标

### 选人阶段

展示：

- 当前自己的英雄
- Bench 可换英雄
- 英雄胜率
- Pick Rate
- Tier / Rank
- 队友当前英雄统计
- 队友当前模式近期个人胜率
- 胜负场
- KDA
- 样本场次

目标效果：

```text
┌─────────────────────────────────────┐
│ 玩家 A                              │
│ 当前英雄：亚索                      │
│                                     │
│ 玩家近期 ARAM                       │
│ 62% · 31胜19负 · KDA 4.2 · 50场    │
│                                     │
│ 当前英雄统计                        │
│ 胜率 56.64% · Tier B · Pick 10.9%   │
└─────────────────────────────────────┘
```

这样可以同时回答两个完全不同的问题：

```text
这个玩家最近打得怎么样？
→ LCU + SGP

这个英雄在当前版本强不强？
→ ARAMGG 中心快照
```

---

### 对局阶段

保留 ARAMGG Client 已有能力：

```text
游戏进入 InProgress
        ↓
屏幕截图
        ↓
海克斯界面 Gate 检测
        ↓
固定三卡标题区域裁剪
        ↓
PaddleOCR
        ↓
名称词典匹配 / 容错
        ↓
左 / 中 / 右 augmentId
        ↓
查询当前英雄对应统计
        ↓
Overlay 展示
```

展示：

- 三个候选海克斯
- 当前英雄对应 Rank / Tier
- 胜率
- Pick Rate
- 样本数
- 推荐顺序
- 相关 Build 信息

---

## 2.2 数据平台目标

建立一套自己的中心版本缓存：

```text
ARAMGG 上游
    ↓
Version Watcher
    ↓
dataVersion 是否变化
    ↓
只在变化时同步
    ↓
Snapshot Builder
    ↓
完整性校验
    ↓
Version Snapshot
    ↓
自己的 Data API / CDN
    ↓
所有客户端
```

客户端不直接承担：

- ARAMGG Developer API 额度消耗
- 全量同步
- API Key 管理
- 数据版本发布
- 数据回滚

---

# 3. 明确不做的功能

本项目不采用 Sona 的以下能力：

- 自动接受对局
- 秒选英雄
- 自动 Ban
- 自动锁定
- 自动换英雄
- 无 CD 换英雄
- 自动排队
- 自动点赞
- 自动创建 / 写入装备集
- 自动购买装备
- 自动选择海克斯
- 自动修改符文
- 自动修改召唤师技能
- Pengu Loader
- League Client DOM 注入
- 游戏进程注入
- 内存读取
- 自动化点击

产品边界固定为：

```text
读取
 ↓
分析
 ↓
展示
 ↓
玩家自行操作
```

不进入：

```text
读取
 ↓
分析
 ↓
自动执行
```

---

# 4. 源码与数据来源

## 4.1 主客户端源码

GitHub：

https://github.com/valkia/aramgg_client

用途：

- 客户端基础框架
- Electron / Vue 3 / TypeScript
- LCU 连接
- ChampSelect 数据
- Bench 数据
- PaddleOCR
- 海克斯 Overlay
- 数据缓存
- 版本切换
- Build / 技能 / 召唤师技能展示

重点源码：

```text
src/main/services/lcu/lcu-service.ts
src/main/image-analyzer.ts
src/main/data-loader.ts
src/shared/augment-ranking.ts
src/main/
src/preload/
src/renderer/
src/shared/
```

上游 README 明确描述该客户端为：

```text
ChampSelect
→ 只读 LCU
→ 当前英雄 / Bench 建议

InProgress
→ 屏幕 OCR
→ 三卡 Overlay / 推荐列表
```

本项目原则：

> 尽量保留 ARAMGG Client 已经成熟的 LCU、OCR、Overlay 和缓存代码，只新增必要模块。

---

## 4.2 数据来源

ARAMGG 官网：

https://aramgg.com/zh-CN

ARAMGG Developer API：

https://data.dtodo.cn/api/v1/zh-CN/docs/cf-data-api.md

ARAMGG Client 官方数据策略中区分了：

```text
/api/v1/zh-CN/*
→ 第三方 Developer API
→ API Key + Credits

/api/client/v1/*
→ ARAMGG 官方客户端数据接口
→ 版本化客户端数据
```

本项目不把用户 Developer API Key 写入 Electron 客户端。

我们的中心服务器使用 Developer API 同步数据，再向自己的客户端提供：

```text
/api/client/v1/*
```

风格的数据接口。

---

## 4.3 Sona 功能参考来源

GitHub：

https://github.com/WJZ-P/sona

只参考：

- 分析友方战力
- 英雄选择阶段增强
- 组队界面战绩展示思路
- LCU → PUUID / queueId
- SGP Match History
- LCU Match History fallback
- 胜率 / KDA 计算
- 匿名 / 主播模式下的玩家身份映射思路
- 换楼后的 PUUID 重新绑定思路

重点参考文件：

```text
src/lib/features.ts
src/lib/lcu.ts
```

不迁移：

```text
Pengu Loader
DOM 注入
自动接受
自动 Ban
秒选
自动换英雄
自动排队
自动装备
以及其他自动化功能
```

---

# 5. 总体架构

```text
                           ┌──────────────────────┐
                           │      ARAMGG          │
                           │                      │
                           │ Public Config        │
                           │ Developer API        │
                           └──────────┬───────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │ Version Watcher      │
                           │                      │
                           │ 比较 dataVersion    │
                           └──────────┬───────────┘
                                      │
                         dataVersion changed?
                            │                  │
                           否                 是
                            │                  │
                            │                  ▼
                            │       ┌──────────────────┐
                            │       │ Sync Coordinator │
                            │       └────────┬─────────┘
                            │                │
                            │      ┌─────────┴─────────┐
                            │      ▼                   ▼
                            │   Owner Key        Shared Key Pool
                            │                       opt-in only
                            │      └─────────┬─────────┘
                            │                ▼
                            │       Snapshot Builder
                            │                │
                            │             Validate
                            │                │
                            │                ▼
                            │       Immutable Snapshot
                            │                │
                            └───────────────►Current
                                             │
                                             ▼
                                  ┌────────────────────┐
                                  │ Our Data API / CDN │
                                  └──────────┬─────────┘
                                             │
                                  ┌──────────┴─────────┐
                                  ▼                    ▼
                             Client A              Client B
                                  │                    │
                             Local Cache           Local Cache
```

游戏侧：

```text
League Client
    │
    ├── LCU ────────────────┐
    │                       │
    │                       ▼
    │                ChampSelect Service
    │                       │
    │              ┌────────┴─────────┐
    │              ▼                  ▼
    │         当前英雄 / Bench      myTeam / queueId
    │              │                  │
    │              │                  ▼
    │              │              SGP Stats
    │              │                  │
    │              └─────────┬────────┘
    │                        ▼
    │                 ChampSelect Overlay
    │
    └── Game Window
             │
             ▼
          Screenshot
             │
             ▼
         PaddleOCR
             │
             ▼
        Augment Matching
             │
             ▼
        In-Game Overlay
```

---

# 6. 客户端设计

## 6.1 客户端技术基线

沿用 ARAMGG Client：

- Electron
- Vue 3
- TypeScript
- electron-vite
- PaddleOCR / ONNX
- Node.js 22.x

安全边界继续保留：

- `contextIsolation`
- `sandbox`
- `webSecurity`
- Renderer 不直接拥有 Node 能力
- Renderer 通过 preload 暴露的业务 API 与 Main Process 通信

---

# 7. 当前英雄识别

当前英雄**不使用 OCR**。

直接通过 League Client LCU：

```text
/lol-champ-select/v1/session
```

读取：

```text
session.localPlayerCellId
session.myTeam[]
```

找到：

```text
member.cellId === localPlayerCellId
```

然后获取：

```text
member.championId
```

若该位置暂时没有有效 `championId`，沿用 ARAMGG Client 当前 fallback：

```text
session.actions
→ actorCellId == localPlayerCellId
→ championId
```

因此英雄识别链路：

```text
League Client
    ↓
ChampSelect Session
    ↓
localPlayerCellId
    ↓
myTeam
    ↓
championId
    ↓
ARAMGG 数据
```

不需要图片识别，稳定性高。

---

# 8. 海克斯识别

完整保留 ARAMGG Client 当前实现。

## 8.1 工作方式

不是识别海克斯图标，而是：

```text
截取海克斯标题
      ↓
PaddleOCR 识别名称
      ↓
和本地海克斯名称表匹配
      ↓
augmentId
```

## 8.2 不 OCR 整个画面

固定裁剪三个卡位的标题区域：

```text
┌─────────────────────────────────────────┐
│                                         │
│      ┌────────┐ ┌────────┐ ┌────────┐  │
│      │标题区域│ │标题区域│ │标题区域│  │
│      ├────────┤ ├────────┤ ├────────┤  │
│      │描述正文│ │描述正文│ │描述正文│  │
│      └────────┘ └────────┘ └────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## 8.3 OCR 前 Gate

先检查：

1. 标题区域像素特征是否符合海克斯卡片。
2. reroll / 刷新按钮是否可见。

至少满足有效条件后才运行 OCR。

避免：

- 商店
- 计分板
- 聊天
- 死亡界面
- 普通 HUD

被误识别。

## 8.4 OCR 后处理

保留：

- 当前游戏语言优先词典
- 精确匹配
- OCR Alias
- 模糊文本匹配
- 短词严格匹配
- 描述正文误读过滤
- 相同 augment 去重
- 左 / 中 / 右槽位固定映射

这一模块不计划重写。

---

# 9. 选人阶段友方战力分析

这是本项目相对原版 ARAMGG Client 的核心新增功能。

实现逻辑参考 Sona，但重新实现，不采用其 DOM 注入。

---

## 9.1 数据链

```text
ChampSelect
    ↓
LCU /lol-champ-select/v1/session
    ↓
myTeam[]
queueId
    ↓
每个玩家的 PUUID
    ↓
SGP Match History
    ↓
按当前模式过滤
    ↓
计算：
Win Rate
Wins
Losses
KDA
Games
```

例如：

```text
queueId = 450
↓
tag = q_450
↓
只分析 ARAM 近期战绩
```

不要把：

- 排位
- 普通匹配
- 大乱斗
- 斗魂

混在一起。

---

# 10. SGP 查询

## 10.1 Token

参考 Sona，通过 LCU 获取：

```text
/entitlements/v1/token
```

得到用于 SGP 请求的 Access Token。

不要求用户额外提供 Riot Developer API Key。

---

## 10.2 Match History

优先：

```text
SGP Match History
```

优点：

- 可以按 `q_450` 等 tag 服务端过滤
- 可以查询当前模式
- 更适合队友近期战绩统计

失败则 fallback：

```text
/lol-match-history/v1/products/lol/{puuid}/matches
```

再本地按：

```text
game.queueId === currentQueueId
```

过滤。

---

# 11. 队友统计计算

每个玩家最少保存：

```ts
interface PlayerRecentStats {
  puuid: string
  queueId: number

  games: number
  wins: number
  losses: number
  winRate: number

  avgKills: number
  avgDeaths: number
  avgAssists: number
  kda: number
}
```

计算：

```text
winRate = wins / games

KDA =
(avgKills + avgAssists) / avgDeaths
```

死亡为 0 时使用 Perfect / 特殊展示逻辑。

---

# 12. 不采用 Sona 的“综合战力评分”作为核心判断

Sona 有自己的综合评分和排名逻辑。

本项目第一阶段不需要把它直接搬过来。

原因：

- 胜率、场次、KDA 已经足够直观。
- 避免产生一个难以解释的“神秘战力分”。
- 玩家可自行判断。

第一版建议展示：

```text
近期胜率
胜 / 负
KDA
样本数
```

后续若确实需要评分，再单独定义透明公式。

---

# 13. ChampSelect UI

## 13.1 不使用 DOM 注入

Sona 当前可以直接操作 League Client DOM：

```text
.champion-icon-container
.player-details
```

本项目不采用该方式。

使用：

```text
League Client
      +
独立 Electron 透明 Overlay
```

---

## 13.2 显示目标

视觉上尽量接近“贴在队友头像附近”：

```text
     玩家 1          玩家 2          玩家 3

     亚索            石头人          火男

  62% 31W/19L     48% 24W/26L    57% 29W/21L
     KDA 4.2          KDA 2.8         KDA 3.6

  Hero WR 56.6%    Hero WR 61.2%   Hero WR 59.8%
     Tier B           Tier S          Tier A
```

数据分层：

```text
玩家近期数据
→ SGP

英雄数据
→ ARAMGG Snapshot
```

---

## 13.3 Overlay 要求

- 无边框
- 透明
- Always On Top
- 鼠标穿透
- 不抢 League Client 焦点
- ChampSelect 进入时显示
- 离开 ChampSelect 时销毁 / 隐藏
- League Client 移动后重新定位
- 窗口缩放后重新计算位置
- 队友换楼后重新绑定 PUUID 与槽位

---

# 14. 数据中心设计

## 14.1 核心原则

客户端永远只认我们的数据中心。

不做：

```text
每个客户端
   ↓
ARAMGG Developer API
```

而是：

```text
ARAMGG
   ↓
我们的中心同步
   ↓
Snapshot
   ↓
所有客户端
```

---

# 15. 版本检测

服务端定时检查公开 Config。

建议：

```text
每 5～15 分钟检查一次
```

只比较：

```text
remote.dataVersion
local.currentDataVersion
```

如果：

```text
相同
→ 结束
```

如果：

```text
不同
→ 创建 Sync Job
```

必须有分布式 / 数据库锁，防止多个任务同时更新同一个版本。

---

# 16. API Key 共享机制

用户注册登录后可以选择是否共享 ARAMGG Developer API Key。

## 16.1 推荐产品逻辑

设置：

```text
ARAMGG Developer API Key

[ ] 允许使用我的 API 配额帮助更新公共数据
```

默认：

```text
关闭
```

---

## 16.2 未开启共享

当前版本中：

> 不需要把该 Key 上传服务器。

因为普通用户访问的永远是中心 Snapshot。

因此如果用户没有开启共享：

```text
Client
↓
中心 Snapshot
↓
本地缓存
```

即可。

这样能最大限度降低 Key 泄露风险。

---

## 16.3 开启共享

只有明确 opt-in 后：

```text
Client
   ↓ TLS
Server
   ↓
Encrypted API Key
```

进入：

```text
Shared Key Pool
```

服务器可在检测到新版本时使用。

---

# 17. Shared Key Pool 策略

数据结构示例：

```text
shared_api_keys

id
user_id
encrypted_key
key_fingerprint
share_enabled
daily_share_limit
credits_used_today
last_used_at
status
created_at
updated_at
```

推荐每个用户可以设置：

```text
每日最多贡献 10 / 20 / 50 credits
```

同步策略：

```text
Owner Key
+
所有 opt-in Key
        ↓
按剩余额度 / 最近使用时间排序
        ↓
轮换
```

不要：

```text
一次吃完一个用户的全部额度
```

---

# 18. Key 安全

严禁：

```text
数据库明文
日志输出
Electron 打包
前端 localStorage 明文
错误响应回显
```

服务端建议：

```text
AES-256-GCM
```

或者云 KMS。

保存：

```text
ciphertext
nonce
key_version
fingerprint
```

调用上游时只在内存短暂解密。

日志必须过滤：

```text
Authorization
X-API-Key
api_key
token
```

---

# 19. Snapshot 设计

推荐直接沿用 ARAMGG Client 的版本化思想。

服务器：

```text
/data
├── current.json
└── snapshots
    ├── 16.xx.1
    │   ├── manifest.json
    │   ├── augments.json
    │   ├── champions.json
    │   ├── items.json
    │   └── champion-shards
    │
    └── 16.xx.2
        ├── manifest.json
        ├── augments.json
        ├── champions.json
        ├── items.json
        └── champion-shards
```

---

# 20. Snapshot 发布原则

版本目录：

```text
immutable
```

禁止覆盖：

```text
16.xx.2
```

数据变化必须：

```text
16.xx.3
```

发布顺序：

```text
1. 拉取所有数据
2. 写入 staging
3. schema 校验
4. JSON 校验
5. hash 校验
6. 必需文件检查
7. champion shards 检查
8. build 数据检查
9. 发布版本目录
10. 最后切换 current
```

这样客户端永远不会看到半套新数据。

---

# 21. 数据回滚

至少保留：

```text
Current
Previous
```

建议保留最近 3～5 个版本。

回滚：

```text
current.json

16.xx.3
   ↓
16.xx.2
```

无需重新上传客户端。

---

# 22. 自己的 Client API

保持尽可能兼容 ARAMGG Client 原有接口：

```text
GET /api/client/v1/config

GET /api/client/v1/data/{version}/manifest.json

GET /api/client/v1/data/{version}/augments.json

GET /api/client/v1/data/{version}/champions.json

GET /api/client/v1/data/{version}/items.json

GET /api/client/v1/data/{version}/champion-shards/index.json

GET /api/client/v1/data/{version}/champion-shards/{id}.json
```

这样 ARAMGG Client 的 `data-loader.ts` 不需要推翻。

主要修改：

```text
ARAMGG_DATA_API_ORIGIN
```

指向自己的服务器。

---

# 23. 客户端缓存策略

Local First。

启动时：

```text
本地可用快照
      ↓
立即加载
      ↓
后台请求中心 config
      ↓
检查 dataVersion
```

如果相同：

```text
不下载
```

如果不同：

```text
获取 manifest
↓
下载缺失 / 变化文件
↓
校验
↓
临时目录
↓
原子切换
```

服务器或网络不可用：

```text
继续使用本地上一版本
```

---

# 24. 用户系统

第一版用户系统用途：

- 登录
- 同步软件偏好
- API Key opt-in 管理
- 共享额度上限
- 查看自己的 Key 状态
- 查看最近贡献时间
- 主动撤销共享

建议保存：

```text
users
user_settings
shared_api_keys
sync_jobs
snapshots
```

---

# 25. 建议后台技术栈

为了和客户端统一语言，建议：

## Backend

```text
Node.js 22
TypeScript
Fastify
```

也可以使用 NestJS。

## Database

```text
PostgreSQL
```

负责：

- 用户
- Key metadata
- Snapshot metadata
- Sync Job
- Settings

## Snapshot

第一阶段：

```text
本地磁盘 + Nginx
```

后续：

```text
S3 / R2 / EdgeOne / MinIO
```

## Deployment

```text
Docker Compose
```

建议：

```text
nginx
api
worker
postgres
```

第一版 Redis 非必须。

---

# 26. 服务端模块

```text
server/
├── src/
│   ├── auth/
│   ├── users/
│   ├── keys/
│   ├── snapshots/
│   ├── sync/
│   │   ├── version-watcher.ts
│   │   ├── sync-coordinator.ts
│   │   ├── upstream-client.ts
│   │   ├── key-pool.ts
│   │   ├── validator.ts
│   │   └── publisher.ts
│   │
│   └── client-api/
│
├── data/
│   └── snapshots/
│
└── docker/
```

---

# 27. 客户端新增模块建议

```text
src/main/services/
├── lcu/
│
├── player-stats/
│   ├── player-stats-service.ts
│   ├── sgp-client.ts
│   ├── match-history-fallback.ts
│   ├── queue-filter.ts
│   ├── stats-calculator.ts
│   └── player-stats-cache.ts
│
├── champ-select-overlay/
│   ├── overlay-window.ts
│   ├── league-window-tracker.ts
│   └── layout-resolver.ts
│
└── data/
```

Renderer：

```text
src/renderer/
├── views/
├── components/
│   └── ChampSelectTeamStats/
└── stores/
```

---

# 28. Player Stats Cache

不需要同一个玩家在几十秒内重复请求。

建议：

```text
Key:
puuid + queueId

TTL:
5～15 分钟
```

ChampSelect 多次 Update 时：

```text
已有缓存
→ 直接复用
```

换楼：

```text
只重新绑定 UI 位置
```

而不是重新查询全部战绩。

---

# 29. 请求并发

进入 ChampSelect 时最多同时分析约 5 名友方。

需要：

- Promise 去重
- 最大并发控制
- timeout
- retry 上限
- 单玩家失败不影响其余玩家

例如：

```text
Player 1 成功
Player 2 成功
Player 3 timeout
Player 4 成功
Player 5 成功
```

UI：

```text
Player 3
数据暂不可用
```

不能导致整个 Overlay 消失。

---

# 30. 装备推荐策略

第一版不做动态装备算法。

原因：

动态推荐需要大量：

- 英雄 × 海克斯 × 装备
- 装备顺序
- 敌方阵容
- 当前装备
- 当前金币
- 对局阶段

数据。

当前直接沿用 ARAMGG `builds[]`：

```text
英雄
↓
预计算 Build
↓
核心装备
↓
情境装备
↓
技能 / 召唤师技能
```

可以展示：

```text
推荐路线：
鞋 → A → B → C
```

但不声称：

```text
“根据这局实时计算出的最佳下一件”
```

---

# 31. 未来可选装备浮窗

如果后续只想做轻量版本，可以实现：

```text
推荐 Build 路线
+
当前已购买装备
↓
显示路线中的下一件
```

这只是：

```text
Build Progress
```

不是动态统计算法。

例如：

```text
Build:
鞋 → 破败 → 盾弓 → 无尽

已有：
鞋 + 破败

显示：
Next: 盾弓
```

这一功能可作为 Phase 2，不进入首版 MVP。

---

# 32. 故障与回退

## ARAMGG 上游不可用

```text
继续服务 current snapshot
```

## Developer Key 全部无额度

```text
继续服务 current snapshot
等待次日 / Owner Key / 新共享 Key
```

不能让客户端报废。

## 中心服务器暂时不可用

```text
Client Local Cache
```

继续使用上一版本。

## SGP 不可用

```text
LCU Match History fallback
```

## LCU Match History 也失败

```text
队友战绩显示 N/A
```

不影响：

- 当前英雄
- Bench
- ARAMGG 英雄统计
- 海克斯 OCR

---

# 33. 隐私原则

友方战力分析数据只用于当前客户端展示。

第一版不上传到我们的服务器：

- 队友 PUUID
- 队友 Riot ID
- 队友战绩
- 队友 KDA
- 选人阵容

查询逻辑尽量本地执行：

```text
League Client
→ 本地 Client
→ SGP / LCU
→ 本地计算
→ 本地展示
```

中心服务器只负责：

- ARAMGG 快照
- 用户账户
- 用户设置
- opt-in Developer Key

---

# 34. 日志脱敏

客户端日志禁止长期记录完整：

```text
PUUID
SGP Access Token
Entitlements Token
API Key
Authorization Header
```

调试时：

```text
puuid:
abcdef12...90ab
```

Token：

```text
[REDACTED]
```

---

# 35. 许可证与源码边界

## 35.1 Sona

Sona 仓库包含：

```text
GNU AGPL-3.0
```

因此本项目计划：

> 参考其公开实现的接口流程、状态机、异常处理和 UI 信息设计，自己重新实现所需的两项功能。

不直接把：

```text
features.ts
lcu.ts
```

整文件或大量实现代码复制到本项目。

如果未来决定直接使用 / 修改 Sona 源码，则需要单独评估并遵守 AGPL-3.0 的相关义务。

---

## 35.2 ARAMGG Client

截至本文编写时，公开仓库根目录未看到标准 `LICENSE` 文件，`package.json` 也未声明 `license` 字段。

因此：

- 本地研究 / 验证可先进行。
- 在公开发布二进制安装包、公开 Fork、商业分发之前，应向 ARAMGG Client 作者确认衍生使用和分发许可。

这是项目发布前必须完成的 Gate。

---

# 36. ARAMGG API 使用边界

本项目会使用：

```text
用户主动 opt-in
```

的 Developer API Key 来帮助公共 Snapshot 更新。

这一模式涉及：

```text
用户 A 的额度
→ 获取新版数据
→ 中心缓存
→ 多用户客户端读取
```

正式公开运营前，应向 ARAMGG API 运营方确认：

- 是否允许服务器缓存数据
- 是否允许向自己的客户端再分发缓存
- 是否允许多个用户主动贡献 Developer API Credits
- 是否存在必须保留的署名 / 来源说明
- 是否存在商业使用限制

未确认前：

```text
个人 / 内部开发环境
```

可以先验证架构，不建议直接公开运营。

---

# 37. MVP 功能范围

## 必须完成

### Client

- [ ] ARAMGG Client 可正常构建
- [ ] 保留 LCU 自动发现
- [ ] 保留当前英雄识别
- [ ] 保留 Bench
- [ ] 保留 PaddleOCR
- [ ] 保留海克斯 Overlay
- [ ] 改为读取自己的中心数据 Origin
- [ ] 新增 myTeam 获取
- [ ] 新增 SGP Match History
- [ ] 新增 LCU Match History fallback
- [ ] 计算胜率 / KDA
- [ ] 新增 ChampSelect 友方数据 Overlay
- [ ] 队友换楼自动重新绑定
- [ ] 当前英雄统计与玩家战绩同时展示

### Server

- [ ] 用户注册 / 登录
- [ ] Snapshot current
- [ ] Version Watcher
- [ ] dataVersion 对比
- [ ] 新版本才同步
- [ ] Snapshot 校验
- [ ] immutable version
- [ ] rollback
- [ ] Owner Key
- [ ] 用户 Key opt-in
- [ ] Key 加密
- [ ] Shared Key Pool
- [ ] daily_share_limit
- [ ] Client Data API

---

# 38. Phase 1 开发顺序

## Phase 0：许可确认

- 联系 ARAMGG Client 作者。
- 联系 ARAMGG API 运营方。
- 确认数据缓存 / 分发边界。

可以与开发验证并行，但必须在公开发布前完成。

---

## Phase 1：原版客户端跑通

```text
clone
npm install
npm run prepare:client-data
npm run dev
```

验证：

- LCU
- ChampSelect
- OCR
- Overlay
- Build 数据

这个阶段不改功能。

---

## Phase 2：中心 Snapshot

完成：

```text
config watcher
dataVersion
snapshot
manifest
current
rollback
```

先只用 Owner Key。

---

## Phase 3：客户端切中心源

只修改：

```text
DATA_API_ORIGIN
```

确保所有已有功能保持正常。

---

## Phase 4：用户系统 + Key Pool

完成：

- 注册
- 登录
- opt-in
- Key 加密
- 每日贡献上限
- Key rotation

---

## Phase 5：友方战绩

先实现无 UI 的 service：

```text
myTeam
↓
PUUID
↓
queueId
↓
SGP
↓
WR / KDA
```

输出日志验证正确性。

---

## Phase 6：ChampSelect Overlay

完成：

- League Client 窗口追踪
- 五个队友位置布局
- 玩家胜率
- KDA
- 英雄胜率
- Tier
- 换楼更新

---

## Phase 7：稳定性

重点测试：

- League Client 重启
- LCU 断连
- ChampSelect dodge
- 队友换楼
- 主播 / 隐私模式
- SGP timeout
- 上游 ARAMGG timeout
- Snapshot 更新失败
- Key 额度耗尽
- 中心服务器断网
- 1920×1080
- 2K
- Windows DPI 125%
- Windows DPI 150%

---

# 39. 验收标准

## 数据中心

- 相同 `dataVersion` 不产生完整同步。
- 新版最多生成一次 Sync Job。
- Snapshot 未完全通过校验前不能成为 current。
- Key 耗尽后旧版仍可用。
- 可以一键回滚上一 Snapshot。

## Client

- 无服务器时可使用本地缓存启动。
- 无 SGP 时不影响海克斯功能。
- 无战绩数据时单个玩家显示 N/A。
- 当前英雄识别不使用 OCR。
- 海克斯识别失败时不产生错误推荐。
- 不执行任何 League Client 自动操作。

## Team Stats

- 当前 queueId 正确。
- ARAM 只统计 ARAM 战绩。
- 胜率计算正确。
- KDA 计算正确。
- 换楼后玩家数据不串位。
- 同一 PUUID 不重复高频查询。

---

# 40. 项目关键设计决定

最终确定：

### 客户端主体

```text
ARAMGG Client
```

### 海克斯识别

```text
原版 PaddleOCR 实现
```

### 当前英雄

```text
LCU championId
```

### 英雄 / 海克斯 / Build 数据

```text
ARAMGG
→ 中心 Snapshot
→ Client
```

### 数据更新

```text
Server-controlled
Version-based
```

### API Credits

```text
Owner Key
+
User opt-in shared Key Pool
```

### 队友战绩

```text
参考 Sona
LCU + SGP
重新实现
```

### UI

```text
独立 Electron Overlay
```

### 明确不采用

```text
Pengu
DOM Injection
自动化操作
Oracle
AI 推荐算法
```

---

# 41. GitHub / 技术来源清单

## 主项目

ARAMGG Client

https://github.com/valkia/aramgg_client

重点：

```text
src/main/services/lcu/lcu-service.ts
src/main/image-analyzer.ts
src/main/data-loader.ts
src/shared/augment-ranking.ts
docs/client-api-strategy.md
COMPLETE_ARCHITECTURE.md
```

---

## 友方战绩参考

Sona

https://github.com/WJZ-P/sona

重点：

```text
src/lib/features.ts
src/lib/lcu.ts
LICENSE
```

只参考：

```text
Team Stats
ChampSelect Stats
SGP
LCU fallback
PUUID mapping
```

---

## 数据平台

ARAMGG

https://aramgg.com/zh-CN

Developer API：

https://data.dtodo.cn/api/v1/zh-CN/docs/cf-data-api.md

---

# 42. 项目一句话架构总结

```text
ARAMGG Client
负责：
LCU + OCR + Overlay

ARAMGG Central Snapshot
负责：
英雄 / 海克斯 / Build 统计数据

LCU + SGP
负责：
当前队友近期战绩

自己的 Server
负责：
版本缓存、更新、用户和共享 API Key

用户
负责：
所有最终游戏操作
```

最终项目不是一个“自动玩游戏”的工具，而是一个：

> **本地只读游戏状态 + 真实统计数据 + 选人战力分析 + 海克斯 OCR 推荐的 Windows 辅助客户端。**
