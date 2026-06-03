---
title: 动画对象
---

# 动画对象

通过此 CSP 功能，你可以以多种方式为对象制作动画。移动时钟指针、让火车沿轨道行驶、旋转风向标和风车、将位置、旋转或缩放链接到[条件](./conditions.md)，或使用 ".ksanim" 的关键帧动画。如果你需要其他行为，请联系开发者。

首先，重要提示：如果你正在制作新赛道并想为某些东西制作动画，将要动画化的对象导出到单独的 KN5 中并使用 "Save KN5/Car" 选项保存会更容易。将 KN5 保存为赛道意味着其整个层级结构会被折叠为单个网格列表。渲染更快且物理正常，但网格无法移动，除非它们在自己的节点内。否则，你需要通过配置将网格包装在节点中，在某些情况下可能会变得复杂（特别是涉及 ".ksanim" 文件时）。

## 语法

整体以此开始：

```ini
[ANIMATED_...]
ACTIVE = 1        ; （可选）设为 0 禁用
NODE = root_node  ; 要移动的节点名称（对于关键帧动画，设置一个包含整个对象的节点）
```

但之后，每种行为都有自己的参数。如何指定行为？根据存在哪些参数来选择。

继续之前，请注意几点：

- 许多动画依赖滞后值（lag）。可以将其想象为质量。0 表示即时反应，1 表示完全不反应。实际上，大多数 CSP 功能都使用这些，但我想在这里提一下以防万一。

- 对于某些行为，可以使用条件值代替数字。我标记了这些值为 `*`。只需在那里放置条件名称即可。

## 风车（Windmill）

```ini
[ANIMATED_...]
NODE = windmill_rotating_part
WINDMILL_DIR = 1, 0, 0       ; 风车响应的风向
WINDMILL_DIR_EXP = 1         ; 增加以减少近乎侧风的旋转¹
WINDMILL_DIR_BOTH_SIDES = 1  ; 设为 0 使从背面吹来的风不影响
SPIN_AXIS = 0, 0, 1          ; 旋转轴
WIND_SPEED_KMH_MIN = 0.5     ; 风车开始旋转的风速
WIND_SPEED_KMH_MAX = 20      ; 风车达到最高转速的风速
WIND_SPEED_KMH_STOP = 0      ; 风车强制停止的风速²
LAG_UP = 0.999               ; 加速滞后
LAG_DOWN = 0.999             ; 减速滞后
LAG_BRAKING = 0.98           ; 强制停止滞后
SPEED_MULT = 1               ; 旋转速度乘数*
```

¹ 默认情况下，从 `WINDMILL_DIR` 偏离 60° 的风会导致一半的旋转，但如果 `WINDMILL_DIR_EXP` 的值为 2，则只有四分之一。

² 适用于那些发电的现代风力涡轮机。风速太强时它们不会加速，以确保不会旋转到散架。

## 风向标（Weather vane）

```ini
[ANIMATED_...]
NODE = weather_vane
WEATHERVANE_DIR = 1, 0, 0  ; 风向标响应的风向
WEATHERVANE_DIR_EXP = 0    ; 增加以减少近乎侧风的旋转¹
SPIN_AXIS = 0, 1, 0        ; 旋转轴
SPEED_MULT = 1             ; 旋转速度乘数
WIND_SPEED_KMH_MIN = 0.5   ; 风向标开始旋转的风速
INERTIA = 0.99             ; 风向标惯性
ANGLE_OFFSET = 0           ; 角度偏移量
```

¹ 与风车参数非常相似，但由于风向标通常对任何风都有反应，这里默认值为 0。

## 时钟指针（Clock needle）

```ini
[ANIMATED_...]
NODE = needle_hours
CLOCK_NEEDLE = HOUR  ; 角色，有效值：SECONDS、MINUTE、HOUR 或 HOUR24
OFFSET_DEG = 0       ; 度数偏移
DEBUG_VALUE = 0      ; 设为非零值调试，会强制指针到该值
SPIN_AXIS = 0, 0, 1  ; 旋转轴
LAG = 0.67           ; 平滑移动的滞后值
```

## 关键帧动画（Keyframe animation）

```ini
[ANIMATED_...]
NODE = animated_node
ANIMATION = animation.ksanim  ; 动画文件名，必须位于配置文件旁边
TICK_TOCK_MODE = 0            ; 设为 1 使动画前后往复
DURATION = 10                 ; 动画持续时间（秒）*
; PROGRESS =                  ; 动画进度¹*
```

¹ `PROGRESS` 用于将动画链接到某个条件而非以给定间隔循环。这样可以将动画绑定到一天中的时间、太阳角度等。

## 火车（Train）

```ini
[ANIMATED_...]
NODE = train_node
MOVE_ALONG = train_loop             ; 火车沿着移动的网格名称¹
NODES_FOLLOWING = train_1, train_2  ; 附着车厢的节点名称

CLUSTER_THRESHOLD = 3      ; 可能需要调整以帮助轨迹检测
STARTING_POINT = X, Y, Z   ; 对于非循环路径，从此处开始移动到另一端
INVERT_DIRECTION = 0       ; 对于循环路径
TICK_TOCK_MODE = 0         ; 设为 1 前后往复
CUBIC_INTERPOLATION = 0    ; 设为 1 获得更平滑的移动（推荐）
SPEED_KMH = 40             ; 基本火车速度*
; PROGRESS =               ; 行进进度²*
PIECE_LENGTH = 5           ; 附着车厢的长度
LAG_UP = 0.9               ; 加速滞后
LAG_DOWN = 0.9             ; 减速滞后
DELAY_BETWEEN_RUNS = 0, 0  ; 运行之间随机延迟的最小和最大边界（秒）
DEBUG_PATH = 0             ; 设为 1 高亮显示路径

; 路径还可以包含局部速度调整区域：
SPEED_ADJUSTMENT_0 = 50             ; 该区域内火车的目标速度*
SPEED_ADJUSTMENT_0_POINT = X, Y, Z  ; 坐标
SPEED_ADJUSTMENT_0_RADIUS = 20, 60  ; 完全生效的半径和调整开始的半径（米）

; 火车还可以为其他条件创建新输入，非常适合附加音频或灯光：
SPEED_CONDITION_INPUT = MyNewInput_TrainSpeed
PROGRESS_CONDITION_INPUT = MyNewCondition_TrainProgress
```

¹ 该网格用于生成路径，应该是类似长条窄带的东西（可以隐藏）。它可以是闭合的或开放的，火车会根据法线方向倾斜。

² `PROGRESS` 用于将行进链接到某个条件。这样可以将它绑定到一天中的时间、太阳角度等。不确定这对火车是否有帮助，但可能有其他东西沿着特定路径行进？

### 使用火车的几个技巧（来自 @John514）

- 在 Y 轴上对齐火车；
- 1 号车厢必须在底部（朝向 Y'）；
- 移动对象需要在 X 轴上旋转 90°。

## 条件动画（Conditional animation）

如果设置了 `POSITION`、`ROTATION` 或 `SCALE` 中的任何一个，则会选择此模式。这里的位置、缩放和旋转角度都可以使用赛道条件或表达式来设置。

```ini
[ANIMATED_...]
NODE = something_moving
POSITION = X, Y, Z
SCALE = X, Y, Z
ROTATION = X
SPIN_AXIS = 0, 1, 0
```

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Animated-objects) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
