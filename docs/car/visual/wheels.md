---
title: 车轮
---


> 汉化标题：车辆 – 车轮  
> 原文页面：Cars-–-Wheels  
> 原文锚点：4099edb  
> 汉化时间：2026-09-12T00:00:00+08:00  

与车轮相关的一些设置。

### 基础轮胎尺寸

默认情况下，CSP 使用物理尺寸来估算轮胎大小，但这些尺寸并不总是与视觉相符。通过这些设置可以覆盖它们。这些尺寸会被 Skidmarks FX 和 Particles FX 等功能使用，因此最好确保它们匹配。

所有参数均为可选；若未设置，CSP 将退回猜测值。

```ini
[WHEEL_LF, WHEEL_RF, WHEEL_LR, WHEEL_RR]  ; 按需配置任意车轮
IS_OPEN = 0           ; 若该车轮未被遮挡则设为 1，对轮胎烟雾非常重要
TYRE_WIDTH = 0.3      ; 轮胎宽度
TYRE_OFFSET = 0.035   ; 轮胎偏移
RIM_WIDTH = 0.24      ; 轮辋宽度
RIM_OFFSET = 0.05     ; 轮辋偏移
; DEBUG = 1           ; 取消注释以显示调试轮廓线，有助于校准尺寸
```

### 刹车痕 FX

```ini
[SKIDMARKS_FX]
ALPHA = 0.6, 0.9        ; 最小和最大 alpha
COLOR_BASE = '#131419'  ; 基础颜色
COLOR = '#131419'       ; 强调色

; 此外，可以为特定车轮重新定义设置：
[SKIDMARKS_FX_TYRES_...]
TYRES = ST              ; 若设置，则仅应用于特定配方（此处使用短名称）
TYRES_FRONT = 1         ; 若设置，则仅应用于前轮
TYRES_REAR = 1          ; 若设置，则仅应用于后轮
TYRES_LEFT = 1          ; 若设置，则仅应用于左轮
TYRES_RIGHT = 1         ; 若设置，则仅应用于右轮
ALPHA = 0.6, 0.9        ; 最小和最大 alpha
COLOR_BASE = '#131419'  ; 基础颜色
COLOR = '#131419'       ; 强调色
```

### 粒子 FX

##### 烟雾

烟雾的外观和行为均可调整。此处列出的是默认值。如果给出 X/Y 两个值，则 X 为常规车辆的默认值，Y 为开轮式车辆的值。

```ini
[PARTICLES_FX]
SMOKE_COLOR = 0.8, 0.9, 1.0, 1.0  ; 调整烟雾颜色（可用于彩色烟雾），第四个值
                                  ; 相当于不透明度乘数，范围 0 到 2
SMOKE_COLOR_CONSISTENCY = 0.5     ; 增大可使烟雾在扩散时更久地保持颜色
SMOKE_FLYOFF_START = 0            ; 烟雾可从车轮脱离的区域起点
SMOKE_FLYOFF_END = 0.15/0.5       ; 可脱离烟雾区域的终点（弧度）
SMOKE_FLYOFF_DELAY = 2.0/0.5      ; 烟雾从车轮飞出的延迟
SMOKE_STUCK_OFFSET = 1.0/0.0      ; 附着在车轮上的烟雾的初始偏移（0 为中间，1 为
                                  ; 朝内方向）
SMOKE_STUCK_MAX_SPEED = 20        ; 附着车轮的烟雾的最大角速度
SMOKE_BLOCK_START = -1            ; 若大于零，设置烟雾无法脱离区域的起点
                                  ; （例如针对悬挑的轮拱）
SMOKE_BLOCK_END = -1              ; 烟雾无法脱离区域的终点（弧度）
SMOKE_INITIAL_SIZE_A = 0.08/N1    ; 烟雾粒子的最小尺寸
SMOKE_INITIAL_SIZE_B = 0.1/N2     ; 烟雾粒子的最大尺寸

; 其中：
; • N1 = 轮胎宽度 / 2.2
; • N2 = 轮胎宽度 / 2.0
```

所有设置均可针对特定车轴、车辆某一侧或某组轮胎重新定义：

```ini
[PARTICLES_FX_SMOKE_...]
TYRES = SM          ; 更改短名称为 SM 的轮胎的烟雾颜色
COLOR = 1, 0, 0, 1  ; 注意此处不再需要 “SMOKE_” 前缀

[PARTICLES_FX_SMOKE_...]
TYRES_FRONT = 1     ; 仅影响前轮
BLOCK_START = 0.4   ; 为前轴添加阻挡区域
BLOCK_END = 0.6

[PARTICLES_FX_SMOKE_...]
TYRES_LEFT = 1      ; 仅影响左轮
FLYOFF_DELAY = 4    ; 因故增大飞离延迟

[PARTICLES_FX_SMOKE_...]
TYRES_REAR = 1      ; 仅影响设置半热熔胎时的右后轮
TYRES_RIGHT = 1
TYRES = SM
COLOR = 1, 1, 0, 1  ; 在更后面的节中定义的颜色会覆盖之前设置的任何内容
```

