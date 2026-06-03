---
title: 车轮设置
---

# 车轮设置（Wheels）

与车轮相关的一些设置。

## 基础轮胎尺寸

默认情况下，CSP 使用物理尺寸来估算轮胎大小，但这些尺寸并不总是与视觉匹配。使用这些设置可以覆盖这些值。这些尺寸将被用于 Skidmarks FX 和 Particles FX 等，因此确保它们匹配是个好主意。

所有参数都是可选的，如果未设置，CSP 将回退到猜测值。

```ini
[WHEEL_LF, WHEEL_RF, WHEEL_LR, WHEEL_RR]  ; 使用需要配置的轮胎
IS_OPEN = 0           ; 如果车轮没有被覆盖，设为 1，对轮胎烟雾非常重要
TYRE_WIDTH = 0.3      ; 轮胎宽度
TYRE_OFFSET = 0.035   ; 轮胎偏移
RIM_WIDTH = 0.24      ; 轮毂宽度
RIM_OFFSET = 0.05     ; 轮毂偏移
; DEBUG = 1           ; 取消注释以显示调试轮廓，有助于校准尺寸
```

## 刹车痕迹 FX（Skidmarks FX）

```ini
[SKIDMARKS_FX]
ALPHA = 0.6, 0.9        ; 最小和最大 Alpha
COLOR_BASE = '#131419'  ; 基础颜色
COLOR = '#131419'       ; 强调颜色

; 可选，可以为特定车轮重新定义设置：
[SKIDMARKS_FX_TYRES_...]
TYRES = ST              ; 如果设置，仅适用于特定配方（使用短名称）
TYRES_FRONT = 1         ; 如果设置，仅适用于前轮
TYRES_REAR = 1          ; 如果设置，仅适用于后轮
TYRES_LEFT = 1          ; 如果设置，仅适用于左轮
TYRES_RIGHT = 1         ; 如果设置，仅适用于右轮
ALPHA = 0.6, 0.9        ; 最小和最大 Alpha
COLOR_BASE = '#131419'  ; 基础颜色
COLOR = '#131419'       ; 强调颜色
```

## 粒子 FX（Particles FX）

### 烟雾

烟雾的外观和行为都可以调整。这里列出了默认值。如果提供了两个值 X/Y，X 是常规车辆的默认值，Y 是开放式车轮的值。

```ini
[PARTICLES_FX]
SMOKE_COLOR = 0.8, 0.9, 1.0, 1.0  ; 调整烟雾颜色（可用于彩色烟雾），第四个值
                                   ; 类似于不透明度乘数，范围从 0 到 2
SMOKE_COLOR_CONSISTENCY = 0.5     ; 增大以使烟雾在扩展时保持颜色更长时间
SMOKE_FLYOFF_START = 0            ; 烟雾可以脱离车轮的区域起始点
SMOKE_FLYOFF_END = 0.15/0.5       ; 可脱离烟雾区域的结束点（弧度）
SMOKE_FLYOFF_DELAY = 2.0/0.5      ; 烟雾从车轮飞出的延迟
SMOKE_STUCK_OFFSET = 1.0/0.0      ; 粘在车轮上的烟雾的初始偏移（0 为中间，1 为
                                   ; 内侧方向）
SMOKE_STUCK_MAX_SPEED = 20        ; 粘在车轮上的烟雾的最大角速度
SMOKE_BLOCK_START = -1            ; 如果大于零，设置烟雾不能脱离的区域起始点
                                   ; （例如，悬垂的轮拱）
SMOKE_BLOCK_END = -1              ; 烟雾不能脱离的区域结束点（弧度）
SMOKE_INITIAL_SIZE_A = 0.08/N1    ; 烟雾粒子的最小尺寸
SMOKE_INITIAL_SIZE_B = 0.1/N2     ; 烟雾粒子的最大尺寸

; 其中：
; • N1 = 轮胎宽度 / 2.2
; • N2 = 轮胎宽度 / 2.0
```

所有设置可以为特定轴、车辆侧或轮胎组重新定义：

```ini
[PARTICLES_FX_SMOKE_...]
TYRES = SM          ; 更改短名称为 SM 的轮胎的烟雾颜色
COLOR = 1, 0, 0, 1  ; 注意这里不再需要 "SMOKE_" 前缀

[PARTICLES_FX_SMOKE_...]
TYRES_FRONT = 1     ; 仅影响前轮
BLOCK_START = 0.4   ; 为前轴添加阻挡区域
BLOCK_END = 0.6

[PARTICLES_FX_SMOKE_...]
TYRES_LEFT = 1      ; 仅影响左轮
FLYOFF_DELAY = 4    ; 出于某种原因增加飞出延迟

[PARTICLES_FX_SMOKE_...]
TYRES_REAR = 1      ; 仅影响使用半热熔轮胎的右后轮
TYRES_RIGHT = 1
TYRES = SM
COLOR = 1, 1, 0, 1  ; 在更后面章节中定义的颜色会覆盖之前设置的任何内容
```

