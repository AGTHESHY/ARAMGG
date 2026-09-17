# 项目改进建议

> 整理日期：2026-07-10；适用项目：`lol_tips_client`
> 范围：架构、工程质量、产品体验与故障诊断

## 总体判断

项目目前已经具备较扎实的 Electron 安全边界、本地优先数据加载、LCU 进程优先发现和 ARAM 只读推荐约束。下一阶段更值得投入的方向，不是单纯增加更多功能，而是提升推荐结果的可信度、收紧跨进程契约，并降低游戏流程和多窗口界面的维护成本。

建议优先推进以下五项工作。

## 实施进度

> 开始实施：2026-07-10
> 本轮范围：第 2、3、4 项

| 建议 | 状态 | 当前工作 | 验证 |
| --- | --- | --- | --- |
| 2. 强类型 IPC 契约 | 已完成（核心范围） | 共享契约、TypeScript preload、领域 handler、运行时输入限制 | lint / type-check / build 通过 |
| 3. 游戏流程状态机 | 已完成（阶段转换核心） | 纯状态转换、协调器、阶段入口效果与主进程接入 | 4 个新增单测通过 |
| 4. 渲染层组件拆分 | 已完成（第一阶段） | 更新控制器、Tooltip composable、共享展示格式化 | unit / lint / type-check / build 通过 |

### 本轮完成内容

#### 第 2 项：强类型 IPC

- 新增 `src/shared/ipc-contract.ts`，统一 Electron API、事件 channel、LCU 返回值、应用更新状态和 renderer 可写配置 key。
- preload 入口由 `src/preload/preload.js` 迁移为 `src/preload/preload.ts`，并显式实现共享 `ElectronAPI` 接口。
- renderer 的 `electron-api.d.ts` 不再整体声明为 `any`。
- 新增 `src/main/ipc/preferences-handlers.ts`，集中处理 renderer 配置和数据语言，并限制 renderer 可访问的 electron-store key。
- 新增 `src/main/ipc/system-handlers.ts`，集中处理退出、重启、版本、更新、日志目录、Analytics 和外部链接。
- `src/main/modules/ipc-handlers.ts` 与 ARAM 推荐算法已移除 `@ts-nocheck`，当前可由 TypeScript 检查实际参数和错误处理。
- 已确认 `npm run lint` 覆盖 `.ts` 文件。

#### 第 3 项：游戏流程状态机

- 新增 `src/main/services/game-session/game-session-machine.ts`。
- 状态机统一映射 `client-ready`、`champ-select`、`game-loading`、`in-progress` 和 `post-game` 生命周期。
- 重复阶段事件不再产生入口效果；连续对局通过 `sessionSequence` 区分。
- `app-config.ts` 已使用 `GameSessionCoordinator` 进行阶段去重和入口效果选择。
- Electron 窗口、LCU、OCR 和自动截图仍由原主进程副作用层执行，状态机保持纯逻辑、可独立测试。
- 新增连续对局、重复事件、未知阶段和完整生命周期测试。

#### 第 4 项：渲染层拆分

- 新增 `useAppUpdate`，接管应用更新状态、按钮可用性、进度文本、IPC 订阅和安装动作。
- 新增 `usePostGameShare`，接管赛后数据请求、自动弹出、模拟海报、Analytics 和游戏结束事件订阅。
- 新增 `useAugmentTooltip`，接管 Tooltip 内容、位置计算和显示状态。
- 新增 `overlay-formatters.ts`，统一顶部浮窗和英雄详情中的百分比、场次、数据来源、时间、本地化文本与图片错误处理。
- `Display.vue`、`AugmentWinrateOverlay.vue` 和 `AugmentFloatingOverlay.vue` 保留原模板层级和 CSS，本轮没有主动改变视觉设计。
- `Display.vue` 已由约 2510 行降至约 1930 行，`AugmentWinrateOverlay.vue` 已由约 3050 行降至约 2540 行。
- 大组件仍有继续拆分空间；下一阶段可继续提取 LCU 手动目录、诊断面板和装备配置 composable。

