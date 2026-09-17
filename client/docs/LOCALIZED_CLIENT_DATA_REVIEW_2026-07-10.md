# 客户端多语言数据支持专项审查

> 审查日期：2026-07-10
>
> 审查提交：`1b71c9816d65b7fad0f9693a8b1d55af539b3018` (`feat: add localized client data support`)
>
> 审查范围：数据语言设置、运行时数据加载、打包预加载、发布校验、海克斯 OCR、英雄详情与浮窗缓存
>
> 当前状态：客户端与服务端三语言链路已完成真实下载、打包和解包资源验证；仅剩安装版断网人工验收

本文记录提交 `1b71c98` 引入多语言客户端数据支持后仍存在的实现缺口。文中的行号对应审查时源码；后续以文件、函数名和测试行为为准。

## 结论摘要

该提交完成了语言枚举、语言级运行时缓存目录、设置页入口和多语言 OCR 名称索引的主体实现，但审查时尚未形成端到端可发布能力。主要问题包括：

- 语言切换 IPC 会在状态已经写入后抛出 `ReferenceError`。
- 打包和发布流程仍只预加载、校验默认简体中文数据。
- OCR 首次初始化会为所有支持语言准备完整数据集，而不是只加载海克斯名称。
- OCR 会把首次加载到的部分语言集合永久缓存到进程结束。
- 英雄详情和浮窗的请求、缓存与刷新流程没有把 locale 作为完整身份的一部分。
- 未标记 locale 的远端响应可能被错误归类到用户请求的语言目录。
- 当前单测和 CI 没有覆盖多语言数据契约。

## 修复进度

更新时间：2026-07-10

| 问题 | 客户端状态 | 完成内容 |
| --- | --- | --- |
| P1-1 语言切换 IPC 抛错 | 已完成 | 窗口广播移入 `window-manager.ts`；新增事务式语言控制器；准备失败时不写 store、不激活、不广播 |
| P1-2 安装包只有默认中文 | 已完成 | 服务端已发布英文/繁中数据；构建脚本、pack 与 release workflow 逐语言生成并校验指针、版本目录和必需文件 |
| P1-3 OCR 下载完整数据集 | 已完成 | 新增 OCR 专用最小加载，只读取 manifest 与 `augments.json`；非当前语言后台加载 |
| P1-4 OCR 永久缓存部分语言 | 已完成 | 按语言记录成功、进行中和重试时间；失败 30 秒后允许重试；实际数据 locale 必须匹配请求 |
| P2-1 请求与缓存未隔离 locale | 已完成 | 主进程请求、数据聚合和渲染缓存均固定 locale；可见窗口收到切换事件后丢弃旧请求并刷新 |
| P2-2 未声明 locale 的响应被错误归类 | 已完成 | 非默认配置和 manifest 必须显式声明匹配 locale；切换返回实际生效语言 |
| 测试与 lint 缺口 | 已完成 | 新增多语言构建、运行时数据、事务切换和 OCR 非阻塞测试；ESLint 增加 TypeScript 解析及 IPC `no-undef` |
| 旧用户缓存遮蔽新版 bundled 数据 | 已完成 | 完整本地候选按 dataVersion、生成时间和激活时间排序；前台数据与 OCR 均优先使用较新完整版本 |
| 打包下载长时间无进度 | 已完成 | 逐语言输出文件/字节进度、活动文件、复用/下载计数、耗时和定时 heartbeat |
| OCR fixtures 依赖用户缓存和线上赛季数据 | 已完成 | 测试使用临时用户目录、固定 locale 和最小三语言名称库，不再读取真实缓存、LCU 或线上数据 |

### 真实服务端验证结果

首次验证时，服务端尚未发布非默认语言：

- `/api/client/v1/config?locale=en-US`、`?lang=en-US` 和 `?language=en-US` 均返回 `locale: zh-CN`。
- `/api/client/v1/en-US/config` 与 `/api/client/v1/config/en-US` 返回 404。
- 三种英文 localized manifest 候选路径和三种繁中候选路径均返回 404。
- `npm run prepare:client-data` 能完成 `zh-CN`，随后在 `en-US` 严格 locale 校验处停止，不再把中文数据写入英文目录。

