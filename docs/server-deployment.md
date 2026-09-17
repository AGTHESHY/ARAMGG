# 测试服务器部署

部署目标：`38.92.15.80`，目录 `/opt/ARAMGG`。使用独立的 Compose 项目 `mayhem-companion`，不复用其他项目数据库。

## 服务与资源

- `api`：Fastify，内存上限 128 MiB，Node 堆上限 80 MiB。
- `postgres`：PostgreSQL 16，内存上限 160 MiB，shared_buffers 32 MiB。
- `probe`：手动运行的上游接口测试，不是常驻同步进程；内存上限 128 MiB。
- API 只绑定服务器 `127.0.0.1:8788`；数据库不映射端口。
- 常驻容器设置自动重启和日志轮转，不自动清理数据卷。

部署文件是根目录 `compose.server.yaml`，与本地开发的 `compose.yaml` 分开使用。

```sh
cd /opt/ARAMGG
docker compose -f compose.server.yaml up -d --build api
docker compose -f compose.server.yaml ps
```

服务器 `.env` 保存随机生成的数据库密码，权限 `0600`。多个 Owner Key 逐行保存在 `secrets/aramgg_owner_key`；共享 Key 的 32 字节主加密密钥以 Base64 保存在 `secrets/key_encryption_key`。这些文件只以只读 secret 挂载，绝不提交仓库或写入日志。

## 通过 SSH 隧道测试

没有配置 HTTPS 域名前，使用 SSH 隧道连接。这里用本机 8789，避免与本地开发服务的 8788 冲突：

```sh
ssh -N -L 127.0.0.1:8789:127.0.0.1:8788 mca-test
```

另一个终端：

```sh
curl http://127.0.0.1:8789/health/ready
```

Windows 可改用 `ssh -N -L 127.0.0.1:8789:127.0.0.1:8788 root@38.92.15.80`，前提是该电脑已配置授权 SSH 密钥。后续有域名后添加 HTTPS 入口，再将客户端中心源配置为该 HTTPS 地址。

## 上游 Key 验证与额度

依据 [官方 Developer API 文档](https://data.dtodo.cn/api/v1/zh-CN/docs/cf-data-api.md)：

- `config.json` 公开免费；认证 `HEAD` 不扣 data credits。
- 英雄榜、海克斯表、装备表分别 1 credit。
- 单英雄详情 2 credits。

```sh
docker compose -f compose.server.yaml --profile tools run --rm probe
```

测试最多请求 5 credits 的付费数据：三个基础表和一个英雄详情。响应被缓存在服务数据卷的 `upstream-probe/` 下，相同版本重复测试复用缓存。输出仅包含版本、条目数、剩余额度等汇总；不会输出 Key 或上游错误响应正文。

测试校验语言、资源身份及开始 / 结束版本，拒绝混合版本；不会自动重试可能已经计费的失败请求。此命令**不发布快照**，也不会把单个英雄的测试数据标为完整版本。

## 正式中央缓存

正式同步使用断点续传缓存，每次最多使用 Key 当日可用的全部 credits：

```sh
docker compose -f compose.server.yaml --profile tools run --rm sync
```

同步进度保存到中央数据卷的 `upstream-cache/{locale}/{dataVersion}/sync-status.json`。基础表和每个英雄详情逐文件原子落盘；重复运行会复用同版本缓存，不重复扣费。接口 `GET /api/client/v1/sync/status` 返回当前进度。

只有所有英雄详情下载完成、语言和版本保持一致、英雄分片覆盖完整、引用及 hash 校验全部通过后，才发布不可变快照并切换 `current`。额度不足时状态保持 `downloading`，客户端 config 继续返回 503，不会接触半成品。

测试服务器安装 `aramgg-central-sync.timer`，每 15 分钟检查一次公开版本。版本一致且中央缓存完整时不会发起付费请求；版本不一致或下载尚未完成时，复用已有文件并继续下载。同步按文件中的 Owner Key 顺序轮换，随后使用明确 opt-in 的共享 Key；每个共享 Key 独立执行每日贡献上限。

## 客户端、中央快照与 Key 的边界

正式读取顺序固定为：

1. 客户端优先使用本机已经完整校验的快照。
2. 本地缺失时，客户端向中央数据接口下载完整快照；此请求不携带 Developer API Key。
3. 中央发现上游版本高于中央版本时，由服务器同步任务先使用 Owner Key，再轮换使用用户明确开启共享的 Key。
4. 新版未完成或所有 Key 不可用时，中央继续提供上一份完整快照，不把半成品切成 `current`。
5. 只有客户端没有本地完整快照，且中央也没有任何可用完整快照时，客户端才显示数据获取失败。

Owner Key 永远只保存在服务器，不进入 EXE、客户端配置或日志。用户填写 Key 但没有开启共享时，Key 使用 Electron 系统安全存储加密后留在本机，不上传服务器，也不参与公共快照同步。服务端已实现注册登录、AES-256-GCM 加密、默认关闭共享、每日贡献上限、撤销和轮换；客户端共享上传必须等 HTTPS 入口启用后才开放。

## 当前功能边界

服务已具备真实数据全量转换、逐文件断点续传、定时同步、不可变快照发布及回滚；不完整版本不会成为中央 `current`。

完整单语言首次同步预计需要 `3 + 2 × 英雄数量` credits。Key 的 200 credits/日不足以在同一天完成当前完整英雄池，需要实现跨日缓存续传，或获得足够的上游配额。不能绕过 Developer API 使用官方客户端接口来规避额度。

服务器未导入演示数据；在完整真实快照发布前，`/health/ready` 的 `dataReady` 为 `false`，`/api/client/v1/config` 返回 503。这表示数据未就绪，不代表进程部署失败。

停止和恢复本项目：

```sh
docker compose -f compose.server.yaml stop
docker compose -f compose.server.yaml start
```

不要使用带 `-v` 的删除命令，避免误删数据库与快照。

## 2026-09-17 实测记录

- 服务器部署与 SSH 隧道 HTTP 检查通过。
- API 进程与数据库正常，尚未发布真实快照，config 正确返回 503。
- Owner Key 的 HEAD 鉴权通过，初始额度 200 credits。
- 真实数据版本 `16.18.2`，补丁 `16.18`。
- 读取 173 个英雄、211 个海克斯、307 件装备。
- 测试英雄 ID 157，详情含 4 套 Build、126 个海克斯条目。
- 首次测试请求消耗 5 credits，剩余 195；完整单语言首次同步预计 349 credits。
- 相同版本复测复用本地缓存，新增消耗 0 credits，剩余仍为 195。
- 最终两个服务均 healthy；API 约占 24 MiB、PostgreSQL 约占 44 MiB，服务器可用内存约 635 MiB。
- 正式简体中文缓存已完成：版本 `16.18.2` 共 173 个英雄，第二个 Owner Key 复用首轮 98 个详情后补齐剩余 75 个；中央 `current` 已发布，API 返回 `dataReady: true`。
- `aramgg-central-sync.timer` 已启用，每 15 分钟检查版本；相同版本完整缓存不会重复下载或扣费。
- 第二个 Owner Key 已加入服务器轮换，继续复用首轮 98 个英雄详情的缓存。
