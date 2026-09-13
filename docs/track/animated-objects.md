---
title: 动画对象
---


> 汉化标题：赛道 – 动画对象  
> 原文页面：Tracks-–-Animated-objects  
> 原文锚点：6d1c6f0  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：lag 译作「滞后」（平滑跟随系数：0 为立即响应，1 为完全无响应）  

借助这一 CSP 功能，你可以以多种方式让对象动起来。移动时钟指针、让火车沿轨道行驶、旋转风向标和风车、将位置、旋转或缩放关联到[条件](https://github.com/track/conditions)，或使用 “.ksanim“ 关键帧动画。如果你还需要其他行为，请告诉我。

首先是一个重要提示：如果你正在制作一条新赛道并想让某些东西动起来，把要动画的对象导出到单独的 KN5 中并使用 “Save KN5/Car”（保存 KN5/车辆）选项保存会容易得多。将 KN5 保存为赛道意味着其整个层级结构会被塌陷成一份单一的网格列表。渲染更快、物理也正常，但网格将无法移动，除非它们位于各自的节点内。否则，你就得通过配置把网格包进节点里，某些情况下可能会变得相当复杂（尤其是涉及 “.ksanim“ 文件时）。相关流程我会在下文说明。

这里有一个动画赛道示例，即[这个视频](https://youtu.be/XOIRDhoIm6c)中使用的那条：[赛道链接](https://drive.google.com/uc?id=1UywohUEgZcfv0u9-MVw49TrB-50mMfqi)。感谢 Soyo 的制作！

### 语法

整个配置从下面这些内容开始：

```ini
[ANIMATED_...]
ACTIVE = 1        ; （可选）设为 0 可禁用
NODE = root_node  ; 要移动的节点名称（关键帧动画请设置一个
                  ; 包裹整个对象的节点）
```

在这之后，每种行为都有各自的参数。如何指定行为？根据所填的参数自动判断！当初添加这个功能时我也不知道自己为什么选了这条路子，但我感觉以后它会反咬我一口。

在继续之前，有几点需要说明：

- 这些动画中有许多依赖滞后（lag）参数。你可以把它想象成质量。0 表示立即反应，1 表示完全没有反应。实际上，CSP 的大多数功能都用到了这类参数，不过我想在这里提一句以防万一。

- 对于其中一些行为，可以用条件的值来代替数字。这些值我用 `*` 标出了。只需在那里用条件名代替数字，它就能工作。

### 风车

```ini
[ANIMATED_...]
NODE = windmill_rotating_part
WINDMILL_DIR = 1, 0, 0       ; 风车所响应的风向
WINDMILL_DIR_EXP = 1         ; 增大可减少近乎侧向的风带来的旋转¹
WINDMILL_DIR_BOTH_SIDES = 1  ; 设为 0 可让从背面吹来的风不产生任何影响
SPIN_AXIS = 0, 0, 1          ; 旋转轴
WIND_SPEED_KMH_MIN = 0.5     ; 风车开始转动的风速
WIND_SPEED_KMH_MAX = 20      ; 风车以最高转速旋转时的风速
WIND_SPEED_KMH_STOP = 0      ; 风车被强制停止时的风速²
LAG_UP = 0.999               ; 加速滞后
LAG_DOWN = 0.999             ; 减速旋转的滞后
LAG_BRAKING = 0.98           ; 强制停止的滞后
SPEED_MULT = 1               ; 转速乘数*
```

¹ 默认情况下，与 `WINDMILL_DIR` 偏离 60° 的风会产生一半的旋转；而如果 `WINDMILL_DIR_EXP` 的值为 2，则只会产生四分之一。

² 这是为那些发电的现代风车准备的。风太强时它们不会加速，以确保不会把自己转散架。

### 风向标

```ini
[ANIMATED_...]
NODE = weather_vane
WEATHERVANE_DIR = 1, 0, 0  ; 风向标所响应的风向
WEATHERVANE_DIR_EXP = 0    ; 增大可减少近乎侧向的风带来的旋转¹
SPIN_AXIS = 0, 1, 0        ; 旋转轴
SPEED_MULT = 1             ; 转速乘数
WIND_SPEED_KMH_MIN = 0.5   ; 风向标开始转动的风速
INERTIA = 0.99             ; 风向标惯性
ANGLE_OFFSET = 0           ; 角度偏移，以备不时之需
```

¹ 与相应的风车参数非常相似，但由于风向标通常会对任何风作出反应，这里的默认值为 0。

### 时钟指针

```ini
[ANIMATED_...]
NODE = needle_hours
CLOCK_NEEDLE = HOUR  ; 角色，有效值：SECONDS、MINUTE、HOUR 或 HOUR24
OFFSET_DEG = 0       ; 偏移角度（度）
DEBUG_VALUE = 0      ; 设为非零值可进行调试，会将指针强制设为该值
SPIN_AXIS = 0, 0, 1  ; 旋转轴
LAG = 0.67           ; 用于平滑移动的滞后
```

### 关键帧动画

```ini
[ANIMATED_...]
NODE = animated_node
ANIMATION = animation.ksanim  ; 动画文件名，必须位于配置文件同级目录
TICK_TOCK_MODE = 0            ; 设为 1 可让动画前进后再后退
DURATION = 10                 ; 动画时长（秒）*
; PROGRESS =                  ; 动画进度¹*
```

¹ `PROGRESS` 用于将动画关联到某个特定条件，而不是只按给定间隔循环播放。这样，你就可以把动画与一天中的时间、太阳角度等事物绑定。

### 火车

```ini
[ANIMATED_...]
NODE = train_node
MOVE_ALONG = train_loop             ; 火车将沿其移动的网格名称¹
NODES_FOLLOWING = train_1, train_2  ; 挂接在火车后面的车厢名称

CLUSTER_THRESHOLD = 3      ; 可能需要调整，以帮助轨迹检测
STARTING_POINT = X, Y, Z   ; 对于非闭合路径，从这里出发驶向另一端
INVERT_DIRECTION = 0       ; 用于闭合（环形）路径
TICK_TOCK_MODE = 0         ; 设为 1 可往返行驶
CUBIC_INTERPOLATION = 0    ; 设为 1 可获得更平滑的移动（推荐）
SPEED_KMH = 40             ; 基础车速*
; PROGRESS =               ; 行进进度²*
PIECE_LENGTH = 5           ; 挂接车厢的长度
LAG_UP = 0.9               ; 加速滞后
LAG_DOWN = 0.9             ; 减速滞后
DELAY_BETWEEN_RUNS = 0, 0  ; 两次运行之间随机延迟的最小和最大边界，单位为秒
DEBUG_PATH = 0             ; 设为 1 可高亮显示生成的路径

; 路径还可以包含局部限速区域：
SPEED_ADJUSTMENT_0 = 50             ; 火车在该区域内的目标速度*
SPEED_ADJUSTMENT_0_POINT = X, Y, Z  ; 坐标
SPEED_ADJUSTMENT_0_RADIUS = 20, 60  ; 完全生效的半径和开始调整的半径，单位为米

; 火车还可以为其他条件创建新的输入，非常适合用来挂接音频或灯光：
SPEED_CONDITION_INPUT = MyNewInput_TrainSpeed
PROGRESS_CONDITION_INPUT = MyNewCondition_TrainProgress
```

¹ 该网格用于生成路径，应该是一条细长的条带（可以隐藏）。它既可以闭合也可以开放，火车会根据其法线的朝向倾斜（如果你观看[示例](https://youtu.be/XOIRDhoIm6c)，火车在那里做了类似桶滚的动作）。

² `PROGRESS` 用于将行进关联到某个特定条件。这样，你就可以把它与一天中的时间、太阳角度等事物绑定。不确定这对火车是否有用，但应该还有其他沿特定路径移动的东西，对吧？

#### 来自 @John514 的火车使用小贴士

- 将火车沿 Y 轴对齐；
- 1 号车厢必须位于下方（朝向 Y'）；
- 需要移动的对象要在 X 轴上旋转 90 度。

### 条件动画

如果设置了 `POSITION`、`ROTATION` 或 `SCALE` 中的任意一个，就会选用该行为。在这里，位置、缩放和旋转角度全都可以用赛道条件或表达式来设置。

```ini
[ANIMATED_...]
NODE = something_moving
POSITION = X, Y, Z
SCALE = X, Y, Z
ROTATION = X
SPIN_AXIS = 0, 1, 0
```

