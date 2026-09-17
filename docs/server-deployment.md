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

服务器 `.env` 保存随机生成的数据库密码，权限 `0600`。Owner Key 保存在 `secrets/aramgg_owner_key`，由服务器私密目录保护，并以只读 secret 文件挂载给 `probe`。**公开 API 容器不挂载 Key。** 不要提交这两个文件，也不要把真实 Key 放入命令行参数。

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

## 当前功能边界

已部署的服务提供快照读取、校验、发布及回滚底座；真实数据的全量转换、断点续传和定时同步尚未完成。

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
- 本地 Docker 测试共 9 项全部通过，包括真实 PostgreSQL 并发测试以及模拟上游的额度 / 缓存 / 错误处理测试。
