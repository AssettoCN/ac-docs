---
title: 模拟仪表
---


> 汉化标题：车辆 – 模拟仪表  
> 原文页面：Cars-–-Analog-instruments  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

可以通过扩展配置设置新的模拟仪表，数量不限，并支持多种自定义。支持[该列表](https://github.com/car/instruments/inputs)中的任何输入。

### 语法

```ini
[ANALOG_INDICATOR_...]
INPUT = TIME_HOURS               ; 支持的输入中的任意一个
NAME = ARROW_TIME_HOURS          ; 要移动的网格名称
UPPER_BOUND = 24                 ; 指针移动所对应的最大输入值
LOWER_BOUND = 0                  ; 最小输入值
START = -180                     ; 起点偏移，度
RANGE = 360                      ; 输入到达上限时指针转过的完整角度范围，度
POS_OFFSET_START = 0, -0.1, 0.1  ; 最小值处的位置偏移
POS_OFFSET_END = 0, -0.1, 0.1    ; 上限值处的位置偏移
SCALE_START = 0, 1, 1            ; 最小值处的缩放
SCALE_END = 1, 1, 1              ; 上限值处的缩放（可用于制作进度条等）
SPEED_LAG = 0.2                  ; 速度滞后，为运动添加惯性
G_FACTOR = 0.1, 0, 0             ; 按对应轴为指针添加一点绑定到 G 力的偏移
LUT = (| 60=-1| 90=-62 |)        ; 可选，将输入值映射为角度
```

如有需要，也可以使用原版风格的参数（仅当未设置 `UPPER_BOUND` 时可用）：

```ini
[ANALOG_INDICATOR_...]
INPUT = RPM
INPUT_MAX = 8200
NAME = ARROW_RPM
ZERO = 1
STEP = 0.033375
```

与原版 AC 风格一样，LUT 也可以按预期工作，用于设置角度：

```ini
[ANALOG_INDICATOR_...]
INPUT = WATER_TEMP ; 温度：此处角度由 LUT 设置，与原版相同
NAME = ARROW_WATER
MIN_VALUE = 60
```

请记住，新输入系统还有许多其他选项，如 `INPUT_MIN`、`INPUT_MAX`、`INPUT_MOD` 和 `INPUT_STALLED_VALUE`，可让指针动得更精确。

### 技巧

- 使用 `INPUT_DEBUG` 确保输入值正确映射到表盘；
- 借助 `POS_OFFSET_START` 和 `POS_OFFSET_END`，可以修正指针位置，或为其添加移动效果，甚至完全用移动代替旋转；
- 如果不希望指针转过 360° 后回到 0°，可将 `RANGE` 设为 359.99；
- 使用新系统，无需真正借助[复古转速表](https://github.com/car/instruments/vintage-tachometers)功能即可将其复刻出来。

