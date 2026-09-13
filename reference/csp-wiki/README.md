# CSP 官方 Wiki（acc-extension-config.wiki）——来源档案

> **存档说明**
> - 上游：<https://github.com/ac-custom-shaders-patch/acc-extension-config.wiki>（CSP 官方 Wiki，即站点页脚「基于 CSP 官方 Wiki 构建」所指）
> - 本地工作副本：`C:/Users/Eree/Projects/csp-local/`（本机路径，不入库）
> - 记录日期：2026-09-13

## csp-local 工程结构

```
C:/Users/Eree/Projects/csp-local/
├── acc-extension-config.wiki/     # wiki 克隆（双远程）
│   ├── *.md                       # 英文原文 223 篇（根目录平铺，按前缀分组）
│   └── locale/zh-CN/              # 中文翻译 110 篇（L10N v1.0）
├── acc-extension-config/          # CSP 主配置仓库克隆
├── pages_inventory.json           # 中英页映射清单（按分组）
├── audit_sync.py                  # 同步审计：按「原文锚点 + 最后提交时间」判定译文过期
└── gen_inventory.py               # 映射清单生成器
```

- git 远程：`origin` = 官方上游；`origincn` = **AssettoCN/acc-extension-config.wiki**（自有中文 fork）
- zh-CN 每篇带 L10N 元数据（汉化标题 / 原文页面 / 原文锚点 / 汉化时间），最近提交 2026-09-12「Retranslate final wave 27 pages（ASS-74/75/76/78/83/84）」——Linear issue 驱动的活跃翻译工程

## wiki 页面分组（EN 223 / zh-CN 110）

| 分组 | EN | zh-CN |
|------|----|-------|
| Cars / 车辆 | 56 | 56（全量） |
| Tracks / 赛道 | 27 | 27（全量） |
| General / 通用 | 11 | 11（全量） |
| Python Apps / Python应用 | 4 | 4 |
| Post-processing / 后期处理 | 2 | 2 |
| Misc / 杂项 | 2 | 2 |
| Unrelated / 无关 | 2 | 2 |
| Other Things / 其他事项 | 1 | 1 |
| Mesh / 网格、首页、额外灯光 等 | 若干 | 部分 |

## ac-docs 站内板块 ↔ wiki 映射

| 站内板块（页数） | wiki 分组（zh-CN 覆盖） | 血缘确认 |
|------------------|--------------------------|----------|
| docs/car/（20） | 车辆（56） | 结构对应，站内为早期翻译 |
| docs/track/（16） | 赛道（27） | 结构对应，站内为早期翻译 |
| docs/general/（12） | 通用（11） | 结构对应 |
| docs/python/（4） | Python应用（4） | 已核对：new-functions 与 zh-CN 新版同源、措辞为旧版 |
| docs/post-processing/（2） | 后期处理（2） | 结构对应 |
| docs/server/options.md（1） | 杂项-–-服务器额外选项 | 标题逐字对应 |
| docs/custom-ai/（1） | 其他事项-–-自定义AI | 标题逐字对应 |
| docs/inipp/（8）、docs/ext-templates/（9）、docs/guide/（1） | —（wiki 分组普查中未见对应） | 上游待逐页核对 |

**版本差距**：站内 CSP 板块为约 3 个月前的早期翻译；csp-local zh-CN 已于 2026-09-12 完成 L10N v1.0 全量重译（车辆 56 篇全覆盖 vs 站内 20 篇）。后续可将站内板块从 zh-CN 同步升级。
