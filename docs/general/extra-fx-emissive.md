---
title: 额外 FX 自发光
---


> 汉化标题：通用 – 额外 FX 自发光  
> 原文页面：General-–-Extra-FX-emissive  
> 原文锚点：9400ae4  
> 汉化时间：2026-09-12T19:00:00+08:00  

从 0.1.79 起，在启用 Extra FX 的情况下，车辆和赛道都可以让自发光网格向周围几何体投射真实光线。几乎支持所有着色器，甚至包括蒙皮网格：

<a href="https://gfycat.com/PartialLastingBovine"><img src="https://thumbs.gfycat.com/PartialLastingBovine-size_restricted.gif"></a>

### 语法

```ini
[EXTRA_FX_EMISSIVE_...]
MESHES = …               ; 网格列表
MATERIALS = …            ; 材质列表
DIGITAL_INSTRUMENTS = ?  ; 数字仪表的过滤器（对大多数仪表而言，是
    ; “digital_instruments.ini”中各节的名称），仅适用于车辆
RANGE = 0.1              ; 范围，以米为单位（默认车辆为 0.08，赛道为 5）
COLOR = 1                ; 可选的亮度乘数（可以是 RGBA 值）
DIRECTED = …             ; 设为 0 为点光源，1 为定向光源，或设为
    ; 介于两者之间的值（默认根据网格形状猜测）

; 车辆可选的优化标志：
INTERIOR_ONLY = 1        ; 仅在内部视角中显示
EXTERIOR_ONLY = 0        ; 仅在外部视角中显示

; 针对更复杂情况的可选高级调整：
EMISSIVE_TWEAK = 1       ; 对自发光颜色做额外的色调映射以平衡效果
    ; （设为 0 禁用，设为大于 1 的值可进一步减弱很大的自发光值的效果）
MIP_BIAS = 0             ; 纹理的 MIP 偏置（增大可获得更柔和的光照）
IGNORE_TEXTURE_COLOR = 0 ; 设为 1 则仅使用 COLOR 和自发光颜色

; 可选的分布设置（可能影响性能）：
COVERAGE = 3             ; 采样密度，默认车辆为 3，赛道为 2（实际
    ; 采样数量由网格面积、光照范围和覆盖密度决定）
SAMPLES_LIMIT = 100      ; 采样数量的上限，以确保生成过程不会
    ; 耗费大量时间，默认赛道为 400
SPLIT_ELEMENTS = 0       ; 在生成采样前将网格拆分为元素，
    ; 默认赛道为 1
SPLIT_THRESHOLD = …      ; 设为大于 0 的值，可在拆分元素前
    ; 焊接该距离内的顶点
NORMAL_SHIFT = 0         ; 增大可使产生光照的采样沿法线远离表面
    ; （如果周围过暗，请使用此项）
COVERED_BY = …           ; 当指定名称的网格可见时停止自发光
```

### 重要说明

![Screenshot](https://files.acstuff.ru/shared/2hKr/20220919-164050-spa-pagani_huayra.jpg)

- 对于几乎所有情况，简单的 `[EXTRA_FX_EMISSIVE_...] MESHES = …` 就够用了，但有些选项可以应对更复杂的场景。该效果应能与多通道自发光、制动盘、发光网格良好配合（默认情况下，“gt3_exhaust_glow.ini”在可用时已改为使用发光自发光）。

- 如果你有模拟发光自发光的光源，请为其添加 `DISABLE_WITH_EMISSIVE_LIGHT = 1`，使其仅在 Extra FX 发光自发光效果被禁用时才生效，以避免双重发光。

- 你可以将此效果附加到后视镜上，但暂时请不要这样做，下一次 CSP 更新会自动猜测这一部分。

- 在网格上分布发光采样可能需要一些时间，但每个网格只会发生一次，之后结果应会被缓存在“assettocorsa/cache”中。

- 在制作赛道时，不要将此效果用于照亮大半个屏幕的大型光源；可以考虑改用于夜间发光的窗户或彩色广告牌之类的东西。当相机被这类光照覆盖时，可能出现一些视觉故障，性能也可能变差。以下是在斯帕（Spa）赛道上的一些可能用例：[1](https://acstuff.ru/u/comparison/9d8)、[2](https://acstuff.ru/u/comparison/fr2)。

- 如果你在设置车辆 LED 的发光，可能会遇到 LED 相互遮挡的问题（例如 488 GT3 的情况）。使用 `COVERED_BY = …`（如 `COVERED_BY = RPM_LED_LIMITER_1`）可以让被遮挡的下层 LED 停止照亮周围。

- 要让大灯网格在大灯内部投射光线，可以用 `[EXTRA_FX] MASK_GBUFFER = headlight_glass_mesh_name` 将其表面设为遮罩 G 缓冲区而不将其遮挡（这样应该能让 SSLR 生效）。[详情见此处](/general/extra-fx-flags)。

