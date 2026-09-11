# 引用资料索引（Reference Index）

本仓库文档内容引用的外部原始资料，统一存档于 [`reference/`](reference/) 目录（每个来源一个子目录，保留原始内容），本文件为总索引。

**新增条目流程**：在 `reference/<来源slug>/` 存放原始资料（正文全文、帖子存档等）→ 在下表追加一行。

## 索引

| ID | 资料 | 类型 | 作者/来源 | 获取日期 | 本地存档 | 引用位置 | 原始 URL |
|----|------|------|-----------|----------|----------|----------|----------|
| R-001 | AC Remote Telemetry Documentation（AC UDP 遥测协议） | 协议文档（Google Docs 发布版） | Giovanni Romagnoli（Kunos Simulazioni） | 2026-09-11 | [reference/ac-udp-remote-telemetry/ac-remote-telemetry.md](reference/ac-udp-remote-telemetry/ac-remote-telemetry.md) | 计划中：UDP 遥测文档（待编写） | <https://docs.google.com/document/d/1KfkZiIluXZ6mMhLWfDX1qAGbvhGRC3ZUzjVIt5FQpp4/pub> |
| R-001a | [DOC] AC UDP Remote Telemetry（发现该协议文档的论坛帖，2014-07-28，已关闭） | 论坛帖存档 | assettocorsamods.net 官方搬运账号 | 2026-09-11 | [reference/ac-udp-remote-telemetry/thread-assettocorsamods.md](reference/ac-udp-remote-telemetry/thread-assettocorsamods.md) | 同 R-001（入口出处） | <https://assettocorsamods.net/threads/doc-ac-udp-remote-telemetry.60/> |

## 条目详情

### R-001 · AC Remote Telemetry Documentation

- **内容**：AC 通过 UDP socket 输出实时遥测的官方协议：握手流程（端口 9996，`handshaker` / `handshackerResponse` 结构）、订阅模式（SUBSCRIBE_UPDATE 每物理帧推送 `RTCarInfo` / SUBSCRIBE_SPOT 圈时事件推送 `RTLap`）、DISMISS 注销。数据类型约定：int 32 位小端、float 32 位、bool 8 位。
- **作者**：Giovanni Romagnoli，Kunos Simulazioni 程序员；由官方论坛搬运帖公开（R-001a）。
- **版本注意**：文档为 2014 年原版（identifier / version 字段当时未启用，响应 identifier 恒为 4242）。社区后续对该协议有扩展实现（如插件端新增消息类型），翻译引用时需注明原始版本边界。
- **存档说明**：正文按原样保留（含原文拼写），仅恢复 HTML 提取丢失的代码块换行。
