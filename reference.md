# 引用资料索引（Reference Index）

本仓库文档内容引用的外部原始资料，统一存档于 [`reference/`](reference/) 目录（每个来源一个子目录，保留原始内容），本文件为总索引。

**新增条目流程**：在 `reference/<来源slug>/` 存放原始资料（正文全文、帖子存档等）→ 在下表追加一行。

## 索引

| ID | 资料 | 类型 | 作者/来源 | 获取日期 | 本地存档 | 引用位置 | 原始 URL |
|----|------|------|-----------|----------|----------|----------|----------|
| R-001 | AC Remote Telemetry Documentation（AC UDP 遥测协议） | 协议文档（Google Docs 发布版） | Giovanni Romagnoli（Kunos Simulazioni） | 2026-09-11 | [reference/ac-udp-remote-telemetry/ac-remote-telemetry.md](reference/ac-udp-remote-telemetry/ac-remote-telemetry.md) | [docs/networking/udp-remote-telemetry.md](docs/networking/udp-remote-telemetry.md)（中）/ [docs/en/networking/udp-remote-telemetry.md](docs/en/networking/udp-remote-telemetry.md)（英） | <https://docs.google.com/document/d/1KfkZiIluXZ6mMhLWfDX1qAGbvhGRC3ZUzjVIt5FQpp4/pub> |
| R-001a | [DOC] AC UDP Remote Telemetry（发现该协议文档的论坛帖，2014-07-28，已关闭） | 论坛帖存档 | assettocorsamods.net 官方搬运账号 | 2026-09-11 | [reference/ac-udp-remote-telemetry/thread-assettocorsamods.md](reference/ac-udp-remote-telemetry/thread-assettocorsamods.md) | 同 R-001（入口出处） | <https://assettocorsamods.net/threads/doc-ac-udp-remote-telemetry.60/> |
| R-002 | CSP 官方 Wiki（acc-extension-config.wiki） | Wiki 仓库（EN 223 篇 + zh-CN 翻译 110 篇） | x4fab / CSP 团队（上游）；中文翻译：csp-local L10N 工程 | 2026-09-13（记录） | [reference/csp-wiki/README.md](reference/csp-wiki/README.md)（详情+映射；正文存档在本地 `~/Projects/csp-local/` 工作副本） | docs/ 的 car(20→56)、track(16→27)、general(12)、python(4)、post-processing(2)、server(1)、custom-ai(1)、unrelated(2) 等 CSP 板块（102 页全量） | <https://github.com/ac-custom-shaders-patch/acc-extension-config.wiki> |
| R-003 | AC 官方车辆管线 R2.0（AC_Pipeline_PUB_Rev2.0.pdf） | 官方 SDK 文档（PDF，Kunos Simulazioni） | Kunos Simulazioni 官方 SDK | 2026-09-13（记录；PDF 入库前即使用） | [reference/ac-car-pipeline-r20/README.md](reference/ac-car-pipeline-r20/README.md)（正文为本地 `assets/` 下 PDF+提取稿，未入库） | [docs/pipeline/](docs/pipeline/index.md)（中，10 页）/ [docs/en/pipeline/](docs/en/pipeline/index.md)（英，10 页） | 官方 SDK `sdk/dev/car_pipeline_2.0rev/`（无公开 URL） |

## 条目详情

### R-001 · AC Remote Telemetry Documentation

- **内容**：AC 通过 UDP socket 输出实时遥测的官方协议：握手流程（端口 9996，`handshaker` / `handshackerResponse` 结构）、订阅模式（SUBSCRIBE_UPDATE 每物理帧推送 `RTCarInfo` / SUBSCRIBE_SPOT 圈时事件推送 `RTLap`）、DISMISS 注销。数据类型约定：int 32 位小端、float 32 位、bool 8 位。
- **作者**：Giovanni Romagnoli，Kunos Simulazioni 程序员；由官方论坛搬运帖公开（R-001a）。
- **版本注意**：文档为 2014 年原版（identifier / version 字段当时未启用，响应 identifier 恒为 4242）。社区后续对该协议有扩展实现（如插件端新增消息类型），翻译引用时需注明原始版本边界。
- **存档说明**：正文按原样保留（含原文拼写），仅恢复 HTML 提取丢失的代码块换行。

### R-002 · CSP 官方 Wiki

- **内容**：CSP 全部配置文档（车辆/赛道/通用/Python 应用/后期处理/服务器等），站点页脚「基于 CSP 官方 Wiki 构建」的数据源。
- **本地工作副本**：`C:/Users/Eree/Projects/csp-local/acc-extension-config.wiki`（`origin`=官方上游，`origincn`=AssettoCN/acc-extension-config.wiki 中文 fork），配套 `pages_inventory.json`（中英映射）与 `audit_sync.py`（按原文锚点+提交时间审计译文过期）。
- **版本差距**：站内 CSP 板块为约 3 个月前的早期翻译；本地 zh-CN 已于 2026-09-12 完成 L10N v1.0 全量重译（车辆 56 篇全覆盖，站内仅 20 篇），可作站内板块升级源。
- **待核对**：inipp（8）、ext-templates（9）、guide（1）的上游来源未在 wiki 分组中找到对应，待逐页确认后补充。
- **详情**：[reference/csp-wiki/README.md](reference/csp-wiki/README.md)。