### 验证结果

| 命令 | 结果 |
| --- | --- |
| `npm run test:unit` | 通过：20 个测试文件，58 个测试 |
| `node tests/electron/test-aram-bench-recommendation.js` | 通过 |
| `npm run lint` | 通过 |
| `npm run type-check` | 通过 |
| `npm run build` | 通过 |

## 1. 将推荐升级为“可解释推荐”

**优先级：高；预计成本：低**
**主要收益：提升用户信任和推荐信息的可读性**

### 当前情况

`src/main/services/aram/bench-recommendation.ts` 已经计算并返回：

- 样本场次 `games`；
- 推荐可信度 `confidence`；
- 推荐理由 `reasons`；
- 当前英雄与推荐英雄的综合差距 `deltaScore`；
- 胜率、选取率、梯队和数据可用性。

但 `AramBenchRecommendation.vue` 当前主要展示英雄胜率和选取率，没有充分利用已有的解释信息。用户能看到“推荐了谁”，却不容易理解“为什么推荐”和“结果是否可靠”。

### 建议方案

- 在推荐区域顶部展示明确结论，例如：
  - “建议保留当前英雄，综合差距较小”；
  - “优先关注席位英雄 XXX”；
  - “样本不足，本次结果仅供参考”。
- 在候选英雄行中增加样本场次。
- 将 `confidence` 映射为“高 / 中 / 低可信度”，避免直接展示难以理解的内部小数。
- 展示数据版本或更新时间，帮助用户判断数据新鲜度。
- 将队友已选英雄明确标记为“沟通参考”，避免让用户误认为客户端可以自动交换英雄。
- 不直接展示内部综合评分公式；使用自然语言解释胜率、样本量和差距即可。

### 验收标准

- 推荐结论能够说明“保留”或“优先关注”的原因。
- 样本不足、统计数据缺失时有明确降级提示。
- 所有候选英雄仍完整展示，且推荐区域保持只读。
- 不新增 `pickOrBan`、`benchSwap`、`action`、`acceptTrade` 或 `declineTrade` 等 LCU 写操作。

## 2. 建立统一、强类型的 IPC 契约

**优先级：最高；预计成本：中**
**主要收益：降低跨进程接口漂移、安全问题和重构风险**

### 实施前问题

`src/main/modules/ipc-handlers.ts` 同时覆盖配置、应用更新、日志、LCU 手动目录、Analytics、赛后分享、截图、胜率、装备方案和诊断等多个领域。

preload 虽然已经按业务模块暴露接口，但 renderer 侧曾将主要接口声明为 `any`。这导致：

- handler、preload 和 renderer 之间容易出现参数或返回值不一致；
- IDE 无法可靠提示跨进程 API；
- 对返回结构的修改难以在编译阶段发现影响范围；
- 文件路径、Data URL 和配置对象主要依赖各 handler 自行校验。

此前核心 IPC 和 ARAM 推荐模块还使用 `@ts-nocheck`，跨进程结构无法获得完整的编译期保护。

### 本轮实施

- 使用 `src/shared/ipc-contract.ts` 集中定义 `ElectronAPI`、主进程推送事件、LCU 返回值、应用更新状态和 renderer 可写配置 key。
- 让 `src/preload/preload.ts` 显式实现共享接口，renderer 全局声明直接引用同一类型。
- 将偏好设置与系统操作分别拆到 `src/main/ipc/preferences-handlers.ts` 和 `src/main/ipc/system-handlers.ts`。
- 对 renderer 可写 electron-store key、locale、外部 URL、Analytics 参数和系统操作输入进行边界限制。
- 保留 `src/main/modules/ipc-handlers.ts` 作为聚合注册和尚未拆分领域的兼容入口，后续按改动热区继续拆分。
- 移除核心 IPC 与 ARAM 推荐模块的 `@ts-nocheck`，并确认 lint 覆盖 TypeScript。

