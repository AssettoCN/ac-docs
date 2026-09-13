---
title: 轮胎 FX
---


> 汉化标题：车辆 – 轮胎 FX  
> 原文页面：Cars-–-Tyres-FX  
> 原文锚点：4099edb  
> 汉化时间：2026-09-12T00:00:00+08:00  

# 主要设置

轮胎 FX 模块为轮胎外观添加了一些内容，例如视觉形变、损伤和磨损。CSP 会尝试自动猜测设置，但有时手动调整可能更有帮助。请记住，您可以查看[猜测配置](https://github.com/car/guessed-configs)来了解猜测出的值。

### 语法

请只在默认效果不佳时才调整设置，并且只调整需要调整的项。不要整段照抄！

```ini
[TYRES_FX]  ; 使用 [TYRES_FX_FRONT] 或 [TYRES_FX_REAR] 可为特定车轴覆盖设置
ENABLED = 1                  ; 设为 0 可禁用轮胎 FX
NOFX_DISTANCE_SWITCH = 32    ; 暂停轮胎 FX 的距离
VISIBLE_IN_INTERIOR_CAM = 0  ; 若从车内能看到轮胎则设为 1（开轮式车辆会自动设置）

; 视觉形变
FLEX_MULT = 1                ; 视觉形变乘数（默认值 1 应反映物理行为，最好不要更改）
FLEX_MAX_SKEW_MULT = 0.8 
FLEX_PROFILE_MULT = 0.45
FLEX_SKEW_RANGE_MULT = 3
FLEX_SKEW_SMOOTHING = 0.1
FLEX_SQUASH_SMOOTHING = 0.1

; 泥土积累
DIRT_ACCUMULATION = 600  ; 积累速率
DIRT_WIDTH_K = 1.1       ; 宽度系数
DIRT_OFFSET_K = 0        ; 水平偏移系数
DIRT_FADE = 20           ; 泥土消退速率
DIRT_DIRT_DEBUG = 0      ; 设为 1 可查看完全脏污的轮胎
DIRT_GRASS_DEBUG = 0     ; 设为 1 可查看完全被草覆盖的轮胎

; 视觉磨损
WEAR_MAX_VIRTUAL_VM = 25  ; 轮胎看起来完全磨损所需行驶的距离（默认使用物理值）

; 视觉损伤
DAMAGE_WIDTH_K = 1.2         ; 损伤宽度系数
DAMAGE_OFFSET_K = 0          ; 损伤水平偏移
DAMAGE_FLAT_SPOT_DEBUG = 0   ; 设为 1 可查看布满平斑损伤的轮胎
DAMAGE_FLAT_SPOT_GAIN = 5    ; 平斑损伤增长速率
DAMAGE_FLAT_SPOT_FADE = 0.1  ; 平斑损伤消退速率
DAMAGE_GRAIN_DEBUG = 0       ; 设为 1 可查看最大程度的颗粒损伤
DAMAGE_GRAIN_GAIN = 5        ; 颗粒损伤增长速率
DAMAGE_GRAIN_MAX = 0.8       ; 颗粒损伤上限
DAMAGE_NORMALS_MULT = 2      ; 损伤法线乘数
DAMAGE_OCCLUSION_MULT = 0.2  ; 损伤产生的环境光遮蔽强度
DAMAGE_REFL_MULT = 0.8       ; 受损区域反射率的衰减
DAMAGE_SPEC_EXP_MULT = 0.2   ; 受损区域光泽度的衰减
DAMAGE_SPEC_MULT = 0.6       ; 受损区域镜面反射的衰减

; 爆胎外观
BROKEN_TYRES_BASE_BRIGHTNESS = 1  ; 调整爆胎内侧部分的亮度
BROKEN_TYRES_BASE_NUDGE = 0       ; 调整爆胎内侧部分的形状

; 用于对齐程序化生成纹理的微调
CUSTOM_NORMALS_POS =       ; 位置，左右两侧
CUSTOM_NORMALS_SCALE =     ; 缩放（沿圆周重复次数），整数

; 全新轮胎的可选光泽（几乎立刻消失）
NEW_SHINE_SPECULAR_MULT = 1      ; 增大可使新轮胎更亮（F1 大约 10 左右效果不错）
NEW_SHINE_SPECULAR_EXP_MULT = 1  ; 增大可使新轮胎更镜面（F1 大约 4 左右效果不错）
```

# 着色器调整

## ksTyres 着色器的 `txMaps` 替代方案

原版 AC 使用 `txDiffuse`（及其模糊版本）的 alpha 通道作为镜面反射率和反射率的乘数，作用类似 `txMaps` 的红蓝通道。因此，至少应确保沟槽被遮挡的部分在其中为黑色，使其不会反射物体（相当于局部 AO 贴图）。

借助 CSP，您还可以使用 `txNormal`（及其模糊版本）的 alpha 通道设置光泽度/粗糙度贴图。只需将以下内容添加到车辆配置：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS=shader:ksTyre?
PROP_... = extTyresFlags, 4
PROP_... = extRoughnessExp, 10
```

采用此设置后，CSP 将根据 `txNormal` 的 alpha 通道改变 `ksSpecularEXP` 值：纹理为黑色处使用原始 `ksSpecularEXP`，纹理为白色处使用 `extRoughnessExp`。举几个例子：

- 将 `ksSpecularEXP` 设为 0、`extRoughnessExp` 设为 50 左右，`txNormal` 的 alpha 就会充当光泽度贴图，类似 `txMaps` 的绿色通道：越亮，高光越小、反射越锐利。
- 将 `ksSpecularEXP` 设为 50、`extRoughnessExp` 设为 0，alpha 就会充当粗糙度贴图，在最亮处模糊反射并增大高光面积。

## 翻转法线

使用这段代码可沿 X 轴翻转法线（有时可用于修正轮胎外观）：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS=shader:ksTyre?
PROP_... = extTyresFlags, 1
```

使用 2 可按 Y 标志翻转法线。要组合多个标志（例如同时启用 `extRoughnessExp` 并翻转法线），只需将所需的标志值相加。

