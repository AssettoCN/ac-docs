---
title: 模型替换
---


> 汉化标题：通用 – 模型替换  
> 原文页面：General-–-Model-replacements  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T19:00:00+08:00  

模型替换允许移除、替换或插入 3D 模型的局部。例如，可以用于在不编辑任何 KN5 文件的情况下调整原始 Kunos 模型（例如添加路灯）。另一个可能的应用是为特定涂装替换车辆部件，比如让某个涂装可以使用不同的轮圈。

### 语法

```ini
[MODEL_REPLACEMENT_...]
ACTIVE = 1        ; 设为 0 可禁用整个节（默认值为 1）
FILE = model.kn5  ; 要处理的 KN5 的名称（用于区分不同 LOD 或不同赛道的 KN5）
SKINS = red?      ; 使用替换的涂装列表（仅适用于车辆）

; 移除特定网格或包含网格的整个节点（可选）：
HIDE = name1, name2  ; 要隐藏的网格或节点（不能是受保护网格）

; 插入新的 3D 模型（可选；使用此项时，必须指定 INSERT_AFTER 或 INSERT_IN 之一）：
INSERT = new_model.kn5       ; 要插入的 KN5 的名称，应放在配置文件旁边
INSERT_AFTER = node_or_mesh  ; 节点/网格，新 KN5 将插入到它之后
INSERT_IN = COCKPIT_HR       ; 或者，要插入到的节点的名称，位于该节点其余内容之后
                             ; 二者选其一（如有必要，其实也可以同时使用）

; 额外的插入选项：
MULTIPLE = 0  ; 设为 1 允许新模型被插入多次（默认只会插入到
              ; INSERT_AFTER 或 INSERT_IN 过滤器找到的第一个节点中）
MERGE = 0     ; 设为 1 可将名称相同的节点合并在一起，而不是复制它们

; 变换插入模型的选项：
SCALE = 1, 1, 1     ; 改变尺寸：X、Y、Z 轴（对车辆而言，X 为左右，Y 为上下）
ROTATION = 0, 0, 0  ; 旋转：航向角、俯仰角、侧倾角，单位为度
OFFSET = 0, 0, 0    ; 移动：X、Y、Z 轴，单位为米
```

注意：不能对任何物理生效的「受保护」网格使用 HIDE=，例如 1ROAD... 或 AC_POBJECT...，但你可以通过[网格调整](https://github.com/general/mesh-adjustment)将它们从视野中隐藏。

这些选项中的大多数是在 v0.1.60 中添加的，更早的版本只有 `FILE`、`HIDE`、`INSERT` 和 `INSERT_AFTER`。

如果你要替换车辆的外部部件，请注意较低的 LOD 模型。当然，如果你要向赛道插入新模型，别忘了设置 LOD 距离。另外，以防万一：对于名称以「AC_」或数字开头、或包含「WALL」的网格和节点，整个功能都不会生效，以确保该选项无法被用于作弊。

# 配置模板

*配置模板是内置了一些实用内容的配置，可以更快更轻松地完成设置，自动生成大部分样板内容。*

### 自定义轮圈（common/custom_rims.ini）

帮助快速替换车辆的轮圈，需要一个只包含单个车轮的 KN5，其对齐方式应如下所示：

<a href="https://i.imgur.com/pqfeIJi.png" target="_blank"><img src="https://i.imgur.com/pqfeIJi.png" width=400 /></a>

以下是在 Miura 上的实际用例：

```ini
[INCLUDE: common/custom_rims.ini]

[ReplaceRims]
File = lamborghini_miura_sv.kn5  ; KN5 的名称
OriginalRims = RIM_?             ; 要隐藏的原始轮圈列表
Model = rim.kn5, 0.276, 0.238    ; 带新轮圈的 KN5，以及其半径和宽度
Offset = 0, -0.03                ; 前轮和后轮的偏移（负值使轮圈更靠内）

[ReplaceRims]
File = lamborghini_miura_sv_LOD_B.kn5
OriginalRims = RIM_?
Model = rim_B.kn5, 0.276, 0.238
Offset = … ; 以此类推
```

如有需要，你也可以设置 `Radius` 和 `Width` 来指定所插入轮圈的尺寸，但默认情况下，配置会使用“tyres.ini”中的 `RIM_RADIUS` 和 `WIDTH`。`Offset`、`Radius` 和 `Width` 的值可以是单个或成对：单个时同时作用于前后；成对时，第一个值用于前轮，第二个值用于后轮。

通过 `FrontOnly = 1` 或 `RearOnly = 1` 可以将整个替换限制在某一侧。请注意，`[ReplaceRims]` 可以使用多次，因为它们是 [INIpp 模板](https://github.com/ac-custom-shaders-patch/inipp)。

此外，你可以使用 `Skins` 来设置过滤器或涂装列表，限定自定义轮圈仅在特定涂装下生效。

