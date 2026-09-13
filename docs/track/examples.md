---
title: 示例
---


> 汉化标题：赛道 – 示例  
> 原文页面：Tracks-–-Examples  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

一些赛道配置片段的示例。

### 车辆在场时打开的维修区门

<img src="https://files.acstuff.ru/shared/DSpT/20220611-180514-g333_sachsenring-ks_bmw_m4.jpg" width=380>

已知：所有维修区门共用一个网格，通过 `stPerPixelNM_UVflow` 着色器实现开启与关闭。

```ini
; 首先，需要将该网格拆分为多个单独的网格，每扇门一个：
[SPLIT_MESHES_...]
MESHES = PitwallSpotLightsGlass
NAME_FORMAT = PitwallSpotLightsGlass_{NearestPitStop}

; 然后，与其为每扇门手动创建灯光和材质调整，不如用 INIpp 提速，定义三个模板：
[TEMPLATE: Pits_LightCondition]
@OUTPUT = CONDITION_... ; 第一个模板会生成 [CONDITION_...] 节
@GENERATOR_STARTING_INDEX = 0 ; 我们会在 @GENERATOR 运行中用到它，因此它会被自动按给定次数初始化
NAME = Pits_Condition_$1 ; $1 会被替换为生成器的迭代索引，从 0 开始（因为上面的参数）
INPUT = " CAR_ACTIVE_$1 * condition:LIGHTS_ON " ; 现在有了 CAR_ACTIVE_0、CAR_ACTIVE_1、CAR_ACTIVE_2、… 这一整套输入，但没人愿意逐个手写它们
LAG = 0.97 ; 所有常规 [CONDITION_...] 参数都可以照常写在这里

[TEMPLATE: Pits_Light]
@OUTPUT = LIGHT_SERIES_... ; 第二个模板会生成 [LIGHT_SERIES_...] 节
@GENERATOR_STARTING_INDEX = 0
CONDITION = Pits_Condition_$1
MESHES = PitwallSpotLightsGlass_$1
COLOR = '#ffeeaa', 10
CLUSTER_THRESHOLD = 1
DIRECTION = NORMAL
DIRECTION_OFFSET = 0, 0.2, 0
RANGE_GRADIENT_OFFSET = 0
OFFSET = 0, 0, 0
SPOT = 160
SPOT_SHARPNESS = 0.9
RANGE = 20
SHADOWS = 1
SHADOWS_HALF_RESOLUTION = 1
SHADOWS_STATIC = 1
SHADOWS_EXP_FACTOR = 1
SHADOWS_BOOST = 4
SHADOWS_OFFSET = 0.03, -0.05, 0.03
SHADOWS_CLIP_PLANE = 0.001
SHADOWS_CLIP_SPHERE = 0.001
SPECULAR_MULT = 1

[TEMPLATE: Pits_Emissive]
@OUTPUT = MATERIAL_ADJUSTMENT_... ; 第三个模板生成 [MATERIAL_ADJUSTMENT_...] 节
@GENERATOR_STARTING_INDEX = 0
CONDITION = Pits_Condition_$1
MESHES = PitwallSpotLightsGlass_$1
KEY_0 = ksEmissive
VALUE_0 = '#ffeeaa', 20
VALUE_0_OFF = 0, 0, 0
KEY_1 = ksAlphaRef
VALUE_1 = -193
VALUE_1_OFF = 0

; 然后各生成 32 次：
[] ; 不存在的节：自身不添加任何内容，仅用于启动生成器
@GENERATOR = Pits_LightCondition, 32 ; 将它们各运行 32 次
@GENERATOR = Pits_Light, 32
@GENERATOR = Pits_Emissive, 32
```

