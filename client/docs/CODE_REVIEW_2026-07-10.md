# 项目代码全面审查报告

> 审查日期：2026-07-10
> 审查对象：`lol_tips_client` 当前工作树
> 技术栈：Electron 42、Vue 3、electron-vite
> 审查范围：主进程、preload、renderer、IPC、LCU、客户端数据、OCR、Analytics、自动更新、构建发布、测试和依赖
> 总体结论：代码侧高风险问题已整改；自动更新仍不得启用，直到取得并配置 Windows 签名证书

## 1. 审查说明

本报告记录本次全项目静态审查、构建验证和专项测试结果。

审查期间工作区持续出现其他并行的未提交修改，主要涉及多语言客户端数据、OCR、窗口广播、renderer 缓存和发布工作流。本报告以审查结束时可见的当前工作树为准；后续处理问题时，应优先依据函数名、行为和测试结果定位，行号仅作为辅助。

初次审查没有修改项目源码。后续根据本报告实施了整改，进展记录如下。

### 1.1 后续整改进展

| 审查项 | 当前状态 | 处理结果 |
| --- | --- | --- |
| P1-1 赛后分享 `getMainWindow` 未定义 | 已完成 | 补齐导入，并将主进程全部 TypeScript 纳入 `no-undef` 门禁 |
| P1-2 manifest 目录穿越 | 已完成 | 运行时与打包脚本共用严格逻辑路径、根目录和资源 origin 校验 |
| P1-3 旧缓存优先于新 bundled data | 已由后续提交完成 | 候选按 dataVersion、generatedAt、activatedAt 排序，并有缓存/随包回归测试 |
| P1-4 Analytics 默认开启 | 按要求暂不处理 | 未修改 Analytics 默认值、事件或设置入口 |
| P1-5 更新信任链 | 代码侧完成，证书待办 | 远端配置不能扩展 feed/publisher 信任根；当前信任列表为空，自动更新无法被远端单独开启；安装包仍为 `NotSigned` |
| P2-1 Electron 导航与 IPC sender | 已完成 | 本地 renderer origin 白名单、导航/重定向阻止、`window.open` 拒绝、CSP、统一可信 IPC 包装 |
| P2-2 TypeScript 门禁 | 大部分完成 | ESLint 覆盖 TS，主进程统一 `no-undef`；`@ts-nocheck` 从 16 个降到 4 个，其中 Analytics 按要求保留 |
| P2-3 OCR fixture 环境污染 | 已由后续提交完成 | 使用临时 HOME/USERPROFILE 和固定三语言 fixture 数据，不再读取真实用户缓存 |
| P2-4 依赖漏洞与冗余 | 已完成 | 完整 `npm audit` 为 0；Firebase 仅作为 renderer 构建依赖；移除未引用旧依赖链 |
| P3 构建与遗留代码 | 大部分完成 | 删除旧 Vue 2 router、旧登录 API、旧数据源/LCU 兼容代码；renderer 拆包；清理硬编码诊断路径和无效动态导入 |

仍需独立重构的非 Analytics 类型债务：

- `src/main/modules/app-config.ts`；
- `src/main/image-analyzer.ts`；
- `src/main/auto-screenshot-service.ts`。

这三个模块分别涉及游戏阶段状态、OCR 时序和截图背压，不应通过批量 `any` 或机械移除 `@ts-nocheck` 伪装完成。当前全主进程 `no-undef` 已能阻止未定义符号再次漏过 CI。

## 2. 初次审查结论摘要

项目初次审查时已经具备较好的 Electron 基础隔离、LCU 进程优先发现、本地数据缓存和 ARAM 只读推荐约束，但发现了以下发布阻断项；当前整改状态以 1.1 节为准：

1. 赛后自动分享路径调用未定义的 `getMainWindow()`，会触发确定性 `ReferenceError`。
2. 远程数据 manifest 中的逻辑路径缺少目录穿越校验，运行时和打包阶段都可能越界写文件。
3. 用户旧缓存无条件优先于更新的 bundled data，应用升级后可能继续使用旧数据。
4. Analytics 在没有用户明确选择时默认开启，且 renderer 没有可见的关闭入口。
5. 自动更新源由远程数据配置控制，而当前发布流程没有建立可靠的 Windows 发布者身份。