客户端当时按预期拒绝不可用的英文/繁中切换，证明严格 locale 校验没有用默认中文冒充其他语言。

服务端发布后再次使用 `https://data.dtodo.cn` 验证：

- `zh-CN`、`en-US`、`zh-TW` config 和 manifest 均显式返回对应 locale，数据版本均为 `16.13.5`。
- 每种语言包含 49 个打包文件和 44 个 champion shards；三语言合计约 70.89 MB。
- 样例内容分别为简中 `质变：棱彩阶` / `梅尔`、英文 `Transmute: Prismatic` / `Mel`、繁中 `質變：稜鏡` / `梅爾`，不是只修改 locale 标签。
- `npm run prepare:client-data` 完成三个指针和语言级版本目录；中断续跑会复用已校验文件。
- `npm run pack` 成功，`build/win-unpacked/resources/client-data` 中三个指针、manifest 和 49 个必需文件均匹配 locale 与 `16.13.5`。

### 构建进度与调试覆盖

- `npm run prepare:client-data` 会按语言输出文件数、字节百分比、下载/复用计数、活动文件和耗时；未完成下载每 15 秒输出 heartbeat。
- `ARAMGG_CLIENT_DATA_PROGRESS_INTERVAL_MS` 可在构建诊断时调整 heartbeat 毫秒间隔，默认 `15000`；正式构建通常不需要设置。
- `ARAMGG_OCR_LOCALE` 只用于测试或诊断时固定 OCR 语言提示。生产环境不要设置，正常运行继续读取 LCU `/riotclient/region-locale`。

## 问题清单

### P1-1：语言切换 IPC 必然抛错（已修复）

**证据**

