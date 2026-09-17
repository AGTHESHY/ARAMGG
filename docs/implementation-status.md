# 首阶段实施记录

日期：2026-09-17

## 已完成

- 从 GitHub 拉取 `valkia/aramgg_client` 至 `client/`，保留 Git 历史。
- 从 GitHub 拉取 `WJZ-P/sona` 至 `references/sona/`，源码未修改、不参与构建。
- 两个仓库基线写入 `sources.lock.json`。
- 创建 Fastify + TypeScript 中心服务，锁定 npm 依赖。
- 创建 PostgreSQL + API Docker Compose，只开放本机 8788。
- 数据服务支持三种语言、默认中文兼容路径、manifest、版本文件、ETag。
- 发布前检查 schema、英雄分片覆盖、强化引用、文件长度与 SHA-256。
- PostgreSQL advisory lock 防并发发布；唯一版本记录；事务切换 current。
- 版本文件不可覆写，回滚前重验文件，重复发布不撤销回滚。
- 显式 demo seed 命令；未发布数据时 config 返回 503。
- 客户端的数据下载与运行默认源切至本地中心；支持构建时配置中心地址。
- 修复上游路径工具在 Mac 验证 Windows 路径时混用分隔符的问题。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| 客户端单元测试 | 54 个文件、238 项通过 |
| 客户端 ESLint | 通过 |
| 客户端 TypeScript / Vue 类型检查 | 通过 |
| 客户端 Electron / Vue 构建 | 通过 |
| PaddleOCR 已提交图片样例 | 通过；三卡、部分卡、无匹配及不同分辨率 |
| 服务端类型检查 / Docker 构建 | 通过 |
| 服务端 Docker 测试 | 6 项全部通过，包括两个服务实例并发 24 次仅发布一次 |
| 原客户端数据准备脚本对接本地 API | 三种语言全部下载并校验成功 |
| Docker API / PostgreSQL 健康检查 | healthy |

测试运行时：客户端使用本机 Node 24.16.0；服务端容器固定 Node 22.18.0。服务端集成测试使用独立临时 PostgreSQL schema，不触碰开发环境 current。

## 当前运行状态

- API：`http://127.0.0.1:8788`
- 三种语言当前快照：`demo.1`，`source=demo`
- 客户端 `resources/client-data` 已准备同版本演示包。
- 演示数据只验证协议、存储和下载链路，不代表真实英雄 / 海克斯统计。
- 没有生成 Windows 安装包，没有声称在真实游戏中完成验证。

## 已发现的上游差异

当前上游除了文档列出的推荐能力，还包含符文 / 装备写入、战绩上传等代码。本轮只做数据源与构建底座，没有把原版客户端认证为只读产品。后续应在独立产品配置下关闭或移除这些入口，再进行只读边界验收。

安装原客户端锁定依赖时 npm 报告 19 项漏洞（1 low、3 moderate、14 high、1 critical）。本轮保留原始锁文件，未执行可能破坏兼容性的自动强制升级；需后续逐项核查可达性与升级影响。新建服务端依赖安装时报告 0 项。

## 后续顺序

1. 核实 Developer API 完整响应、额度语义与版本一致性，完成真实数据转换器。
2. 增加 Version Watcher、持久化 Sync Job、重试与取消；初期仅使用服务端 Owner Key。
3. 收敛原客户端的写入与上传功能，确保只读产品边界。
4. 实现本地队友战绩服务，按实际 queueId、区服与 Token 生命周期适配。
5. 实现选人浮窗、窗口跟随与换楼重绑定。
6. 用户系统与 opt-in Key Pool；Windows 实机验证及发布检查。

当前没有启用自动同步、没有收集用户 Key，也没有请求上游付费数据。