此外，TypeScript 质量门禁覆盖不足、Electron IPC 缺少调用者校验、OCR 测试依赖真实用户环境、生产依赖存在已知漏洞和冗余模块。

## 3. P1：发布前必须修复

### P1-1：赛后自动分享会触发 `ReferenceError`

**证据**

- [`src/main/modules/app-config.ts`](../src/main/modules/app-config.ts) 的 `showMainWindowForPostGameShare()` 调用 `getMainWindow()`。
- 该文件从 `window-manager.ts` 导入的符号中没有 `getMainWindow`。
- `prepareAndNotifyPostGameShare()` 会在 `WaitingForStats`、`PreEndOfGame` 和 `EndOfGame` 阶段被 fire-and-forget 调用。
- 文件使用 `// @ts-nocheck`，现有 type-check 无法发现未定义符号。

**影响**

- 自动赛后分享窗口无法正常拉起。
- `post-game-share-ready` 通知可能不会发给 renderer。
- 异步调用没有统一捕获，可能产生未处理 Promise rejection。

**修复要求**

- 从 `window-manager.ts` 显式导入 `getMainWindow`。
- 对阶段监听中的 fire-and-forget Promise 增加统一错误处理。
- 增加覆盖三个结束阶段的主进程单元测试。

### P1-2：远程 manifest 路径可越出版本目录

**证据**

- [`src/main/data-loader.ts`](../src/main/data-loader.ts) 的 `normalizeDataPath()` 只替换反斜杠并移除开头 `/`，没有拒绝 `.`、`..`、盘符和绝对路径。
- `isRequiredBundledDataPath()` 接受所有以 `champion-shards/` 开头的路径。
- `writeDataFileToDisk()` 将上述路径直接传入 `path.join(versionDir, dataPath)`。
- [`scripts/fetch-client-data.mjs`](../scripts/fetch-client-data.mjs) 的 `normalizeDataPath()`、`isBundledDataPath()` 和 `downloadBundleFile()` 存在相同边界问题。

例如，恶意 manifest 路径：

```text
champion-shards/../../../../config/config.json
```

可以通过前缀检查，并在路径归一化后越出数据版本目录。

**影响**

- 运行时可覆盖应用数据目录内的其他 JSON 文件。
- 构建阶段可向 `resources/client-data` 之外写文件。
- 如果远程数据服务或 manifest 被攻破，影响会从“错误数据”升级为本地文件写入。

**修复要求**

- 建立运行时和构建脚本共用的安全逻辑路径校验。
- 拒绝空路径段、`.`、`..`、绝对路径、UNC 路径和 Windows 盘符。
- 使用 `path.resolve()` 计算目标路径，再通过 `path.relative()` 确认目标仍在允许目录内。
- manifest 资源 URL 只允许 HTTPS 和明确的域名白名单。
- 下载后校验文件大小和可信哈希；不要只依赖同一 manifest 提供的 URL。

### P1-3：旧缓存优先于更新的随包数据

**证据**

- [`src/main/data-loader.ts`](../src/main/data-loader.ts) 的 `readCurrentDataPointerCandidates()` 固定按“用户缓存、bundled data”顺序返回候选。
- `loadCachedActiveDataSet()` 返回第一个完整候选，没有先比较 `dataVersion`。
- `loadCachedOcrAugmentLocaleData()` 使用相同顺序。
- 审查时仓库中的 bundled data 是 `16.13.4`，OCR 测试实际加载了用户目录中的旧缓存 `16.11.4`。

**影响**

- 应用升级后可能继续使用旧英雄、装备和海克斯数据。
- 即使安装包已经包含更新数据，离线用户仍无法使用它。
- OCR fixture 的通过结果会被本机旧缓存影响。
- 不同用户的实际数据版本和测试结果不一致。

**修复要求**

- 收集所有完整的缓存和 bundled 候选后，再按 locale、数据版本和生成时间排序。
- 默认选择最高兼容版本；如果需要版本固定，使用独立、显式的 pin 状态。
- 为“旧用户缓存 + 新安装包 bundled data + 离线启动”增加回归测试。
- OCR 初始化应记录最终选中的来源、locale 和 dataVersion。

## 4. P1：隐私和更新供应链

### P1-4：Analytics 默认开启且缺少用户入口

**证据**

