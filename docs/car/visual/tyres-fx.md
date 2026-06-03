---
title: 轮胎视觉效果
---

# 轮胎视觉效果（Tyres FX）

Tyres FX 模块为轮胎外观添加了一些效果，例如视觉变形、损伤和磨损。CSP 会尝试自动猜测设置，但有时手动调整可能会有所帮助。你可以查看猜测配置来查看猜测值。

## 语法

请仅在默认值不理想时调整设置，且仅调整需要调整的参数。不要直接复制整个配置！

```ini
[TYRES_FX]  ; 使用 [TYRES_FX_FRONT] 或 [TYRES_FX_REAR] 覆盖特定轴的设置
ENABLED = 1                  ; 设为 0 禁用 Tyres FX
NOFX_DISTANCE_SWITCH = 32    ; 暂停 Tyres FX 的距离
VISIBLE_IN_INTERIOR_CAM = 0  ; 如果从内饰可以看到轮胎，设为 1（开放式车轮会自动设置）

; 视觉变形
FLEX_MULT = 1                ; 视觉变形乘数（默认值 1 应该反映物理行为，最好不要更改）
FLEX_MAX_SKEW_MULT = 0.8 
FLEX_PROFILE_MULT = 0.45
FLEX_SKEW_RANGE_MULT = 3
FLEX_SKEW_SMOOTHING = 0.1
FLEX_SQUASH_SMOOTHING = 0.1

; 污垢积累
DIRT_ACCUMULATION = 600  ; 积累速率
DIRT_WIDTH_K = 1.1       ; 宽度系数
DIRT_OFFSET_K = 0        ; 水平偏移系数
DIRT_FADE = 20           ; 污垢消退速率
DIRT_DIRT_DEBUG = 0      ; 设为 1 查看轮胎完全脏污
DIRT_GRASS_DEBUG = 0     ; 设为 1 查看轮胎完全被草覆盖

; 视觉磨损
WEAR_MAX_VIRTUAL_VM = 25  ; 轮胎看起来完全磨损前需要行驶的距离（默认使用物理值）

; 视觉损伤
DAMAGE_WIDTH_K = 1.2         ; 损伤宽度系数
DAMAGE_OFFSET_K = 0          ; 损伤水平偏移
DAMAGE_FLAT_SPOT_DEBUG = 0   ; 设为 1 查看轮胎覆盖平点损伤
DAMAGE_FLAT_SPOT_GAIN = 5    ; 平点损伤增益速率
DAMAGE_FLAT_SPOT_FADE = 0.1  ; 平点损伤消退速率
DAMAGE_GRAIN_DEBUG = 0       ; 设为 1 查看最大颗粒损伤量
DAMAGE_GRAIN_GAIN = 5        ; 颗粒损伤增益速率
DAMAGE_GRAIN_MAX = 0.8       ; 颗粒损伤上限
DAMAGE_NORMALS_MULT = 2      ; 损伤法线乘数
DAMAGE_OCCLUSION_MULT = 0.2  ; 损伤产生的环境光遮蔽强度
DAMAGE_REFL_MULT = 0.8       ; 损伤区域的反射率衰减
DAMAGE_SPEC_EXP_MULT = 0.2   ; 损伤区域的光泽度衰减
DAMAGE_SPEC_MULT = 0.6       ; 损伤区域的镜面反射衰减

; 爆胎外观
BROKEN_TYRES_BASE_BRIGHTNESS = 1  ; 调整爆胎内部部件的亮度
BROKEN_TYRES_BASE_NUDGE = 0       ; 调整爆胎内部部件的形状

; 对齐程序生成纹理的调整
CUSTOM_NORMALS_POS =       ; 放置，左右两侧
CUSTOM_NORMALS_SCALE =     ; 缩放（沿圆周重复），整数

; 全新轮胎的可选光泽（几乎立即消失）
NEW_SHINE_SPECULAR_MULT = 1      ; 增大以使新轮胎更有光泽（F1 约 10 效果不错）
NEW_SHINE_SPECULAR_EXP_MULT = 1  ; 增大以使新轮胎更光滑（F1 约 4 效果不错）
```

## 着色器调整

### ksTyres 着色器的 `txMaps` 替代方案

原始 AC 使用 `txDiffuse` 的 Alpha 通道（及其模糊版本）作为镜面反射率和反射率的乘数，类似于 `txMaps` 的红色和蓝色通道。因此，最好至少确保凹槽的遮挡部分在那里是黑色的，这样它们就不会反射东西（类似于局部 AO 贴图）。

使用 CSP，你还可以使用 `txNormal` 的 Alpha 通道（及其模糊版本）来设置光泽度/粗糙度贴图。只需在车辆配置中添加：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS=shader:ksTyre?
PROP_... = extTyresFlags, 4
PROP_... = extRoughnessExp, 10
```

使用此设置，CSP 将基于 `txNormal` 的 Alpha 通道修改 `ksSpecularEXP` 值，从纹理黑色的原始 `ksSpecularEXP` 到纹理白色的 `extRoughnessExp`。几个例子：

- 将 `ksSpecularEXP` 设为 0，`extRoughnessExp` 设为类似 50，则 `txNormal` 的 Alpha 将作为光泽度贴图，类似于 `txMaps` 的绿色通道：越亮，高光越小，反射越锐利。
- 将 `ksSpecularEXP` 设为 50，`extRoughnessExp` 设为 0，则 Alpha 将作为粗糙度贴图，在最亮的地方模糊反射并增加高光的大小。

### 翻转法线

使用以下代码沿 X 轴翻转法线（有时可用于修复轮胎外观）：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS=shader:ksTyre?
PROP_... = extTyresFlags, 1
```

使用 2 翻转 Y 轴法线。要组合多个标志（例如，同时启用 `extRoughnessExp` 和翻转法线），只需将所需标志相加。

更多车轮相关设置请参考[车轮设置](./wheels)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Tyres-FX) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