- [`src/main/modules/ipc-handlers.ts`](../src/main/modules/ipc-handlers.ts#L438) 的 `locale-set` 处理器调用了 `notifyAllWindows`。
- 该模块没有定义或导入 `notifyAllWindows`；现有同名函数属于 `app-config.ts` 的模块私有实现。
- `setDataLocale()` 和 `store.set()` 在异常发生前已经执行。

**影响**

- 渲染进程收到 IPC reject，并提示“切换数据语言失败”。
- 主进程内存和 electron-store 实际已经切换，界面反馈与真实状态不一致。
- 重启后会加载用户以为切换失败的语言。

**修复要求**

- 将窗口广播能力提取到可复用的主进程模块，或在 `ipc-handlers.ts` 内显式实现并导入。
- 语言切换应是事务式流程：验证目标语言、准备或确认可用数据、提交状态、广播、返回实际生效语言。
- 失败时不得留下已持久化但未向用户确认的半完成状态。

**完成记录**

- `notifyAllWindows` 由 `window-manager.ts` 显式导出，IPC 不再引用未定义符号。
- `data-locale-controller.ts` 保证 prepare 成功且 effective locale 精确匹配后才提交状态。
- 启动时会重新验证旧 store 中的 locale；旧版本留下的无效语言会被重置为默认语言。

### P1-2：安装包只包含默认简体中文预加载数据（已修复）

**证据**

- [`scripts/fetch-client-data.mjs`](../scripts/fetch-client-data.mjs#L240) 只请求一次 `/api/client/v1/config`。
- 数据仍写入 `versions/<dataVersion>/`，指针仍只有 `current.json`。
- [`src/main/data-loader.ts`](../src/main/data-loader.ts#L420) 对非默认语言只读取 `versions/<locale>/<dataVersion>/`。
- `getCurrentDataFileNames()` 对英文和繁中只读取 `current.en-US.json`、`current.zh-TW.json`。
- [`scripts/pack-electron.mjs`](../scripts/pack-electron.mjs#L153) 和 [`.github/workflows/release-windows.yml`](../.github/workflows/release-windows.yml#L70) 只检查 `current.json` 和默认语言 shard。
- 审查时生成的 `resources/client-data/` 中不存在英文、繁中指针和语言版本目录。

**影响**

- 英文或繁中用户首次使用时无法命中安装包预加载数据。
- 在线时，前台数据请求需要先下载目标语言完整数据集。
- 离线时，会等待网络失败后回退到中文，无法提供所选语言。
- 违反英雄详情和海克斯弹窗“完整本地数据立即渲染、远端后台刷新”的本地优先约束。

**修复要求**

- 打包脚本遍历 `SUPPORTED_DATA_LOCALES` 对应的固定构建时语言列表。
- 为每种语言生成独立指针与版本目录，并在指针中写入明确的 `locale`。
- `pruneInactiveVersions()` 必须按语言目录清理；不能把其他语言目录识别为旧版本后删除。
- 打包日志和 release workflow 必须逐语言验证指针、manifest、基础 JSON、shard 数量与完整性。
- 构建脚本的 manifest 逻辑路径和 URL 解析规则应与运行时 `data-loader.ts` 保持一致。

**完成记录**

- 默认中文继续使用 `current.json` 与 `versions/<dataVersion>`，兼容旧客户端。
- 英文和繁中分别使用 `current.en-US.json`、`current.zh-TW.json` 与语言级版本目录。
- 清理函数保留其他语言目录；构建日志和 GitHub release workflow 逐语言验证必需文件和 shard。
- 模拟三语言 API 的打包集成测试已通过；真实 `npm run prepare:client-data`、`npm run pack` 和解包资源检查均已通过。

### P1-3：OCR 初始化会准备三个语言的完整数据集（已修复）

**证据**

- [`src/main/image-analyzer.ts`](../src/main/image-analyzer.ts#L300) 的 `initAugmentDatabase()` 使用 `Promise.allSettled` 并发加载全部支持语言。
- `loadAugmentBaseForLocale()` 最终进入 `getActiveDataSet()`。
- 无完整本地版本时，[`prepareDataVersion()`](../src/main/data-loader.ts#L1028) 会强制获取 champions、items、manifest 和全部 champion shards，而不只是 `augments.json`。

**影响**

- 即使用户只使用简体中文，第一次 OCR 也会等待英文和繁中数据准备。
- 在线安装可能在首次 OCR 前下载两套额外完整数据。
- 离线安装会等待远端请求超时后才能继续。
- 标题区域 OCR 快速路径的首帧延迟明显增大。

**修复要求**

- 先解析 LCU 游戏语言，再优先加载该语言和必要回退语言。
- 为 OCR 提供只加载 manifest 与 `augments.json` 的窄接口，避免触发完整英雄数据准备。
- 其他语言名称应在后台增量补充，不能阻塞当前截图分析。

**完成记录**

- `loadAugmentBaseForOcrLocale()` 可从不完整语言缓存中只读取 manifest 与海克斯基础数据。
- 当前 LCU 游戏语言和默认回退语言属于前台加载，其余语言后台加载。
- 单测使用永不完成的后台语言 Promise，验证当前语言 OCR 不会等待它们。

### P1-4：OCR 会永久缓存不完整语言集合（已修复）

**证据**

- `initAugmentDatabase()` 只要 `AUGMENT_DATABASE` 非空就直接返回。
- 多语言加载允许部分成功；运行时数据加载还可能把请求语言回退到默认中文。
- `image-analyzer.ts` 只接收海克斯数组，无法区分请求语言和实际数据语言。

**影响**

- 首次离线或远端短暂失败时，数据库可能只有中文名称。
- 网络恢复后不会重试缺失语言，本次进程中的英文或繁中 OCR 仍不可用。
- 日志中的“已加载语言数”可能把中文回退结果误记为英文或繁中成功。

**修复要求**

- 单独维护 `loadedLocales`、`failedLocales` 和实际生效语言。
- 缺失语言应允许带退避的后台重试。
- `loadAugmentBaseForLocale()` 应返回实际数据 locale，或提供禁止跨语言回退的 OCR 专用接口。

**完成记录**

- OCR 按 locale 分别维护 loaded、pending 和 retry 状态。
- 失败语言不会被标记为成功，30 秒退避后由后续 OCR 帧重试。
- 后台新增语言完成后会使匹配索引失效，下次匹配自动重建。

### P2-1：英雄数据请求和缓存没有完整隔离 locale（已修复）

**证据**

- [`src/main/modules/ipc-handlers.ts`](../src/main/modules/ipc-handlers.ts#L1137) 的 `championDataLoadRequests` 只以 champion ID 作为 key。
- [`src/renderer/components/AugmentWinrateOverlay.vue`](../src/renderer/components/AugmentWinrateOverlay.vue#L517) 的请求合并和 15 秒缓存也只比较 champion ID。
- 只有设置页 `Display.vue` 监听 `locale-changed`；英雄详情和海克斯浮窗没有失效缓存或重新加载。
- [`getChampionDetailData()`](../src/main/data-loader.ts#L2134) 只给部分子调用传入已捕获的数据 locale，其他调用继续读取可变的全局 locale。

**影响**

- 切换语言后，已打开窗口继续显示旧语言。
- 新请求可能复用切换前的 in-flight Promise 或 15 秒缓存。
- 切换发生在数据加载中时，一份英雄详情响应可能混合两个语言的数据。

**修复要求**

- 请求 key、内存缓存 key 和渲染缓存 key 都使用 `locale:dataVersion:championId`。
- 一次聚合加载必须捕获一个不可变 `ActiveDataSet`，并显式传给所有子加载函数。
- 英雄详情、顶部浮窗和右侧推荐窗口监听语言变化，清理本地缓存并在可见时重新加载。
- 旧 locale 的异步响应必须通过 locale 或 generation token 判定为过期并丢弃。

**完成记录**

- 主进程英雄请求使用 `locale:championId` 合并键，并把捕获的 locale 传给完整聚合链路。
- 聚合结果返回实际 `locale` 与 `dataVersion`。
- 渲染缓存和 in-flight 请求包含 locale；语言事件增加 generation 并刷新可见英雄内容。
- 版本信息中的数据语言和数据版本来自实际 ActiveDataSet，不再用远端回退配置冒充。

### P2-2：未标记语言的远端响应可能被错误归类（已修复）

**证据**

- [`loadDataApiConfig()`](../src/main/data-loader.ts#L876) 接受没有 `locale` 的配置，并使用请求 locale 补齐。
- [`loadManifestForConfig()`](../src/main/data-loader.ts#L957) 同样接受没有 `locale` 的 manifest。
- 如果服务端忽略 locale query 或返回旧格式默认中文数据，客户端仍会把它写入目标语言目录。

**影响**

- 中文数据可能被缓存为 `en-US` 或 `zh-TW`。
- 语言选择器显示目标语言，但英雄和海克斯内容仍是中文。
- 错误缓存会在后续离线启动中继续生效。

**修复要求**

- 非默认语言响应必须包含可验证且匹配的 `locale`。
- 跨语言回退只能返回独立的 `effectiveLocale`，不能写入请求语言目录。
- 设置页成功提示使用实际生效语言，并明确展示回退状态。

**完成记录**

- 默认中文保留对旧格式无 locale 响应的兼容。
- 英文和繁中必须由 config 与 manifest 显式声明相同 locale。
- 请求语言不可用时切换失败并恢复选择器，不写入错误语言缓存。

### P2-3：语言选择器只切换数据，项目界面仍固定中文（已修复）

**影响**

- 用户选择 English 或繁體中文后，英雄、海克斯和装备数据可能已经切换，但主窗口、英雄详情、席位推荐、浮窗和赛后海报仍显示简体中文。
- 各 BrowserWindow 独立挂载 renderer，若不在统一入口初始化 locale，新打开的浮窗还会回到默认语言。

**完成记录**

- 引入 `vue-i18n`，在 `src/renderer/i18n/` 集中维护 `zh-CN`、`en-US`、`zh-TW` 三套同构消息。
- 渲染入口在挂载 Vue 前等待 `locale-get`，并为每个窗口统一监听 `locale-changed`。
- 主窗口语言项改为「界面与数据语言」；仍由 `locale-set` 先准备目标数据，只有提交成功后才同步 UI，失败不产生半切换状态。
- 主窗口、窗口偏好、英雄监控、出装配置、席位推荐、英雄详情、顶部浮窗、右侧推荐列表、更新状态和赛后海报画布均已迁移。
- 数字、时间、数据来源以及带多语言字段的装备/海克斯说明按当前 renderer locale 格式化。
- 新增资源键一致性、locale 归一化和界面/数据派生文案同步单测。
- 语言提交成功后立即结束局部 loading；远端版本信息改为后台刷新并丢弃旧 locale 响应，不再把接口等待串到切换主链路。
- 语言入口使用状态栏右上角的主题化菜单和局部旋转进度，状态区恢复客户端版本、数据版本、LCU 连接一行三列；不再显示“自动监听”徽标或设置 `cursor: wait`，其余主界面在准备期间保持可交互。

## 测试与 CI 缺口

修复后以下命令均通过：

```text
npm run test:unit     # 24 个测试文件，86 个测试通过
npm run lint
npm run type-check
npm run build
npm run test:augment-ocr
npx -p npm@10 npm ci --ignore-scripts
```

本次补充的覆盖包括：

- 三语言指针、版本目录和默认目录清理规则。
- 模拟三语言 API 的完整构建输出。
- 未声明 locale 的远端配置不能冒充非默认语言。
- OCR 从部分语言缓存最小加载，且不等待后台语言。
- 英雄详情聚合固定使用显式请求 locale。
- 语言切换 prepare 失败时不产生状态副作用。
- TypeScript ESLint 解析和 `ipc-handlers.ts` 的未定义符号检查。
- release workflow 对三种语言的指针、manifest、基础文件和 shard 检查。
- 旧用户缓存与较新 bundled 数据同时存在时，完整前台数据和 OCR 名称均选择新版。
- OCR fixtures 使用固定临时数据，不受用户缓存、LCU 状态和线上数据删除/改名影响。

发布后真实验证已完成：

- 真实 `npm run prepare:client-data` 三语言成功验证。
- `npm run pack` 和解包目录三语言资源检查。
- 24 个单测文件共 86 项测试、lint、type-check、build 和隔离 OCR fixtures 通过。

仍需执行安装版断网启动、语言切换、英雄详情和 OCR 人工验收。

## 后续发布顺序

1. 在干净 Windows 环境安装 `build/aramgg_client Setup 0.1.19.exe`。
2. 断网后分别切换 `zh-CN`、`en-US`、`zh-TW`，检查全部活动窗口文案、英雄详情、海克斯推荐和 OCR 名称。
3. 人工验收通过后再发布安装包；release workflow 继续逐语言执行资源完整性门禁。

## 完成验收标准

- [ ] 三种支持语言的全新安装包在断网环境下均能立即打开英雄详情和海克斯推荐。（等待安装版人工验收）
- [x] 切换语言不会引用未定义广播函数，准备失败不会修改生效语言。
- [x] 主窗口和所有活动浮窗的界面文案与数据 locale 同步切换，准备失败时保持原语言。
- [x] 已打开的英雄详情、顶部浮窗和右侧推荐会使旧缓存失效并刷新。
- [x] 切换期间完成的旧语言请求不会覆盖新语言界面。
- [x] OCR 首次分析只等待当前游戏语言和默认回退语言所需的最小海克斯数据。
- [x] 某语言首次加载失败后可在进程内按退避重试。
- [x] 安装包 CI 对 `zh-CN`、`en-US`、`zh-TW` 分别验证指针、manifest、必需文件与 shard 完整性。
- [x] 旧用户缓存不会遮蔽更新安装包中同语言的较新完整 bundled 数据。
- [x] OCR fixtures 不读取真实用户缓存、不探测 LCU、不依赖线上当前赛季名称库。
- [x] 新增自动测试覆盖本次主要回归路径。