还有一些与温度估算相关的设置，但随着温度估算模型的改动，它们将来可能会发生变化：

```ini
[PARTICLES_FX]
FORCE_THICKNESS = -1        ; 若设置（0…1 范围），覆盖烟雾厚度
HEAT_K = 0                  ; 若设置，覆盖 Particles FX 节烟雾设置中的加热乘数（0…2 范围）
COOL_AIR_K = 0.0001         ; 空气冷却系数
COOL_GROUND_K = 0.001       ; 地面冷却系数
COOL_CARCASS_K = 0.1        ; 胎体冷却系数
CARCASS_MULT = 0.5          ; 胎体冷却乘数
REL_VELOCITY_THRESHOLD = 3  ; 轮胎与地面之间开始使轮胎升温的最小速度差
```

#### 火花

利用轮胎尺寸调整火花发射器的位置。

### 轮胎 FX

为轮胎添加大量视觉效果：视觉形变、磨损与损伤、全新的泥土和草效果、不同类型轮胎的自定义纹理、程序化轮胎法线，尤其是爆胎的自定义外观。效果只对附近的轮胎生效，以略微提升速度。

（如果配置逻辑能与 Particles FX 的配置类似就好了，但由于这些都是在不同时期、与我自己学习编程同步写成的……唉。至少向后兼容性还是有的。）

```ini
[TYRES_FX]
ENABLED = 0                  ; 设为 0 可为指定车辆（或车轴）完全禁用轮胎 FX
NOFX_DISTANCE_SWITCH = 16    ; 禁用轮胎 FX 的距离（开轮式车辆 48，常规车辆 16）
VISIBLE_IN_INTERIOR_CAM = 0  ; 车内摄像机下效果是否生效（开轮式车辆默认为 1）

; 视觉损伤：
WEAR_MAX_VIRTUAL_VM = 25     ; 轮胎显示为完全磨损的虚拟公里数（默认：开轮式车辆 10，
                             ; 赛车 15，常规车辆 25）
DAMAGE_FLAT_SPOT_GAIN = 5    ; 平斑损伤强度
DAMAGE_FLAT_SPOT_FADE = 0.1  ; 平斑损伤消退速度
DAMAGE_GRAIN_GAIN = 5        ; 颗粒损伤强度
DAMAGE_GRAIN_MAX = 0.8       ; 颗粒损伤最大值
DAMAGE_WIDTH_K = 1.2         ; 视觉损伤区域宽度
DAMAGE_OFFSET_K = 0          ; 视觉损伤区域水平偏移
DAMAGE_FLAT_SPOT_DEBUG = 0   ; 若设置，为调试而覆盖整个车轮的平斑损伤
DAMAGE_GRAIN_DEBUG = 0       ; 若设置，为调试而覆盖整个车轮的颗粒损伤

; 视觉损伤的材质参数：
DAMAGE_SPEC_MULT = 0.6       ; 受损区域的 ksSpecular 乘数
DAMAGE_SPEC_EXP_MULT = 0.2   ; 受损区域的 ksSpecularEXP 乘数
DAMAGE_REFL_MULT = 0.8       ; 受损区域的 fresnelMaxLevel 乘数
DAMAGE_OCCLUSION_MULT = 0.2  ; 受损区域的 AO 乘数
DAMAGE_NORMALS_MULT = 2      ; 法线贴图增强值

; 视觉泥土：
DIRT_ACCUMULATION = 600      ; 泥土或草在车轮上积累的速度
DIRT_FADE = 20               ; 泥土消退的速度（同时受物理脏污程度的上限约束）
DIRT_OFFSET_K = 0.0          ; 车轮上泥土贴图相对车辆沿 X 轴的偏移
DIRT_WIDTH_K = 1.0           ; 车轮上泥土的宽度（设置为刚好碰到两侧为宜）
DIRT_GRASS_DEBUG = 0         ; 若设置，为调试而覆盖草污
DIRT_DIRT_DEBUG = 0          ; 若设置，为调试而覆盖非草污

; 形状变形：
FLEX_MULT = 1.0              ; 侧向形变乘数（基于物理，但有时轮胎配置
                             ; 可能比较奇怪：此参数可以帮上忙）
FLEX_PROFILE_MULT = 0.45     ; 轮胎轮廓的弯曲部分，范围 0.1 到 2
FLEX_SQUASH_SMOOTHING = 0.1  ; 压扁的时间滤波，范围 0 到 1（减小可获得更平滑的变化）
FLEX_SKEW_RANGE_MULT = 3     ; 偏斜范围
FLEX_SKEW_SMOOTHING = 0.1    ; 偏斜的时间滤波（减小可获得更平滑的变化）
FLEX_MAX_SKEW_MULT = 0.8     ; 最大偏斜乘数

; 自定义法线的定位（稍后详述）：
CUSTOM_NORMALS_POS = -0.15, 0.15  ; 使用此参数左右对齐自定义法线
CUSTOM_NORMALS_SCALE = 12         ; 自定义法线沿圆周重复的次数

; 爆胎：
BROKEN_TYRES_DYNAMIC = 1       ; 改为 0 可禁用爆胎的程序化外观
BROKEN_TYRES_BASE_NUDGE = 0.0  ; 爆胎中间部分的可选微调（除非您想为爆胎内侧
                               ; 使用自定义形状，否则请确保它不会
                               ; 与轮胎几何相交）
BROKEN_TYRES_BASE_BRIGHTNESS = 1.0 ; 爆胎内侧部分的亮度
BROKEN_TYRES_NORMAL_LF =       ; 若设置，轮胎未爆时显示此查询中的网格（将 _LF
                               ;  替换为 _RF、_LR、_RR）
BROKEN_TYRES_BROKEN_LF =       ; 若设置，轮胎爆裂时显示此查询中的网格
```

