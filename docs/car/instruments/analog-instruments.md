---
title: 模拟仪表
---

# 模拟仪表（Analog Instruments）

你可以使用扩展配置设置新的模拟仪表，数量不限，具有各种自定义选项。支持[输入列表](./inputs)中的任何输入。

## 语法

```ini
[ANALOG_INDICATOR_...]
INPUT = TIME_HOURS               ; 任何支持的输入
NAME = ARROW_TIME_HOURS          ; 要移动的网格名称
UPPER_BOUND = 24                 ; 指针移动的最大输入值
LOWER_BOUND = 0                  ; 最小输入值
START = -180                     ; 起始点偏移，度
RANGE = 360                      ; 在上限值时指针移动的完整范围，度
POS_OFFSET_START = 0, -0.1, 0.1  ; 最小值的位置偏移
POS_OFFSET_END = 0, -0.1, 0.1    ; 上限值的位置偏移
SCALE_START = 0, 1, 1            ; 最小值的缩放
SCALE_END = 1, 1, 1              ; 上限值的缩放（允许创建进度条等）
SPEED_LAG = 0.2                  ; 速度延迟，添加运动惯性
G_FACTOR = 0.1, 0, 0             ; 为这些轴的 G 力添加一点指针偏移
LUT = (| 60=-1| 90=-62 |)        ; 可选地将输入值映射到度数
```

如果需要，你也可以使用原始风格参数（仅在未设置 `UPPER_BOUND` 时可用）：

```ini
[ANALOG_INDICATOR_...]
INPUT = RPM
INPUT_MAX = 8200
NAME = ARROW_RPM
ZERO = 1
STEP = 0.033375
```

LUT 与原始 AC 风格一样，也可以按预期工作，允许设置度数：

```ini
[ANALOG_INDICATOR_...]
INPUT = WATER_TEMP ; 温度：这里，角度使用 LUT 设置，如原始方式
NAME = ARROW_WATER
MIN_VALUE = 60
```

请记住，新的输入系统还有很多其他选项，如 `INPUT_MIN`、`INPUT_MAX`、`INPUT_MOD` 和 `INPUT_STALLED_VALUE`，可以使指针更准确地移动。

## 技巧

- 使用 `INPUT_DEBUG` 确保输入值正确映射到表盘；
- 使用 `POS_OFFSET_START` 和 `POS_OFFSET_END`，你可以修正指针的定位，或添加移动。甚至可以用纯移动替代旋转；
- 如果你希望指针停止在 360° 回到 0°，将 `RANGE` 设为 359.99；
- 使用新系统，你可以完全重新创建老式转速表，而无需实际使用该功能。

更多输入类型请参考[仪表输入](./inputs)，数字显示请参考[数字仪表](./digital-instruments)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Analog-instruments) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
