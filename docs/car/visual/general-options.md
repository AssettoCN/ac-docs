---
title: 通用选项
---


> 汉化标题：车辆 – 通用选项  
> 原文页面：Cars-–-General-options  
> 原文锚点：b3b5a65  
> 汉化时间：2026-09-12T19:00:00+08:00  

这里是一些车辆通用选项，用于调整补丁处理车辆的一些方式。

```ini
[BASIC]
RACING_CAR = 0                 ; 默认情况下，CSP 使用车辆类别来判断车辆是否为赛车，
                               ; 并大量使用该值来确定默认参数（例如，
                               ; 赛车默认没有近光灯）
OPEN_WHEELER = 0               ; 若未显式设置，CSP 会使用此标志来猜测某些参数
                               ; （例如火花或轮胎的外观，甚至车辆在渲染队列中的
                               ; 渲染方式）；默认情况下会尝试从“ui_car.json”的
                               ; 标签中检测该值
RALLY_CAR = 0                  ; 类似的情况，不过拉力检查仅用于在单人比赛时
                               ; 将大灯切换为拉力模式
DIESEL_ENGINE = 0              ; 发动机是否为柴油（用于排气烟色）
BRAKES_THRESHOLD = 0.01        ; 刹车踏板需要按下多少刹车灯才会亮起
LIGHT_DAMAGE_SPEED_MIN = 80    ; 车灯开始损坏的碰撞速度
LIGHT_DAMAGE_SPEED_MAX = 120   ; 车灯完全损坏的碰撞速度
IS_LOW_BEAM_AVAILABLE = 1      ; 是否有近光（默认仅街道车有）
HEADLIGHTS_ARE_HEADLIGHTS = 1  ; 大灯是否名副其实（少数模组车将大灯
                               ; 用作仪表板动画之类的用途）
STOP_LODS_ADJUSTMENT = 0       ; 即使用户希望 LOD 以其他方式工作（例如对其他
                               ; 车辆强制使用 LOD B），也阻止补丁调整 LOD
IGNORE_OTHER_CONFIGS = 0       ; 设为 1 可忽略可能存在于其他位置的其他配置
NO_NEED_FOR_LIGHTS_FIX=1       ; 用于在损坏的 CSP 版本上制作车辆；如果额外
                               ; 灯光亮得刺眼则设为 0（默认自动猜测）
SPARKS_UPWARDS_FORCE = 300     ; 作用于从车底飞出的火花的力的乘数
                               ;（默认方程式赛车为 500，赛车为 300，
                               ; 其余车辆为 100）

[DATA]
DISABLE_ANALOGINSTRUMENTSINI = 1  ; 完全禁用“analog_instruments.ini”，以便你用
                                  ; 自定义模拟仪表重新创建它
DISABLE_LIGHTSINI = 1             ; 完全禁用“lights.ini”，以便你用
                                  ; 自定义自发光重新创建它
LIGHT_ANIMATION_TIME = 1          ; 修改大灯动画的时长

; 这些选项用于修改“lights.ini”中灯光的工作方式
LIGHT_SWITCH_LAG_mesh_name = 0.9  ; 替换“lights.ini”中“mesh_name”的迟滞
LIGHT_HEATING_K_mesh_name = 0.9   ; 替换“lights.ini”中“mesh_name”的加热系数

; 临时功能，之后可能会被移除 
FAKE_HIGHBEAMS_INDICATOR_mesh_name = 0.9  ; 修改“lights.ini”中某个绿色“mesh_name”仪表板
                                  ; 指示灯的行为，使其在开启远光时
                                  ; 变为蓝色

[KN5]
; 如果优化导致了问题，可阻止补丁优化特定网格
DISALLOW_MESH_OPTIMIZATIONS = mesh1, mesh2
DISALLOW_MESH_MORE_OPTIMIZATIONS = mesh1, mesh2

[LOADING_SCREEN_DETAILS]
; 如果优化导致了问题，可阻止补丁优化特定网格
COMMENT = Additional comment

[EXTRA_GUESSING]
FIX_WINDSCREENS = 1  ; 默认情况下，CSP 会尝试自动为挡风玻璃材质查找并应用
                     ; ksWindscreen 着色器，设为 0 可禁用

[VAO]
OPACITY = 0.9     ; 若已设置，覆盖 VAO 补丁的不透明度
MULTIPLIER = 1.0  ; 若已设置，覆盖 VAO 补丁的亮度乘数
```

### 灯光调整

```ini
[LIGHTING]
; 车辆内部下半部分假阴影的参数，用于后方车辆的大灯
INTERIOR_FAKE_SHADOW_OPACITY = 0.9  ; 不透明度
INTERIOR_FAKE_SHADOW_HEIGHT = 0.1   ; 高度，即阴影边界的 Y 坐标
INTERIOR_FAKE_SHADOW_FADE = 0.2     ; 过渡的平滑程度

; 顶部假阴影的参数，用于阻止赛道灯光照亮靠近车顶的东西
INTERIOR_FAKE_UPPER_SHADOW_HEIGHT = -0.1  ; 高度，即阴影边界的 Y 坐标
INTERIOR_FAKE_UPPER_SHADOW_FADE = 0.1     ; 过渡的平滑程度

; “lights.ini”中自发光值的乘数，用于修复灯光较暗的老车
EMISSIVE_MULT = 1                ; 总乘数
EMISSIVE_HEADLIGHTS_MULT = 1     ; 大灯乘数
EMISSIVE_BRAKELIGHTS_MULT = 1    ; 刹车灯乘数
EMISSIVE_PARKINGLIGHTS_MULT = 1  ; 驻车灯乘数

; 其他灯光参数
LIT_MULT = 1                 ; 车辆对动态光照的反应程度
SPECULAR_MULT = 1            ; 车身高光的亮度
FULLY_SHADOWED_INTERIOR = 1  ; 如果阴影不可用，则将内部渲染为全阴影
```