还有与加热估算相关的设置，但这些可能会随着加热估算模型的更改而变化：

```ini
[PARTICLES_FX]
FORCE_THICKNESS = -1        ; 如果设置（在 0…1 范围内），覆盖烟雾厚度
HEAT_K = 0                  ; 如果设置，覆盖粒子 FX 部分中烟雾设置的加热乘数（0…2 范围）
COOL_AIR_K = 0.0001         ; 空气冷却系数
COOL_GROUND_K = 0.001       ; 地面冷却系数
COOL_CARCASS_K = 0.1        ; 轮胎胎体冷却系数
CARCASS_MULT = 0.5          ; 轮胎胎体冷却的乘数
REL_VELOCITY_THRESHOLD = 3  ; 轮胎与地面之间的最小速度差以开始加热轮胎
```

### 火花

使用轮胎尺寸来更改火花发射器的位置。

### 轮胎 FX

为轮胎添加一系列视觉效果：视觉变形、磨损和损伤、新的污垢和草地效果、不同类型轮胎的自定义纹理、程序化轮胎法线，特别是爆胎的自定义外观。效果仅对附近的轮胎激活以保持性能。

```ini
[TYRES_FX]
ENABLED = 0                  ; 设为 0 完全禁用给定车辆（或轴）的 Tyres FX
NOFX_DISTANCE_SWITCH = 16    ; 禁用 Tyres FX 的距离（开放式车轮 48，常规车辆 16）
VISIBLE_IN_INTERIOR_CAM = 0  ; 内饰相机下效果是否激活（开放式车轮默认 1）

; 视觉损伤：
WEAR_MAX_VIRTUAL_VM = 25     ; 轮胎显示为完全磨损的虚拟公里数（默认：开放式车轮 10，
                              ; 赛车 15，常规车辆 25）
DAMAGE_FLAT_SPOT_GAIN = 5    ; 平点损伤强度
DAMAGE_FLAT_SPOT_FADE = 0.1  ; 平点损伤消退速度
DAMAGE_GRAIN_GAIN = 5        ; 颗粒损伤强度
DAMAGE_GRAIN_MAX = 0.8       ; 颗粒损伤最大量
DAMAGE_WIDTH_K = 1.2         ; 视觉损伤区域宽度
DAMAGE_OFFSET_K = 0          ; 视觉损伤区域水平偏移
DAMAGE_FLAT_SPOT_DEBUG = 0   ; 如果设置，覆盖整个车轮的平点损伤用于调试
DAMAGE_GRAIN_DEBUG = 0       ; 如果设置，覆盖整个车轮的颗粒损伤用于调试

; 视觉损伤的材质参数：
DAMAGE_SPEC_MULT = 0.6       ; 损伤区域 ksSpecular 的乘数
DAMAGE_SPEC_EXP_MULT = 0.2   ; 损伤区域 ksSpecularEXP 的乘数
DAMAGE_REFL_MULT = 0.8       ; 损伤区域 fresnelMaxLevel 的乘数
DAMAGE_OCCLUSION_MULT = 0.2  ; 损伤区域的 AO 乘数
DAMAGE_NORMALS_MULT = 2      ; 法线贴图增强值

; 视觉污垢：
DIRT_ACCUMULATION = 600      ; 污垢或草地添加到车轮的速度
DIRT_FADE = 20               ; 污垢消退速度（也受物理脏污水平上限限制）
DIRT_OFFSET_K = 0.0          ; 车轮上沿 X 轴相对于车辆的污垢贴图偏移
DIRT_WIDTH_K = 1.0           ; 车轮上的污垢宽度（设置为刚好不触及两侧）
DIRT_GRASS_DEBUG = 0         ; 如果设置，覆盖草地污垢用于调试
DIRT_DIRT_DEBUG = 0          ; 如果设置，覆盖非草地污垢用于调试

; 形状变形：
FLEX_MULT = 1.0              ; 横向变形乘数（基于物理，但有时轮胎可能有奇怪的配置：
                              ; 此参数可以帮助）
FLEX_PROFILE_MULT = 0.45     ; 轮胎轮廓的弯曲部分，从 0.1 到 2
FLEX_SQUASH_SMOOTHING = 0.1  ; 挤压的时间滤波，从 0 到 1（减小以获得更平滑的变化）
FLEX_SKEW_RANGE_MULT = 3     ; 倾斜范围
FLEX_SKEW_SMOOTHING = 0.1    ; 倾斜的时间滤波（减小以获得更平滑的变化）
FLEX_MAX_SKEW_MULT = 0.8     ; 最大倾斜乘数

; 自定义法线的定位（更多内容在下面）：
CUSTOM_NORMALS_POS = -0.15, 0.15  ; 使用此参数从一侧到另一侧对齐自定义法线
CUSTOM_NORMALS_SCALE = 12         ; 自定义法线沿圆周重复的次数

; 爆胎：
BROKEN_TYRES_DYNAMIC = 1       ; 更改为 0 以禁用爆胎的程序化外观
BROKEN_TYRES_BASE_NUDGE = 0.0  ; 爆胎中间的可选推动（确保它不会与轮胎几何体相交，
                                ; 除非你想为爆胎的内部部分使用自定义形状）
BROKEN_TYRES_BASE_BRIGHTNESS = 1.0 ; 爆胎内部部分的亮度
BROKEN_TYRES_NORMAL_LF =       ; 如果设置，此查询中的网格在轮胎未破损时显示（将 _LF
                                ;  替换为 _RF、_LR、_RR）
BROKEN_TYRES_BROKEN_LF =       ; 如果设置，此查询中的网格在轮胎破损时显示
```

