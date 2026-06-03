---
title: 车辆通用选项
---

# 车辆通用选项（General Options）

车辆有一些通用选项，用于调整 CSP 与车辆的交互方式。

## 基础设置（BASIC）

```ini
[BASIC]
RACING_CAR = 0                 ; 默认情况下，CSP 使用车辆类别来判断是否为赛车，
                               ; 该值用于确定许多默认参数（例如，赛车默认没有近光灯）
OPEN_WHEELER = 0               ; CSP 使用此标志来猜测某些未明确设置的参数
                               ; （例如，火花或轮胎的外观，甚至车辆在渲染队列中的渲染方式）；
                               ; 默认尝试从 "ui_car.json" 中的标签检测此值
RALLY_CAR = 0                  ; 类似的情况，但拉力赛检测仅用于在单车比赛中
                               ; 将前大灯切换到拉力模式
DIESEL_ENGINE = 0              ; 发动机是否为柴油发动机（用于排气烟雾颜色）
BRAKES_THRESHOLD = 0.01        ; 刹车踏板需要踩下多少才能点亮刹车灯
LIGHT_DAMAGE_SPEED_MIN = 80    ; 灯光开始损坏的碰撞速度
LIGHT_DAMAGE_SPEED_MAX = 120   ; 灯光完全损坏的碰撞速度
IS_LOW_BEAM_AVAILABLE = 1      ; 近光灯是否可用（默认仅街头车辆可用）
HEADLIGHTS_ARE_HEADLIGHTS = 1  ; 前大灯是否就是前大灯（少数改装车使用前大灯
                               ; 作为动画仪表板等方式）
STOP_LODS_ADJUSTMENT = 0       ; 阻止补丁调整 LOD，即使用户偏好不同的 LOD 工作方式
                               ; （例如，强制对其他车辆使用 LOD B）
IGNORE_OTHER_CONFIGS = 0       ; 设为 1 以忽略其他位置可能存在的配置
NO_NEED_FOR_LIGHTS_FIX = 1     ; 用于在损坏的 CSP 版本上制作的车辆；如果额外灯光
                               ; 非常亮，请设为 0（默认自动猜测）
SPARKS_UPWARDS_FORCE = 300     ; 作用于从车底飞出的火花的力的乘数
                               ; （默认：开放式车轮 500，赛车 300，其余 100）
```

## 数据设置（DATA）

```ini
[DATA]
DISABLE_ANALOGINSTRUMENTSINI = 1  ; 完全禁用 "analog_instruments.ini"，以便使用自定义模拟仪表重新创建
DISABLE_LIGHTSINI = 1             ; 完全禁用 "lights.ini"，以便使用自定义发光重新创建
LIGHT_ANIMATION_TIME = 1          ; 更改前大灯动画持续时间

; 这些选项允许修改 "lights.ini" 中灯光的工作方式
LIGHT_SWITCH_LAG_mesh_name = 0.9  ; 替换 "lights.ini" 中 "mesh_name" 的切换延迟
LIGHT_HEATING_K_mesh_name = 0.9   ; 替换 "lights.ini" 中 "mesh_name" 的加热系数

; 临时参数，可能会在以后移除
FAKE_HIGHBEAMS_INDICATOR_mesh_name = 0.9  ; 更改 "lights.ini" 中某些绿色 "mesh_name" 仪表板
                               ; 指示灯的行为，在远光灯时将其颜色改为蓝色
```

## KN5 模型设置

```ini
[KN5]
; 防止补丁优化某些网格（如果导致问题）
DISALLOW_MESH_OPTIMIZATIONS = mesh1, mesh2
DISALLOW_MESH_MORE_OPTIMIZATIONS = mesh1, mesh2
```

## 加载画面详情

```ini
[LOADING_SCREEN_DETAILS]
; 防止补丁优化某些网格（如果导致问题）
COMMENT = Additional comment
```

## 额外猜测

```ini
[EXTRA_GUESSING]
FIX_WINDSCREENS = 1  ; 默认情况下，CSP 会尝试自动查找并为挡风玻璃材质应用 ksWindscreen
                     ; 着色器，设为 0 以禁用
```

## VAO 设置

```ini
[VAO]
OPACITY = 0.9     ; 如果设置，覆盖 VAO 补丁的不透明度
MULTIPLIER = 1.0  ; 如果设置，覆盖 VAO 补丁的亮度乘数
```

## 灯光调整（LIGHTING）

```ini
[LIGHTING]
; 驾驶舱下半部分假阴影参数，用于后方车辆的前大灯
INTERIOR_FAKE_SHADOW_OPACITY = 0.9  ; 不透明度
INTERIOR_FAKE_SHADOW_HEIGHT = 0.1   ; 高度，即阴影边界的 Y 坐标
INTERIOR_FAKE_SHADOW_FADE = 0.2     ; 过渡的平滑度

; 顶部假阴影参数，阻止赛道灯光照亮靠近天花板的东西
INTERIOR_FAKE_UPPER_SHADOW_HEIGHT = -0.1  ; 高度，即阴影边界的 Y 坐标
INTERIOR_FAKE_UPPER_SHADOW_FADE = 0.1     ; 过渡的平滑度

; "lights.ini" 中发光值的乘数，修复旧车灯光偏暗的方法
EMISSIVE_MULT = 1                ; 通用乘数
EMISSIVE_HEADLIGHTS_MULT = 1     ; 前大灯乘数
EMISSIVE_BRAKELIGHTS_MULT = 1    ; 刹车灯乘数
EMISSIVE_PARKINGLIGHTS_MULT = 1  ; 停车灯乘数

; 其他灯光参数
LIT_MULT = 1                 ; 车辆对动态灯光的反应程度
SPECULAR_MULT = 1            ; 车辆上高光的亮度
FULLY_SHADOWED_INTERIOR = 1  ; 如果阴影不可用，完全以阴影状态渲染内饰
```

更多灯光参数请参考[灯光系统](./lights)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-General-options) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
