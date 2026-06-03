---
title: 模型替换
---

# 模型替换

模型替换允许移除、替换或插入 3D 模型的部分片段。例如，可以用于在不编辑任何 KN5 文件的情况下调整原始 Kunos 模型（例如添加路灯）。另一个可能的应用是为特定皮肤替换车辆部件，例如某些皮肤可以有不同的轮毂。

## 语法

```ini
[MODEL_REPLACEMENT_...]
ACTIVE = 1        ; 设为 0 以禁用整个节（默认值为 1）
FILE = model.kn5  ; 要处理的 KN5 文件名（用于区分 LOD 或赛道 KN5）
SKINS = red?      ; 使用替换的皮肤列表（仅适用于车辆）

; 移除特定网格或包含网格的整个节点（可选）：
HIDE = name1, name2  ; 要隐藏的网格或节点（不包括受保护网格）

; 插入新的 3D 模型（可选；使用此选项时需要 INSERT_AFTER 或 INSERT_IN）：
INSERT = new_model.kn5       ; 要插入的 KN5 文件名，应位于配置文件旁边
INSERT_AFTER = node_or_mesh  ; 在其之后插入新 KN5 的节点/网格
INSERT_IN = COCKPIT_HR       ; 或者，要插入 KN5 的节点名称，在其内容之后
                              ; 使用其中之一（如有必要，可以同时使用两者）

; 额外插入选项：
MULTIPLE = 0  ; 设为 1 允许新模型被插入多次（默认只在第一个找到的节点中
               ; 插入，无论是 INSERT_AFTER 还是 INSERT_IN 过滤器）
MERGE = 0     ; 设为 1 启用合并同名节点而不是复制它们

; 变换插入模型的选项：
SCALE = 1, 1, 1     ; 更改大小：X、Y 和 Z 轴（对于车辆，X 是左右，Y 是上下）
ROTATION = 0, 0, 0  ; 旋转：航向角、俯仰角和翻滚角，单位：度
OFFSET = 0, 0, 0    ; 移动：X、Y 和 Z 轴，单位：米
```

::: warning 注意
你不能对任何物理活动的"受保护"网格使用 `HIDE=`，如 `1ROAD...` 或 `AC_POBJECT...`，但你可以通过[网格调整](./mesh-adjustment)将它们从视图中隐藏。
:::

大多数选项在 v0.1.60 中添加，之前的版本只有 `FILE`、`HIDE`、`INSERT` 和 `INSERT_AFTER`。

如果你要替换车辆的某些外部部件，请注意低 LOD 模型。当然，如果你要在赛道中插入新模型，不要忘记设置 LOD 距离。另外，整个功能不适用于名称以 `AC_` 或数字开头、或包含 `WALL` 的网格和节点，以确保此选项不能用于作弊。

## 配置模板

*配置模板是包含一些有用内容的配置，可以更快速简便地进行设置，自动生成大部分样板代码。*

### 自定义轮毂（common/custom_rims.ini）

帮助快速替换车辆的轮毂，需要一个带有单个车轮的 KN5，对齐方式如下：

<!-- Image: https://i.imgur.com/pqfeIJi.png — 车轮对齐示意图 -->

以下是 Miura 的使用示例：

```ini
[INCLUDE: common/custom_rims.ini]

[ReplaceRims]
File = lamborghini_miura_sv.kn5  ; KN5 文件名
OriginalRims = RIM_?             ; 要隐藏的原始轮毂列表
Model = rim.kn5, 0.276, 0.238    ; 新轮毂的 KN5，其半径和宽度
Offset = 0, -0.03                ; 前轮和后轮的偏移（负值将轮毂向内移动）

[ReplaceRims]
File = lamborghini_miura_sv_LOD_B.kn5
OriginalRims = RIM_?
Model = rim_B.kn5, 0.276, 0.238
Offset = … ; 等等
```

如果需要，你还可以设置 `Radius` 和 `Width` 来指定插入轮毂的尺寸，但默认情况下，配置会使用 `tyres.ini` 中的 `RIM_RADIUS` 和 `WIDTH`。`Offset`、`Radius` 和 `Width` 可以是单个值或双值：如果是单个值，会同时影响两侧；如果是双值，第一个值用于前轮，第二个值用于后轮。

可以通过 `FrontOnly = 1` 或 `RearOnly = 1` 限制到特定一侧。请注意，你可以多次使用 `[ReplaceRims]`，因为它们是 [INIpp 模板](https://github.com/ac-custom-shaders-patch/inipp)。

此外，你可以使用 `Skins` 来设置自定义轮毂适用的皮肤过滤器或列表。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-Model-replacements) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
