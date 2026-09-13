---
title: 晃动部件
---


> 汉化标题：车辆 – 晃动部件  
> 原文页面：Cars-–-Wobbly-bits  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

晃动部件功能可以根据 G 力和重力方向移动节点。可用于颠簸后振荡的前翼、驾驶员车窗上的网格，或悬挂在后视镜上的物品。

可以把它想象成模拟仪表指针的移动方式。设置要移动的节点名称，指定它绑定的点，它就会开始晃动。

如果您想让网格弯曲，它需要蒙皮。将其一端绑定到某个骨骼上，然后用 `WOBBLY_BIT_N` 节移动该骨骼。如果不需要弯曲——比如说悬挂在后视镜上的小玩具——直接晃动其父节点即可。

### 语法

```ini
[WOBBLY_BIT_0]
NAME = FRONT_SPOILER_LEFT_SIDE  ; 要移动的节点名称
CONNECTED_TO = 0, 0.148, 1.86   ; 节点绑定的点，节点将绕其旋转
MAX_RANGE = 0.05                ; 节点可偏离原始位置的最大范围
DAMPENING_LAG = 0.93            ; 可将其视为普通的 AC lag 值，试图将节点速度归零
G_GAIN = 2                      ; G 力对节点速度的影响程度
GRAVITY_GAIN = 3                ; 重力对节点速度的影响程度
OFFSET_GAIN = 2000              ; 回复力的强度
STIFF_AXIS = 0, 0, 1            ; 可选的高刚度轴，用于减少沿该轴的运动
STIFF_AXIS_STIFFNESS = 0.7      ; 可选刚度轴的刚度大小
G_FILTER = 0                    ; G 力的时间滤波
DEFAULT_GRAVITY_INCLUDED_ALREADY = 1 ; 取值 `0` 或 `1`；如果不想让重力在车辆处于自然位置时使部件偏斜，设为 `1`
```

可以看到，它没有任何物理精确性可言，但这样反而更灵活。

如果您想让部件像没有刚度一样自由摆动，可以从这样的配置开始：

```ini
MAX_RANGE = 1         ; 去除所有边界
DAMPENING_LAG = 0.99  ; 降低摩擦
OFFSET_GAIN = 0       ; 真正的零刚度
G_GAIN = 2
GRAVITY_GAIN = 3
G_FILTER = 0
DEFAULT_GRAVITY_INCLUDED_ALREADY = 0
STIFF_AXIS_STIFFNESS = 0
```

### 猜测

无法猜测这类内容，至少目前不行。

### 稍后添加的功能

- 空气同样影响运动；
- 找到将普通网格转换为蒙皮网格以使其工作的方法；
- 模拟绳索行为的额外选项或新功能（?）。

