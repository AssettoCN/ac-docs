---
title: Extra FX 自发光
---

# Extra FX 自发光

自 v0.1.79 起，启用 Extra FX 后，车辆和赛道都可以设置自发光网格向周围几何体投射实际光照。几乎所有着色器都支持，甚至是蒙皮网格：

<!-- Image: https://thumbs.gfycat.com/PartialLastingBovine-size_restricted.gif — 自发光网格投射光照的动图演示 -->

## 语法

```ini
[EXTRA_FX_EMISSIVE_...]
MESHES = …               ; 网格列表
MATERIALS = …            ; 材质列表
DIGITAL_INSTRUMENTS = ?  ; 数字仪表过滤器（对于大多数，是
    ; "digital_instruments.ini" 中各节的名称），仅适用于车辆
RANGE = 0.1              ; 范围，单位：米（默认车辆为 0.08，赛道为 5）
COLOR = 1                ; 可选亮度乘数（可以是 RGBA 值）
DIRECTED = …             ; 设为 0 为点光源，1 为方向光，或
    ; 介于两者之间的值（默认根据网格形状猜测）

; 车辆可选优化标志：
INTERIOR_ONLY = 1        ; 仅在内部视角显示
EXTERIOR_ONLY = 0        ; 仅在外部视角显示

; 更复杂情况的可选高级调整
EMISSIVE_TWEAK = 1       ; 自发光颜色的额外色调映射以平衡效果
    ; （设为 0 禁用，设为 1 以上进一步减少大自发光值的效果）
MIP_BIAS = 0             ; 纹理的 MIP 偏移（增加可获得更平滑的光照）
IGNORE_TEXTURE_COLOR = 0 ; 设为 1 仅使用 COLOR 和自发光颜色

; 可选分布设置（可能影响性能）：
COVERAGE = 3             ; 采样密度，默认车辆为 3，赛道为 2（实际
    ; 采样数量由网格面积、光照范围和覆盖率控制）
SAMPLES_LIMIT = 100      ; 采样数量上限，确保生成不会
    ; 花费大量时间，默认赛道为 400
SPLIT_ELEMENTS = 0       ; 在生成采样前将网格拆分为元素，
    ; 默认赛道为 1
SPLIT_THRESHOLD = …      ; 设为大于 0 的值以在该距离内焊接顶点
    ; 后再拆分元素
NORMAL_SHIFT = 0         ; 增加以沿法线将光照产生采样移离表面
    ; （如果周围太暗则使用）
COVERED_BY = …           ; 当具有给定名称的网格可见时停止自发光
```

## 重要说明

<!-- Image: https://files.acstuff.ru/shared/2hKr/20220919-164050-spa-pagani_huayra.jpg — Spa 赛道上 Pagani Huayra 的自发光效果截图 -->

- 对于几乎所有情况，简单的 `[EXTRA_FX_EMISSIVE_...] MESHES = …` 就可以了，但某些选项可以帮助处理更复杂的情况。该效果应该与多通道自发光、刹车盘、发光网格良好配合（默认情况下 `gt3_exhaust_glow.ini` 已在可用时切换为使用发光自发光）。

- 如果你有一个模拟发光自发光的光源，请添加 `DISABLE_WITH_EMISSIVE_LIGHT = 1`，使其仅在 Extra FX 发光自发光效果禁用时工作，避免双重发光。

- 你可以将此效果附加到后视镜上，但目前请不要这样做，这部分将在下次 CSP 更新时自动猜测。

- 在网格上分布发光采样可能需要一些时间，但每个网格只发生一次，然后结果会被缓存在 `assettocorsa/cache` 中。

- 在赛道上工作时，不要将效果用于照亮大部分屏幕的大型灯光，而是考虑将其用于夜晚发光的窗户或彩色广告牌。当相机被此类灯光覆盖时，可能会出现一些视觉故障，性能也可能变差。以下是在 Spa 上的一些可能用例：[示例 1](https://acstuff.ru/u/comparison/9d8)、[示例 2](https://acstuff.ru/u/comparison/fr2)。

- 如果你正在设置车辆 LED 的发光效果，可能会遇到 LED 互相覆盖的问题（例如 488 GT3 的情况）。使用 `COVERED_BY = …`（如 `COVERED_BY = RPM_LED_LIMITER_1`）在被覆盖时停止底层 LED 向周围发光。

- 要让车灯网格在车灯内部投射光照，你可以使用 `[EXTRA_FX] MASK_GBUFFER = headlight_glass_mesh_name` 将其表面设置为遮罩 G-buffer 而不阻塞它（应该能让 SSLR 工作）。更多详情请参阅 [Extra FX 标志](./extra-fx-flags)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-Extra-FX-emissive) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
