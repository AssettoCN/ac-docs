---
title: 变形墙
---


> 汉化标题：赛道 – 变形墙  
> 原文页面：Tracks-–-Deforming-walls  
> 原文锚点：f8703a0  
> 汉化时间：2026-09-12T00:00:00+08:00  

如果你在赛道上使用了[软墙体碰撞体](https://github.com/track/physics/collision-parameters)，那么设置视觉上的变形墙会是个不错的选择。注意，要让它们工作，需要启用[赛道扩展物理](https://github.com/track/physics/enabling)。

### 语法

```ini
[DEFORMING_WALLS_...]
MESHES = mesh0, …                ; 要变形的网格列表
MAX_DEPTH = 1.0                  ; 最大变形深度
RESTORATION_LAG = 0.8            ; 墙体恢复原状的滞后
DEPTH_MULT = 1.0                 ; 深度乘数
RADIUS_MULT = 1.0                ; 变形半径乘数
TESSELLATION = 1                 ; 设为 1 使用曲面细分（通常这类墙体
                                 ; 否则不会有足够的三角形）
TESSELLATION_DISTANCE = 20, 100  ; 距摄像机的曲面细分距离；第一个值对应最大
                                 ; 细分，第二个对应最小细分
TESSELLATION_FACTOR = 10, 3      ; 最大和最小曲面细分因子
ALPHA_MODE = OPAQUE              ; ...
```

发生碰撞时，CSP 会检查附近是否有可变形网格，若找到，就会激活带可选曲面细分的临时变形。变形淡出后（取决于 `RESTORATION_LAG`），会切换回普通着色器。你可以使用 `[SHADER_REPLACEMENT_...] CULL_MODE = WIREFRAME` 来观察曲面细分的效果。

