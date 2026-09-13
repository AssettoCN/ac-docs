---
title: 通用选项
---


> 汉化标题：赛道 – 通用选项  
> 原文页面：Tracks-–-General-options  
> 原文锚点：b02fca9  
> 汉化时间：2026-09-12T00:00:00+08:00  

赛道有一些通用选项，用于调整补丁处理赛道的某些方面。其中大多数设置需要重新加载比赛才能生效。

```ini
[BASIC]
SUPPORTS_WIND = 1  ; 设为 0 可完全禁用所有基于风的效果。也许适合室内赛道？
RALLY_TRACK = 0    ; 在拉力赛道上，单辆拉力赛车会获得行为不同的大灯。补丁会尝试根据标签猜测是否为拉力赛道，但你可以在此更改
PITBOXES = 4       ; 赛道上的维修区车位数量，用于在 "ui_track.json" 有误时修正
IGNORE_OTHER_CONFIGS = 0  ; 设为 1 可忽略其他位置可能存在的其他配置

[LIGHTING]
ENABLE_TREES_LIGHTING = 0        ; 如果你的树木都不太靠近赛道，完全禁用树木光照可以大幅提升性能
TRACK_AMBIENT_GROUND_MULT = 0.5  ; 仅在需要时定义！允许重新定义朝下表面的环境光乘数
BOUNCED_LIGHT_MULT = 1, 1, 1, 1  ; 反射光乘数（例如赛道过黑时可设为 0）
LIT_MULT = 1                     ; 影响赛道的动态光源的乘数
SPECULAR_MULT = 1                ; 镜面反射乘数
CAR_LIGHTS_LIT_MULT = 1          ; 影响赛道上车辆的动态光源的乘数
TERRAIN_SHADOWS_THRESHOLD = 0.0  ; ?

[PARTICLES_FX]
FIREWORKS_POS_... = 12.4, 100.5, 340.0   ; 烟花的 x,y,z 位置
FIREWORKS_POS_... = 16.4, 101.0, 341.0   ; 烟花的第二个 x,y,z 位置

[WEATHER_FX]
SKY_BELOW_HORIZON = 1  ; 天空应渲染到地平线以下多远（默认值为 0.2115，设为 1 可获得 360° 天空）

[SPECTATORS]
; 用于自定义观众的网格列表（不是 "camera_facing.ini" 那套），在用户选择于某些模式下隐藏观众时将其隐藏
MESHES = mesh1, mesh2

[KN5]
; 防止补丁优化某些网格，以免引发问题
DISALLOW_MESH_OPTIMIZATIONS = mesh1, mesh2
DISALLOW_MESH_MORE_OPTIMIZATIONS = mesh1, mesh2

[VAO]
OPACITY = 0.9     ; 设置后覆盖 VAO 补丁的不透明度
MULTIPLIER = 1.0  ; 设置后覆盖 VAO 补丁的亮度乘数

[WIND]
IGNORE = meshnames?           ; 对某些网格禁用风
DYNAMIC_FLAGS = AUTO          ; 有效值：NONE、AUTO 或常规网格过滤器
TREES_NORMALIZATION = 0.8, 1  ; 拉伸树木归一化区域，使原本的 0.9 变为 0
GRASS_NORMALIZATION = 0.8, 1  ; 拉伸草地归一化区域，使原本的 0.9 变为 0
RANDOMIZED_OFFSET_BASE = 4.0            ; ? 4.f
RANDOMIZED_OFFSET_REL = 0.0             ; ? 0.5f
RANDOMIZED_OFFSET_CHANGE_SPEED = 5.0    ; ? 5.f
RANDOMIZED_OFFSET_CHANGE_MAX = 0.0      ; ? 0.8f

; 并非按赛道配置，而是位于 "extension\config\track_adjustments.ini"：
; [AUDIO]
; DISPLAY_DUMMIES = 0           ; 设为 1 显示由配置中 [EVENT_...] 创建的音频对象的位置
; VOLUME = 1.0                  ; 补丁自带声音（如雨声等）的音量，0..1
```