不同轴的设置可以重新定义：

```ini
[TYRES_FX_FRONT]
DIRT_WIDTH_K = 10

[TYRES_FX_REAR]
DIRT_OFFSET_K = 0.2
```

自定义轮胎纹理可用于覆盖不同轮胎组的纹理：

```ini
[TYRES_FX_CUSTOMTEXTURE_SM]  ; 覆盖短名称为 "SM" 的纹理集的纹理
TXDIFFUSE =     ; txDiffuse 的替代
TXBLUR =        ; txBlur 的替代
TXNORMAL =      ; txNormal 的替代
TXNORMALBLUR =  ; txNormalBlur 的替代
```

所有键都是可选的，如果任何未设置将使用默认纹理。如果轮胎有多个材质，使用后缀 "_1"、"_2" 等：

```ini
[TYRES_FX_CUSTOMTEXTURE_SM]
MATERIAL = first_material
TXDIFFUSE = tex1.dds

[TYRES_FX_CUSTOMTEXTURE_SM_1]
MATERIAL = another_material
TXDIFFUSE = tex2.dds
```

纹理将首先在 "ext_config.ini" 旁边查找。可选地，可以将它们放在 ZIP 文件中并使用 "file.zip::path/in/zip/entry_name.dds" 格式。如果只需要替换特定轴上的纹理，使用相应的后缀：

```ini
[TYRES_FX_CUSTOMTEXTURE_SM_FRONT]
[TYRES_FX_CUSTOMTEXTURE_SM_REAR]
[TYRES_FX_CUSTOMTEXTURE_SM_FRONT_1]
[TYRES_FX_CUSTOMTEXTURE_SM_REAR_1]
```

还有一个技巧：如果两个集合需要共享纹理，可以使用 INIpp 功能来减少复制粘贴：

```ini
[TYRES_FX_CUSTOMTEXTURE_SM, TYRES_FX_CUSTOMTEXTURE_S]  ; 同时替换 SM 和 S 的纹理
TXDIFFUSE = tex1.dds
```

### 自定义轮胎网格

使用这些，某些网格仅在选择了特定轮胎组时显示：

```ini
[TYRES_FX_CUSTOM_MESHES_...]
TYRES_0 = …         ; 短轮胎名称列表；如果当前选择的轮胎在此列表中，…
TYRES_0_MESHES = …  ; …显示此处列出的网格
TYRES_1 = …         ; 另一个轮胎名称列表；如果选择的轮胎在这里，…
TYRES_1_MESHES = …  ; …显示这些网格
DEFAULT_MESHES = …  ; 如果选择的轮胎不是 TYRES_0、TYRES_1 等（在此章节内），显示这些网格
```

### 程序化法线贴图

```ini
[TYRES_FX_PATTERN]
TYRES_REAR = 
TYRES_FRONT = 
TYRES_LEFT =  
TYRES_RIGHT = 
TYRES = 
PATTERN_TRIM =
```

### 阴影车轮

TODO

更多轮胎视觉效果详情请参考[轮胎视觉效果](./tyres-fx)，火花效果请参考[火花效果](./sparks)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Wheels) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