### 验收结果

- handler、preload 和 renderer 共享同一套接口类型。
- 修改 channel 参数或响应结构时，类型检查能定位所有受影响调用方。
- IPC handler 按领域拆分，单个文件不再承担所有业务注册。
- `npm run lint` 能检查 `src/**/*.ts`。
- 核心 ARAM 推荐模块不再依赖 `@ts-nocheck`。

## 3. 将游戏流程编排抽成显式状态机

**优先级：中高；预计成本：高**
**主要收益：减少跨局、重连和阶段抖动导致的竞态问题**

### 实施前问题

`src/main/modules/app-config.ts` 同时承担：

- LCU 鉴权发现和刷新；
- `OnJsonApiEvent` WebSocket 订阅；
- 轮询兜底和重连；
- 游戏阶段广播；
- 英雄详情窗口和海克斯浮窗控制；
- 自动截图启停；
- 装备方案自动处理；
- 更新安装时机协调。

这些功能都与游戏阶段有关，但副作用集中在同一个编排模块中。连续两局、LCU 短暂断连和阶段重复事件等场景因此难以独立验证。

### 本轮实施

主进程新增 `GameSessionCoordinator`，使用显式状态描述核心游戏生命周期：

```text
client-ready
  -> champ-select
  -> game-loading
  -> in-progress
  -> post-game
  -> client-ready
```

实现分为两层：

1. **纯状态转换层**：根据输入事件决定新状态和需要执行的效果。
2. **副作用执行层**：负责窗口、截图、数据读取和更新服务的具体调用。

- 本轮先将 `GAMEFLOW_PHASE_CHANGED` 纳入状态机，覆盖生命周期映射、重复事件去重、阶段入口效果和 `sessionSequence`。
- `app-config.ts` 继续作为跨窗口状态和副作用的唯一事实源，renderer 只订阅规范化业务事件。
- LCU 鉴权、OCR、用户偏好和应用更新状态暂不并入同一状态机；只有出现明确的跨状态竞态时再扩展，避免一次性扩大重构范围。

### 已覆盖测试

- 连续进行两局游戏；
- 同一阶段事件重复到达；
- 未知阶段回退到 `client-ready`；
- 从大厅、选人、加载、对局到结算的完整生命周期。

### 验收结果

- 游戏阶段转换可以脱离 Electron 窗口进行单元测试。
- 同一阶段的重复事件不会重复启动服务或创建窗口。
- 连续对局通过递增的 `sessionSequence` 区分，并继续复用现有阶段入口清理逻辑。
- 状态机只选择既有主进程副作用，没有新增 LCU 写操作，推荐链路继续保持只读。

## 4. 拆分渲染层巨型组件

**优先级：中高；预计成本：中**
**主要收益：提高可测试性、复用度和界面迭代速度**

### 实施前问题

以下组件已经同时承担较多职责：

- `Display.vue`：主界面布局、版本信息、更新流程、诊断、设置、赛后分享等；
- `AugmentWinrateOverlay.vue`：英雄数据、海克斯数据、装备路线、装备写入、Tooltip、窗口事件和大量展示逻辑；
- `AugmentFloatingOverlay.vue`：海克斯事件订阅、排序、降级映射和展示。

大组件会使小范围视觉修改也需要理解大量业务状态，并增加不同浮窗之间产生重复逻辑的概率。

### 本轮实施

第一阶段已提取：

- `useAppUpdate`；
- `usePostGameShare`；
- `useAugmentTooltip`；
- `overlay-formatters.ts` 共享格式化与图片降级逻辑。