- [`src/main/services/analytics-service.ts`](../src/main/services/analytics-service.ts) 内置完整 Firebase 配置。
- 当远端没有明确 `analytics.enabled` 且用户没有历史偏好时，`remoteEnabled` 会因 Firebase 配置完整而变为 `true`。
- preload 和 IPC 已提供 `analytics.setEnabled()`，但 renderer 中没有实际设置入口。
- renderer 会发送应用启动、页面访问、错误等事件。

Firebase Web 配置本身不应被当作秘密；本问题的核心是默认同意和缺少退出入口。

**修复要求**

- 首次运行默认关闭 Analytics。
- 在设置页提供清晰的启用、关闭和状态说明。
- 在首次发送前取得用户明确同意。
- 对错误消息、栈、URL、路径等字段做白名单化和脱敏。
- 增加隐私说明，列出事件类型、用途、保留期限和撤回方式。

### P1-5：启用自动更新前必须补齐发布者信任链

**证据**

- [`src/main/app-update-service.ts`](../src/main/app-update-service.ts) 允许远程客户端数据配置启用自动更新并指定 generic HTTPS feed。
- feed 只限制为 HTTPS，没有固定生产域名或签名信任根。
- [`.github/workflows/release-windows.yml`](../.github/workflows/release-windows.yml) 设置 `CSC_IDENTITY_AUTO_DISCOVERY=false`。
- [`package.json`](../package.json) 没有 `publisherName` 或自定义更新签名校验配置。

当前 `autoUpdateEnabled` 默认保持关闭，因此风险尚未直接激活。但如果数据 API 被攻破，攻击者可同时控制更新开关、feed URL 和 feed 中的校验文件。

**修复要求**

- 使用固定或严格白名单的生产更新域名。
- 将更新控制面和普通客户端数据配置分离。
- 对 Windows 安装包进行代码签名。
- 配置 `publisherName` 或明确的 `verifyUpdateCodeSignature` 策略。
- 在独立测试环境完成签名、下载、校验、安装、回滚和游戏中延迟更新测试后，再启用远端 `autoUpdateEnabled`。

参考：