不同车轴的设置可以通过以下方式重新定义：

```ini
[TYRES_FX_FRONT]
DIRT_WIDTH_K = 10

[TYRES_FX_REAR]
DIRT_OFFSET_K = 0.2
```

自定义轮胎纹理可用于覆盖不同轮胎组的纹理：

```ini
[TYRES_FX_CUSTOMTEXTURE_SM]  ; 覆盖短名称为 “SM” 的纹理组
TXDIFFUSE =     ; txDiffuse 的替换
TXBLUR =        ; txBlur 的替换
TXNORMAL =      ; txNormal 的替换
TXNORMALBLUR =  ; txNormalBlur 的替换
```

所有键均为可选，未设置的键将使用默认纹理。如果轮胎有多个材质，请使用后缀 “_1”、“_2” 等：

```ini
[TYRES_FX_CUSTOMTEXTURE_SM]
MATERIAL = first_material
TXDIFFUSE = tex1.dds

[TYRES_FX_CUSTOMTEXTURE_SM_1]
MATERIAL = another_material
TXDIFFUSE = tex2.dds
```

纹理会先在 “ext_config.ini” 旁边查找。您也可以选择将其放入 ZIP 文件并使用 “file.zip::path/in/zip/entry_name.dds” 格式。如果只需要替换某个车轴上的纹理，请使用相应的后缀：

```ini
[TYRES_FX_CUSTOMTEXTURE_SM_FRONT]
[TYRES_FX_CUSTOMTEXTURE_SM_REAR]
[TYRES_FX_CUSTOMTEXTURE_SM_FRONT_1]
[TYRES_FX_CUSTOMTEXTURE_SM_REAR_1]
```

再提示一点：如果两组轮胎需要共用同一纹理，可以使用 INIpp 的功能来省去复制粘贴：

```ini
[TYRES_FX_CUSTOMTEXTURE_SM, TYRES_FX_CUSTOMTEXTURE_S]  ; 同时替换 SM 和 S 的纹理
TXDIFFUSE = tex1.dds
```

自定义轮胎网格。借助它们，可以只在选中特定轮胎组时才显示特定网格：

```ini
[TYRES_FX_CUSTOM_MESHES_...]
TYRES_0 = …         ; 轮胎短名称列表；若当前选中的轮胎在此列表中，则……
TYRES_0_MESHES = …  ; ……显示此处列出的网格
TYRES_1 = …         ; 另一个轮胎名称列表；若选中的轮胎在这里，则……
TYRES_1_MESHES = …  ; ……显示这些网格
DEFAULT_MESHES = …  ; 若选中的轮胎不在 TYRES_0、TYRES_1 等之中（本节范围内），则显示这些网格
```

### 程序化法线纹理

```ini
[TYRES_FX_PATTERN]
TYRES_REAR = 
TYRES_FRONT = 
TYRES_LEFT =  
TYRES_RIGHT = 
TYRES = 
PATTERN_TRIM =
```

### 带阴影的车轮

TODO