不建议仅为解决组件过大而直接引入全局 Store。每个 Electron `BrowserWindow` 都有独立的 renderer 运行环境，普通前端 Store 不会天然跨窗口共享。跨窗口事实状态仍应由主进程持有和广播，composable 负责单个窗口内部的状态组织。

下一阶段可继续提取 `useDiagnostics`、LCU 手动目录、装备配置和更细的纯展示组件；这部分不阻塞本轮第一阶段完成。

### 验收结果

- 应用更新和赛后分享请求已从 `Display.vue` 移出，Tooltip 状态已从英雄详情组件移出。
- 海克斯顶部浮窗和右侧推荐列表复用同一套数据映射逻辑。
- 共享展示格式化已由 Vitest 独立测试；composable 保持清晰的订阅清理边界。
- 跨窗口状态仍由主进程提供，不产生多个互相冲突的事实源。

## 5. 增加“一键自检与脱敏诊断包”

**优先级：中高；预计成本：低到中**
**主要收益：降低用户排障和远程支持成本**

### 当前情况

主界面已经具有诊断区域、版本信息、数据版本和“打开日志目录”入口。现有日志也覆盖 LCU 发现、游戏阶段和 OCR 等关键流程。

目前用户出现问题时，仍需要人工打开日志目录、寻找当天日志，再根据文档判断应关注哪些字段。这对普通用户并不友好。

### 建议方案

在现有诊断区域增加“一键自检”，展示：

- 应用版本、数据版本和数据语言；
- 本地数据集是否完整；
- LCU 是否连接；
- LCU 凭据来自进程发现还是手动目录兜底；
- WebSocket、轮询兜底和最后一次阶段更新时间；
- 当前规范化游戏阶段；
- PaddleOCR 模型和 native backend 是否加载成功；
- 上一轮截图和 OCR 的耗时、结果数量及错误摘要；
- 浮窗位置、显示器和 DPI 信息；
- 自动截图与浮窗偏好的当前状态。

支持：

- 一键复制诊断文本；
- 导出诊断 JSON 或 ZIP；
- 可选附加日志末尾片段；
- 截图必须由用户主动勾选后才能加入诊断包。

### 隐私与安全要求

- 永远不导出 LCU token、Authorization header 或 API Key。
- 默认隐藏用户名和完整绝对路径。
- 日志导出前统一进行脱敏处理。
- 不默认包含游戏截图或 OCR 调试截图。
- 在界面中明确列出即将导出的内容。

### 验收标准

- 用户无需阅读排障文档即可知道 LCU、数据和 OCR 的基本健康状态。
- 导出的诊断内容足以区分连接、数据、OCR、窗口布局和配置问题。
- 自动化测试能够确认敏感字段不会进入导出结果。

## 后续实施顺序

第 2、3、4 项已完成本轮范围，后续建议按照以下顺序安排：

1. **上线可解释推荐**：以较低成本获得直接的产品收益。
2. **增加一键自检与脱敏诊断包**：改善真实用户排障体验。
3. **继续按热区拆分 renderer 和 IPC**：只在真实迭代触及相应区域时继续拆分，避免无目标重构。
4. **按竞态需要扩展游戏会话事件**：当前状态机先覆盖 gameflow phase，其他事件按测试场景逐步纳入。

如果下一阶段只能选择两项，建议优先完成：

1. 可解释推荐；
2. 一键自检与脱敏诊断包。

## 不变的项目边界

推进上述建议时，应继续遵守以下约束：

- ARAM 选人推荐保持只读；
- 推荐区域继续位于英雄详情窗口，不迁移到主 renderer 页面；
- 不自动选择英雄、交换 bench、锁定英雄或接受交易；
- LCU 鉴权继续采用进程优先、手动目录兜底；
- 前台页面继续采用本地优先数据加载；
- OCR 继续保持左、中、右标题区域顺序、瞬时丢失保留和标题区域快速路径；
- 所有可变运行时数据继续通过 `src/main/modules/app-paths.ts` 管理。