- [electron-builder Auto Update](https://www.electron.build/docs/features/auto-update/)
- [electron-builder Windows Code Signing](https://www.electron.build/docs/features/code-signing/code-signing-win/)
- [Electron Security](https://www.electronjs.org/docs/latest/tutorial/security)

## 5. P2：重要工程问题

### P2-1：Electron 缺少导航、新窗口和 IPC sender 校验

**已确认良好**

[`src/main/modules/window-manager.ts`](../src/main/modules/window-manager.ts) 的窗口配置已正确设置：

- `nodeIntegration: false`
- `nodeIntegrationInWorker: false`
- `contextIsolation: true`
- `sandbox: true`
- `webSecurity: true`

**缺口**

没有发现统一的：

- `will-navigate` 导航阻止；
- `setWindowOpenHandler()`；
- `webContents-created` 全局保护；
- `event.senderFrame.url` IPC 调用者校验；
- renderer CSP。

preload 暴露了配置修改、更新安装、截图、文件保存、LCU 和装备方案等高权限能力。一旦 renderer 发生 XSS 或窗口意外加载远端页面，当前 IPC 不会验证调用来源。

**修复要求**

- 默认拒绝窗口导航和新窗口，仅对白名单 URL 使用 `shell.openExternal()`。
- 为全部高权限 IPC 增加统一 sender/frame 校验。
- 为 renderer 配置 CSP。
- 避免向 renderer 暴露宽泛的文件系统或任意 channel 能力。

### P2-2：TypeScript 和 ESLint 门禁存在大面积盲区

审查时统计：

| 指标 | 数量 |
| --- | ---: |
| TypeScript 文件 | 50 |
| 使用 `@ts-nocheck` 的文件 | 18 |
| TypeScript 总行数 | 19,082 |
| 被 `@ts-nocheck` 跳过的行数 | 9,274 |
| 跳过比例 | 48.6% |

此外，`npm run lint` 只检查 `.js` 和 `.vue`，`eslint.config.js` 的常规规则也没有覆盖 TypeScript。

**影响**

- 未定义符号、隐式 `any`、返回结构漂移不能在 CI 中被发现。
- IPC handler、preload 和 renderer 类型契约容易失配。
- `npm run type-check` 通过会产生虚假的安全感。

**修复要求**

- 接入 typescript-eslint，将 `src/**/*.ts` 纳入 lint。
- 优先从 IPC、window-manager、app-config 和 data-loader 移除 `@ts-nocheck`。
- 建立共享 IPC 类型和 runtime schema 校验。
- 为跨进程 payload 增加严格的输入校验和错误返回类型。

### P2-3：OCR fixture 测试依赖真实用户环境

[`tests/electron/test-augment-ocr-fixtures.js`](../tests/electron/test-augment-ocr-fixtures.js) 直接导入完整生产 `image-analyzer.ts`。测试运行时会：

- 查询真实 LCU 进程；
- 读取真实用户数据缓存；
- 尝试写真实用户日志目录；
- 后台请求 en-US 和 zh-TW 数据；
- 使用仓库之外的数据版本完成匹配。

本次测试虽然通过 3 个 fixture，但加载的是用户缓存 `16.11.4`，不是 bundled `16.13.4`，因此结果不可视为干净环境可复现。

**修复要求**

- 将 app-data 根目录指向测试临时目录。
- 注入固定的 augment 名称数据库和 locale。
- 禁止 LCU、网络和用户日志副作用。
- 分离 OCR 图像识别测试与数据加载集成测试。
- 将隔离后的 OCR fixture 测试加入 release workflow。

### P2-4：生产依赖存在已知漏洞和打包冗余

`npm audit --omit=dev` 报告：

- 2 个 high；
- 8 个 moderate；
- 0 个 critical。

主要依赖链：

- `axios -> form-data`： [GHSA-hmw2-7cc7-3qxx](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx)
- `electron-updater -> js-yaml`： [GHSA-h67p-54hq-rp68](https://github.com/advisories/GHSA-h67p-54hq-rp68)
- `firebase -> firestore -> grpc/protobuf`： [GHSA-f38q-mgvj-vph7](https://github.com/advisories/GHSA-f38q-mgvj-vph7)

renderer 只使用 Firebase App 和 Analytics，但 `firebase` 被列为生产运行时依赖，electron-builder 因此将 Firestore、Auth、Storage 等未使用模块一并加入 ASAR。

**修复要求**

- 对 advisory 做可达性分析并升级到修复版本。
- 将只在 Vite 构建阶段使用的 renderer 依赖与 Electron 运行时依赖分离。
- 检查 electron-builder 的 `files` 和依赖打包策略。
- 在 CI 中增加生产依赖审计，并建立可记录的例外机制。

## 6. P3：可维护性和性能债务

### 6.1 超大文件

审查时最大的源文件包括：

| 文件 | 行数 |
| --- | ---: |
| `src/renderer/components/AugmentWinrateOverlay.vue` | 3,056 |
| `src/renderer/components/Display.vue` | 2,510 |
| `src/main/data-loader.ts` | 2,390 |
| `src/main/image-analyzer.ts` | 2,266 |
| `src/main/modules/app-config.ts` | 1,551 |
| `src/main/auto-screenshot-service.ts` | 1,518 |
| `src/main/modules/ipc-handlers.ts` | 1,361 |
| `src/main/services/post-game-share.ts` | 1,335 |

建议按以下边界拆分：

- renderer：状态机、数据请求、用户偏好、视图区块；
- data-loader：指针选择、manifest 校验、文件存储、远端传输、领域映射；
- image-analyzer：OCR 引擎、图像预处理、槽位检测、名称匹配、缓存；
- IPC：按 app、analytics、LCU、OCR、post-game、item-set 等领域注册。

### 6.2 构建体积和无效拆包

- 初次审查时 renderer 产出约 827.7 kB 的单 JS bundle；整改后主入口约 383.1 kB，Display 与浮窗等低频页面已形成独立 chunk。
- 初次审查发现 `lcu-service.ts`、`bench-recommendation.ts` 和 `version-checker.ts` 同时被静态和动态导入；整改后已移除无效动态导入告警。
- Firebase 已调整为 renderer 构建期依赖，打包 ASAR 不再携带 Firebase / `@firebase` 运行时依赖树。

建议先通过 bundle analyzer 确认组成，再按路由、重型弹窗和低频功能做真正的异步边界。

### 6.3 路径和遗留代码

- [`src/main/analyze-q4.ts`](../src/main/analyze-q4.ts) 已改为通过 `app-paths.ts` 获取运行时数据目录。
- 旧 Vue 2 router、登录 API、数据源、renderer LCU 兼容层和旧 HTTP 链已确认无引用并删除。
- `package.json` 已补齐 `description` 和 `author`。

## 7. 已确认良好的部分

- Electron 的 `contextIsolation`、`sandbox` 和 `webSecurity` 保持开启。
- renderer 没有直接依赖 Node 能力，主要通过 preload bridge 调用主进程。
- ARAM 推荐流程保持只读，没有发现连接 `pickOrBan`、`benchSwap`、`action`、`acceptTrade` 或 `declineTrade`。
- LCU 认证仍以进程发现为主，手动游戏目录只是高级兜底。
- 当前多语言并行修改已经改善：
  - 语言切换事务性；
  - locale/version 缓存键；
  - renderer 对 `locale-changed` 的失效处理；
  - OCR 按语言只加载海克斯名称；
  - release workflow 对三种语言 bundle 的校验。
- 数据版本先完整准备、再写 current pointer 的总体方向正确。
- PaddleOCR 的标题槽位顺序、快速路径和短暂识别失败保留策略仍得到维护。

## 8. 验证结果

| 命令或检查 | 结果 | 备注 |
| --- | --- | --- |
| `npm run lint` | 通过 | 覆盖 JavaScript、TypeScript 和 Vue，warning 为 0 |
| `npm run type-check` | 通过 | `@ts-nocheck` 已降至 4 个文件、约 27.3% TypeScript 行；其中 Analytics 暂不处理 |
| `npm run test:unit` | 通过 | 24 个文件、86 个测试 |
| `npm run test:augment-ocr` | 通过 | 3 个 fixture；使用隔离临时目录和固定数据 |
| `node tests/electron/test-aram-bench-recommendation.js` | 通过 | ARAM 推荐专项 |
| `node tests/electron/test-data-loader.js` | 通过 | 写用户日志时受审查沙箱限制 |
| `npm run build` | 通过 | renderer 主入口约 567.4 kB，Display 约 406.7 kB，浮窗等仍保持独立 chunk |
| 完整 `npm run pack` | 通过 | 三语言数据、NSIS 安装包、blockmap 和原生依赖重建全部完成 |
| Authenticode 检查 | 未签名 | 安装包状态为 `NotSigned`，自动更新必须继续关闭 |
| `npm audit` | 通过 | 生产及开发依赖均为 0 已知漏洞 |

OCR fixture 已改为临时用户目录；审查沙箱不再影响其日志和客户端数据选择。

## 9. 初次建议修复顺序

本节保留审查时的实施顺序，完成情况以 1.1 节为准。

### 第一阶段：立即阻断

1. 修复 `getMainWindow` 未定义和赛后阶段 Promise 错误处理。
2. 为运行时和打包脚本实现统一的安全路径解析。
3. 修复缓存与 bundled data 的版本选择规则。
4. 增加上述三个问题的回归测试。

### 第二阶段：发布安全和隐私

1. Analytics 改为明确同意后启用，并提供设置入口。
2. 固定更新源信任边界并完成 Windows 代码签名。
3. 增加 Electron 导航、新窗口、CSP 和 IPC sender 校验。

### 第三阶段：质量门禁

1. TypeScript 纳入 ESLint。
2. 分批移除核心主进程文件中的 `@ts-nocheck`。
3. 建立强类型 IPC 契约和 runtime schema。
4. 隔离 OCR/data-loader 测试环境并加入 CI。
5. 处理生产依赖漏洞和 Firebase 打包冗余。

### 第四阶段：架构收敛

1. 拆分超大组件和主进程模块。
2. 清理遗留路由、诊断文件和硬编码路径。
3. 基于 bundle analyzer 优化 renderer chunk 和 Electron 运行时依赖。

## 10. 发布验收建议

完成 P1 和 P2 修复后，至少执行：

```powershell
npm run lint
npm run type-check
npm run test:unit
npm run test:augment-ocr
node tests/electron/test-aram-bench-recommendation.js
node tests/electron/test-data-loader.js
npm run build
npm run pack
```

发布前还应验证：

- 三种语言在无用户缓存、旧缓存和离线环境中的启动行为；
- 安装版 PaddleOCR 模型和原生依赖加载；
- 赛后自动分享窗口完整流程；
- 签名安装包的自动更新下载与发布者校验；
- ARAM 推荐仍保持只读，不引入任何选人、交换或交易写操作。
