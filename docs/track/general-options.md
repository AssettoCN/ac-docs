---
title: 赛道通用选项
---

# 赛道通用选项

赛道有一些通用选项，可以调整 Custom Shaders Patch（CSP）与赛道协同工作的方式。大部分设置需要重新加载比赛才能生效。

## 基本设置（BASIC）

```ini
[BASIC]
SUPPORTS_WIND = 1  ; 设为 0 可完全禁用所有基于风的效果。适用于室内赛道
RALLY_TRACK = 0    ; 单辆拉力赛车在拉力赛道上会获得不同的前灯效果。CSP 会根据标签猜测是否为拉力赛道，但你可以在此更改
PITBOXES = 4       ; 赛道维修区的停车位数量，用于修复 "ui_track.json" 中的错误
IGNORE_OTHER_CONFIGS = 0  ; 设为 1 以忽略其他位置可用的配置文件
```

## 光照设置（LIGHTING）

```ini
[LIGHTING]
ENABLE_TREES_LIGHTING = 0        ; 如果所有树木都不靠近赛道，禁用树木光照可以大幅提升性能
TRACK_AMBIENT_GROUND_MULT = 0.5  ; 仅在需要时定义！允许重新定义朝下表面的环境光乘数
BOUNCED_LIGHT_MULT = 1, 1, 1, 1  ; 反射光的乘数（例如赛道为黑色时设为 0）
LIT_MULT = 1                     ; 影响赛道的动态光源乘数
SPECULAR_MULT = 1                ; 高光乘数
CAR_LIGHTS_LIT_MULT = 1          ; 影响赛道上车辆的动态光源乘数
TERRAIN_SHADOWS_THRESHOLD = 0.0  ; 地形阴影阈值
```

## 粒子效果（PARTICLES_FX）

```ini
[PARTICLES_FX]
FIREWORKS_POS_... = 12.4, 100.5, 340.0   ; 烟花的 x,y,z 位置
FIREWORKS_POS_... = 16.4, 101.0, 341.0   ; 烟花的第二个 x,y,z 位置
```

## 天气效果（WEATHER_FX）

```ini
[WEATHER_FX]
SKY_BELOW_HORIZON = 1  ; 天空在地平线以下渲染的距离（默认值为 0.2115，设为 1 可获得 360° 天空）
```

## 观众（SPECTATORS）

用于自定义观众网格（非 "camera_facing.ini" 方式），当用户在某些模式下选择隐藏观众时会隐藏这些网格：

```ini
[SPECTATORS]
MESHES = mesh1, mesh2
```

## KN5 模型优化

防止 CSP 优化某些网格，以免引起问题：

```ini
[KN5]
DISALLOW_MESH_OPTIMIZATIONS = mesh1, mesh2
DISALLOW_MESH_MORE_OPTIMIZATIONS = mesh1, mesh2
```

## VAO（顶点环境光遮蔽）

```ini
[VAO]
OPACITY = 0.9     ; 如果设置，覆盖 VAO 补丁的不透明度
MULTIPLIER = 1.0  ; 如果设置，覆盖 VAO 补丁的亮度乘数
```

## 风力设置（WIND）

```ini
[WIND]
IGNORE = meshnames?           ; 禁用某些网格的风效果
DYNAMIC_FLAGS = AUTO          ; 有效值：NONE、AUTO 或常规网格过滤器
TREES_NORMALIZATION = 0.8, 1  ; 拉伸树木归一化区域，使原始 0.9 变为 0
GRASS_NORMALIZATION = 0.8, 1  ; 拉伸草地归一化区域，使原始 0.9 变为 0
RANDOMIZED_OFFSET_BASE = 4.0            ; 随机偏移基准值
RANDOMIZED_OFFSET_REL = 0.0             ; 随机偏移相对值
RANDOMIZED_OFFSET_CHANGE_SPEED = 5.0    ; 随机偏移变化速度
RANDOMIZED_OFFSET_CHANGE_MAX = 0.0      ; 随机偏移最大变化值
```

## 音频（非赛道配置，位于 `extension\config\track_adjustments.ini`）

```ini
; [AUDIO]
; DISPLAY_DUMMIES = 0           ; 设为 1 显示由配置中 [EVENT_...] 创建的音频对象位置
; VOLUME = 1.0                  ; 0..1，用于 CSP 声音如雨声等
```

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-General-options) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
