## v0.2.18 更新内容

### 战绩显示 - 整合 Sona 完整插件
- 将 Sona 项目预构建产物完整移植为 ARAMGG 插件，不再使用手动移植的简化版
- 包含完整的 SGP 战绩查询、DOM 注入、MutationObserver 守护
- 大厅战绩：注入 `lol-regalia-parties-v2-element`，显示胜率/KDA/评分
- 选人阶段战绩：注入 `.summoner-wrapper`，含粒子特效和点击查看战绩弹窗
- 插件通过 `window.getScriptPath()` 动态解析目录名，自动适配
- 包含 Sona 完整资源（tier 图标、balance 图标等）

### OCR GPU 加速
- 启用 ONNX Runtime DirectML 执行提供器，加速海克斯识别
- 支持 NVIDIA / AMD / Intel GPU（通过 DirectML）
- 设置环境变量 `ARAMGG_OCR_GPU=0` 可关闭 GPU 加速回退到 CPU

### 使用说明
1. 下载并安装 `aramgg_client Setup 0.2.18.exe`
2. 打开 ARAMGG 客户端，进入"客户端战绩注入"面板
3. 点击"安装 Pengu Loader"（程序自带，无需下载）
4. 点击"安装插件"
5. 刷新确认安装状态为"已安装"
6. 重启 LoL 客户端
7. 大厅战绩默认开启；选人阶段战绩需在客户端内按 F1 打开 Sona 设置页开启
