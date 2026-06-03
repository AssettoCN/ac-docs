---
title: 仪表输入
---

# 仪表输入（Instruments Inputs）

从 **v0.1.25-preview183** 开始，创建了一种更好的设置仪表的方式。其想法是拥有一个单一的输入列表，可用于数字和模拟仪表（包括条件文本）、动画甚至发光（带有可选的切换阈值和切换到模拟模式的可能性）。

旧版扩展仪表的现有代码被重写以避免三个独立的系统运行，但我尝试保持兼容性。不过，如果你注意到任何问题，请告诉我。

## 语法

为了保持兼容性，选择输入的方式可能因不同情况而异。例如：

注意："..." 代表 INPUT 类型

```ini
; 模拟仪表
; 新方法：
[ANALOG_INDICATOR_...]
INPUT = AMBIENT_TEMP

; 旧式方法（仅适用于小时、分钟和秒以保持时钟工作）：
[HOUR_INDICATOR]
...

; 数字仪表
; 通过 digital_instruments.ini 设置的方式
[ITEM_0]
TYPE_EXT = DRIFT_POINTS

; 旧式方法（适用于任何输入）：
[DI_DRIFT_POINTS]
DIGITAL_ITEM = 0

; 数字仪表（条件）
; 通过 digital_instruments.ini 设置的方式
[ITEM_0]
TYPE_EXT = CONDITION_TEXT
INPUT = TURBO_WASTEGATE

; 自定义动画
; 新方法
[ANIMATION_...]
INPUT = LOWBEAM

; 旧式方法（适用于任何输入）：
[ANIMATION_...]
BIND_TO_EXTRA_A = 1

; 发光
; 新方法
[EMISSIVE_...]
INPUT = BODY_DAMAGE

; 旧式方法（适用于任何输入）：
[EMISSIVE_LIGHT]
...
```

## 输入参数

对于所有这些输入类型，如你所见，你有一个定义事物的章节。你可以以几乎任何你可能需要的方式在那里配置输入。

```ini
[ANIMATION_...]
INPUT = TYRE_PRESSURE
INPUT_SELECTOR = THIRD

INPUT_ADD = 0.0
INPUT_MULT = 1.0
INPUT_MIN = 10.0
INPUT_MAX = 40.0
INPUT_MOD = 5.0
INPUT_LUT = (| 0=0 | 10=20 |)

INPUT_LAG_UP = 0.9
INPUT_LAG_DOWN = 0.95

INPUT_ROUND = 2.0
INPUT_ROUND_MODE = FLOORING

INPUT_STALLED_VALUE = 7.5
INPUT_STALLED_LAG = 0.85

[EMISSIVE_...]
INPUT = BODY_DAMAGE
INPUT_THRESHOLD = 20
INPUT_THRESHOLD_INVERSE = 1
INPUT_DEBUG = 30
```

参数说明：

- `INPUT`：定义输入类型，但在某些情况下，定义类型的方式可能不同。请参阅 "语法" 部分了解更多详情。
- `INPUT_SELECTOR`：设置如何处理多个值（例如，轮胎压力和车身损坏都有四个值，分别对应每个车轮和每个侧面）。可能的值：
  - `MIN`（别名：`MINIMUM`）：取最小值；
  - `MAX`（别名：`MAXIMUM`）：取最大值；
  - `SUM`（别名：`TOTAL`）：将值相加；
  - `MULT`（别名：`MULTIPLIED`）：将值相乘；
  - `AVG`（别名：`AVERAGE`）：将值相加并除以值的数量；
  - `LEN`（别名：`LENGTH`）：计算平方和的平方根（例如，用于计算总 G 力）；
  - `X`（别名：`FIRST`）：获取系列中的第一个值；
  - `Y`（别名：`SECOND`）：获取系列中的第二个值；
  - `Z`（别名：`THIRD`）：获取系列中的第三个值；
  - `W`（别名：`FOURTH`）：获取系列中的第四个值；
  - 任何数字 `N`：获取第 N 个值。
- `INPUT_MULT`：将值乘以 X；
- `INPUT_ADD`：将 X 加到值上；
- `INPUT_MIN`、`INPUT_MAX`：如果设置了这些值中的任何一个，原始数字将被限制在这些边界内，默认值为 —∞/+∞；
- `INPUT_MOD`：如果大于零，将取除以该值的模，在通过查找表之前（但在通过最小/最大检查之后）；
- `INPUT_LUT`：可选的查找表，允许设置缩放或偏移以及更复杂的内容，使用线性插值；
- `INPUT_LAG_UP`、`INPUT_LAG_DOWN`：可选的平滑变化值，在 LUT 之后应用。第一个在实际数字高于平滑数字时使用，第二个在原始数字小于平滑数字时使用；
- `INPUT_ROUND`：可选的舍入到该数字（例如，如果你想要小数点后一位，使用 `INPUT_ROUND = 0.1`）；
- `INPUT_ROUND_MODE`：舍入模式，可以是：
  - `FLOOR`（别名：`FLOORING`）：丢弃舍入部分；
  - `ROUND`（别名：`ROUNDING`）：常规规则，如果舍入部分等于或大于 `INPUT_ROUND` 的一半，则进入下一步；
  - `CEIL`（别名：`CEILING`）：如果有任何需要舍入的部分，总是进入下一步；
- `INPUT_STALLED_VALUE`：引擎熄火时原始数字的可选替换，在最小/最大检查之后但在可选的模除法和 LUT 之前运行；
- `INPUT_STALLED_LAG`：如果设置了强制熄火值，此数字将定义过渡的平滑度；
- `INPUT_THRESHOLD`：发光在其默认模式下可以是开或关，此选项设置该切换的阈值；
  如果你需要指定范围，使用：
  - `INPUT_THRESHOLD_LOWER` 和 `INPUT_THRESHOLD_UPPER`：工作方式为 A < x < B，排除 A 和 B；
  - `INPUT_THRESHOLD_LOWER_INC` 和 `INPUT_THRESHOLD_UPPER_INC`：工作方式为 A ≤ x ≤ B，包括 A 和 B；
- `INPUT_THRESHOLD_INVERSE`：如果设为 `0`（假），当值低于阈值时发光将开启；
- `INPUT_DEBUG`：测试东西的简单方法，特别是对于模拟仪表——它用其他东西替换原始值（基本上通过覆盖最小/最大值，因为它们是首先应用的）。

在大多数情况下，你不需要设置这些值，补丁有一些默认值，但在某些情况下可能很有用。

## 可用输入

标记为 "flag" 的输入返回 1.0 或 0.0，取决于条件（可以通过延迟设置进行平滑）。

- `SPEED`：当前相对于世界的速度，km/h；
- `SPEED_WHEELS`：基于驱动轮角速度的当前速度，km/h；
- `VELOCITY`：当前相对于世界的速度，3D 向量，m/s；
- `VELOCITY_LOCAL`：当前相对于车辆的速度（X 为左/右，Y 为上/下），3D 向量，m/s；
- `RPM`：引擎 RPM；
- `STEER`：方向盘旋转，度；
- `HANDBRAKE`：手刹状态，从 0 到 1；
- `GAS`：油门踏板状态，从 0 到 1；
- `BRAKE`：刹车踏板状态，从 0 到 1；
- `CLUTCH`：离合器踏板状态，从 0 到 1；
- `FUEL`：剩余燃油，升；
- `WATER_TEMPERATURE`（别名：`WATER_TEMP`）：水温，°C；
- `TURBO`：涡轮增压；
- `GEAR`：当前挡位，-1 为倒挡，0 为空挡（在顺序变速箱换挡时不经过空挡），默认格式为 `GEAR`（见下方 "格式" 部分）；
- `PERF_METER`：性能计比较此圈与最佳圈，秒；
- `PERF_METER_DIFF`：在 AC 性能应用中，有那个红/绿条，它显示这个值；
- `TYRE_WEAR`：轮胎磨损，四个值，从 0 到 1：
  - 左前：`INPUT_SELECTOR = 0`、`X` 或 `FIRST`；
  - 右前：`INPUT_SELECTOR = 1`、`Y` 或 `SECOND`；
  - 左后：`INPUT_SELECTOR = 2`、`Z` 或 `THIRD`；
  - 右后：`INPUT_SELECTOR = 3`、`W` 或 `FOURTH`；
- `TYRE_VIRTUAL_KM`：轮胎行驶距离，四个值，从 0 到 1；
- `TYRE_DIRT`：轮胎污垢级别，四个值，从 0 到 1；
- `TYRE_SLIP`：轮胎滑移值，四个值；
- `TYRE_SLIP_ANGLE`：轮胎滑移角，四个值；
- `TYRE_SLIP_RATIO`：轮胎滑移比，四个值；
- `ENGINE_LIFE`（别名：`ENGINE_DAMAGE`）：剩余引擎寿命点，从 0.0 到 1000.0（别名默认反转阈值）；
- `SUSP_DAMAGE`：悬挂损坏，四个值，从 0 到 1；
- `GEARBOX_DAMAGE`：变速箱损坏，从 0 到 1；
- `BODY_DAMAGE`：给定侧面的最大碰撞速度，四个值，km/h：
  - 前部：`INPUT_SELECTOR = 0`、`X` 或 `FIRST`；
  - 后部：`INPUT_SELECTOR = 1`、`Y` 或 `SECOND`；
  - 左侧：`INPUT_SELECTOR = 2`、`Z` 或 `THIRD`；
  - 右侧：`INPUT_SELECTOR = 3`、`W` 或 `FOURTH`；
- `SUSP_TRAVEL`：悬挂行程，四个值，米；
- `RIDE_HEIGHT`：离地间隙，四个值，米；
- `BLIND_SPOT`：盲点检测，四个值；
- `SLIP_RATIO`：车轮滑移比，四个值；
- `G_FORCE`：当前 G 力，3D 向量，G；
  - 横向：`INPUT_SELECTOR = 0`、`X` 或 `FIRST`；
  - 垂直：`INPUT_SELECTOR = 1`、`Y` 或 `SECOND`；
  - 纵向：`INPUT_SELECTOR = 2`、`Z` 或 `THIRD`；
- `GEAR_GRINDING`（flag）：齿轮是否在研磨？
- `LAP_TIME`：圈时间，秒；
- `LAP_TIME_BEST`：最佳圈时间，秒；
- `LAP_TIME_LAST`：最后一圈时间，秒；
- `LAP_COUNT`：完成的圈数；
- `HORN`（flag）：喇叭是否激活？
- `POSITION`：车辆排行榜位置

### 发光设置相关

- `LIGHT`（别名：`HEADLIGHTS`，flag）：前大灯是否开启？
- `LIGHT_SUGGESTION`：AI 前大灯建议值；
- `BRAKE`（别名：`BRAKE_LIGHTS`，flag）：刹车灯是否开启？
- `REVERSE`（别名：`REVERSE_LIGHTS`，flag）：倒车灯是否开启？
- `HAZARD`（flag）：危险灯是否开启（默认发光带闪烁）？
- `LOWBEAM`（flag）：近光灯是否开启？
- `HIGHBEAM`（flag）：远光灯是否开启？
- `EXTRA_A`（flag）：Extra A 是否开启？
- `EXTRA_B`（flag）：Extra B 是否开启？
- `EXTRA_C`（flag）：Extra C 是否开启？
- `EXTRA_D`（flag）：Extra D 是否开启？
- `EXTRA_E`（flag）：Extra E 是否开启？
- `EXTRA_F`（flag）：Extra F 是否开启？
- `EXTRA_G`（flag）：Extra G 是否开启？
- `EXTRA_H`（flag）：Extra H 是否开启？
- `EXTRA_I`（flag）：Extra I 是否开启？
- `EXTRA_J`（flag）：Extra J 是否开启？
- `EXTRA_K`（flag）：Extra K 是否开启？
- `EXTRA_L`（flag）：Extra L 是否开启？
- `EXTRA_M`（flag）：Extra M 是否开启？
- `EXTRA_N`（flag）：Extra N 是否开启？
- `EXTRA_O`（flag）：Extra O 是否开启？
- `EXTRA_P`（flag）：Extra P 是否开启？
- `EXTRA_Q`（flag）：Extra Q 是否开启？
- `EXTRA_R`（flag）：Extra R 是否开启？
- `EXTRA_S`（flag）：Extra S 是否开启？
- `EXTRA_T`（flag）：Extra T 是否开启？
- `DRL`（flag）：日间行车灯是否开启？
- `TURNSIGNAL_LEFT`（flag）：左转向灯是否开启？
- `TURNSIGNAL_RIGHT`（flag）：右转向灯是否开启？
- `TURNSIGNAL_NOHAZARD_LEFT`（flag）：左转向灯是否开启（但不是因为危险灯）？
- `TURNSIGNAL_NOHAZARD_RIGHT`（flag）：右转向灯是否开启（但不是因为危险灯）？
- `TURNSIGNAL`（flag）：任何转向灯是否开启？
- `TURNSIGNAL_NOHAZARD`（flag）：任何转向灯是否开启（但不是因为危险灯）？
- `CORNERINGLAMP_LEFT`（flag）：左弯道灯是否开启？
- `CORNERINGLAMP_RIGHT`（flag）：右弯道灯是否开启？
- `OPENDOORS`（flag）：车门是否打开？
- `SEATBELT`（flag）：安全带是否系好？

### 独立齿轮（兼容性和以防万一）

- `GEAR_R`（flag）：倒挡是否开启？
- `GEAR_N`（flag）：空挡是否开启？
- `GEAR_D`（flag）：前进挡是否开启？
- `GEAR_1`（flag）：一挡是否开启？
- `GEAR_2`（flag）：二挡是否开启？
- `GEAR_3`（flag）：三挡是否开启？
- `GEAR_4`（flag）：四挡是否开启？
- `GEAR_5`（flag）：五挡是否开启？
- `GEAR_6`（flag）：六挡是否开启？
- `GEAR_7`（flag）：七挡是否开启？
- `GEAR_8`（flag）：八挡是否开启？
- `GEAR_9`（flag）：九挡是否开启？

### 额外物理内容（目前回放中不工作）

- `BRAKEBIAS`：刹车偏置，从 0.0 到 1.0；
- `ABS`（flag）：ABS 是否开启或关闭？
- `ABS_INACTION`（flag）：ABS 当前是否激活（默认发光带闪烁）？
- `SPEEDLIMITER`：速度限制器，0 为禁用，km/h；
- `SPEEDLIMITER_INACTION`（flag）：速度限制器当前是否正在阻止车辆（默认发光带闪烁）？
- `TYRE_COMPOUND_INDEX`：当前轮胎组的索引；
- `DIFF_PRELOAD`：差速器预载值；
- `TRACTIONCONTROL`（别名：`TC`）：牵引力控制模式，整数；
- `TRACTIONCONTROL_INACTION`（别名：`TC_INACTION`，flag）：牵引力控制现在是否工作（默认发光带闪烁）？
- `AWD_FRONT_SHARE_PERC`：当前施加到前轴的扭矩比例，从 0 到 1；
- `AWD_FRONT_SHARE_NM`：当前施加到前轴的扭矩，N×m；
- `TYRE_PRESSURE`（别名：`TYRES`）：轮胎压力，四个值；
- `TYRE_TEMPERATURE`：轮胎温度，四个值；
- `ENGINE_TORQUE`：当前引擎扭矩，Nm；
- `ENGINE_POWER`：当前引擎功率，bhp；
- `KERS_CHARGE`：KERS 充电量；
- `KERS_CURRENT_KJ`：KERS 电流；
- `KERS_MAX_KJ`：最大 KERS 电流；
- `KERS_LOAD`：KERS 负载；
- `KERS_INPUT`：KERS 输入；
- `KERS_CHARGING`（flag）：KERS 是否在充电？
- `TURBO_BOOST`：涡轮增压（对于[带有 `EXT_SPIN_DELAY` 的扩展涡轮](../physics/powertrain)可以为负），每个涡轮都有值（允许设置绑定到特定涡轮的指针）；
- `TURBO_WASTEGATE`：当前涡轮废气旁通阀，每个涡轮都有值（允许设置绑定到特定涡轮的指针）；
- `AUTO_SHIFTING`（flag）：自动换挡是否激活？
- `MANUAL_SPEED_LIMITER`（flag）：手动速度限制器（外部强制）是否激活？

### 扩展物理

- `USER_SPEEDLIMITER`（flag）：用户速度限制器（通过 electronics.ini 中的自定义物理设置）是否激活？
- `ENGINE_MAP`：当前选择的引擎映射索引；
- `CPHYS_SCRIPT_0`：自定义物理 Lua 脚本设置的值 #0；
- `CPHYS_SCRIPT_1`：自定义物理 Lua 脚本设置的值 #1；
- `CPHYS_SCRIPT_2`：自定义物理 Lua 脚本设置的值 #2；
- `CPHYS_SCRIPT_3`：自定义物理 Lua 脚本设置的值 #3；
- `CPHYS_SCRIPT_4`：自定义物理 Lua 脚本设置的值 #4；
- `CPHYS_SCRIPT_5`：自定义物理 Lua 脚本设置的值 #5；
- `CPHYS_SCRIPT_6`：自定义物理 Lua 脚本设置的值 #6；
- `CPHYS_SCRIPT_7`：自定义物理 Lua 脚本设置的值 #7；
- `TC2`；
- `FUELMAP`；

### 补丁添加的额外数字

- `DRIVEN_TOTAL`：总里程表，值以 km 为单位（初始值从里程表应用或 Sidekick 加载，或从 CM 传递）；
- `DRIVEN_SESSION`：当前会话内的里程表，值以 km 为单位；
- `STALLED`（flag）：引擎是否熄火（目前，这意味着低 RPM 持续一段时间）？
- `BATTERY`：估算的电池电压；
- `OIL_PRESSURE`（别名：`OIL`）：估算的油压；
- `OIL_TEMPERATURE`（别名：`OIL_TEMP`）：估算的油温；
- `EXHAUST_TEMPERATURE`（别名：`EXHAUST_TEMP`）：估算的排气温度；

### 雨刷

- `WIPERS_MODE`：雨刷关闭时为 0，否则为当前模式；
- `WIPERS_PROGRESS`：雨刷动画的进度；

### 一些罕见情况的额外内容（可能用于某些显示器？）

- `DRIFT_VALID`（flag）：当前漂移是否有效（例如，不在越野时）？
- `DRIFT_BONUS_ON`（flag）：漂移连击奖励是否开启？
- `DRIFT_COMBO`：漂移连击计数器，整数；
- `DRIFT_INSTANT`：当前漂移点数，整数；
- `DRIFT_POINTS`：总漂移点数，整数；
- `TRACK_PROGRESS`：赛道进度，从 0 到 1；
- `COMPASS`：车辆方向，度，0° 为北，90° 为东，默认格式为 `COMPASS`；

### 燃油消耗相关（WIP，公式可能会重新调整）

- `FUEL_BURNT`：本次会话燃烧的燃油，升；
- `FUEL_BURNT_TOTAL`：总共燃烧的燃油，升；
- `FUEL_CONSUMPTION_KPL`：燃油消耗，公里/升，本次会话的平均值；
- `FUEL_CONSUMPTION_LP100K`：燃油消耗，升/100 公里，本次会话的平均值；
- `FUEL_CONSUMPTION_MPG`：燃油消耗，英里/加仑，本次会话的平均值；
- `FUEL_CONSUMPTION_LPL`：燃油消耗，升/圈，本次会话的平均值；
- `FUEL_CONSUMPTION_KPL_TOTAL`：燃油消耗，公里/升，总平均值；
- `FUEL_CONSUMPTION_LP100K_TOTAL`：燃油消耗，升/100 公里，总平均值；
- `FUEL_CONSUMPTION_MPG_TOTAL`：燃油消耗，英里/加仑，总平均值；
- `FUEL_CONSUMPTION_LPL_TOTAL`：燃油消耗，升/圈，总平均值；
- `FUEL_ESTIMATE_DISTANCE`：估算距离，米，基于本次会话平均消耗；
- `FUEL_ESTIMATE_DISTANCE_TOTAL`：估算距离，米，基于总平均消耗；
- `FUEL_ESTIMATE_TIME`：估算时间，秒，基于本次会话平均消耗；
- `FUEL_ESTIMATE_TIME_TOTAL`：估算时间，秒，基于总平均消耗；
- `FUEL_ESTIMATE_LAPS`：估算距离，圈，基于本次会话平均消耗；
- `FUEL_ESTIMATE_LAPS_TOTAL`：估算距离，圈，基于总平均消耗；

### 赛事相关

- `POSITION`：比赛中的位置，从 1 开始；
- `LAP_TIME`：当前圈时间，秒，此输入和其他时间的默认格式为 "LAP_TIME"；
- `BEST_LAP_TIME`：最佳圈时间，秒；
- `LAST_LAP_TIME`：最后一圈时间，秒；
- `EXPECTED_LAP_TIME`：预期圈时间，秒（基于最佳圈时间和性能差值）；
- `LAPS_COUNT`：已完成的圈数；
- `FLAG_TYPE`：当前显示的赛事旗帜类型（与赛道条件中的完全相同）；

### 与车辆无关

- `ONE`：常量值 1.0；
- `ZERO`：常量值 0.0；
- `FPS`：当前每秒帧数；
- `FRAME_TIME_MS`：当前帧时间，毫秒；
- `AMBIENT_TEMPERATURE`（别名：`AMBIENT_TEMP`）：环境（空气）温度，°C；
- `ROAD_TEMPERATURE`（别名：`ROAD_TEMP`）：路面温度，°C；
- `WIND_SPEED`：风速，km/h；
- `WIND_VELOCITY`：世界空间中的风向向量，3D 向量，m/s；
- `WIND_DIR`：风向，度，默认格式为 `COMPASS`；
- `TIME`：从 00:00 开始的秒数，默认格式为 `TIME`；
- `DATE`：当前日期作为时间戳，默认格式为 `DATE`；
- `TIME_HOURS`：小时数，默认 `INPUT_MOD = 24`；
- `TIME_MINUTES`：分钟数，默认 `INPUT_MOD = 60`；
- `TIME_SECONDS`：秒数，默认 `INPUT_MOD = 60`。

## 格式

要正确使用某些类型的输入（如返回圈时间的输入）用于数字显示，需要进行一些格式化。这些类型通常默认设置了格式，但你可以覆盖该行为，或使常规输入格式化。更多信息请参阅[数字仪表](./digital-instruments)。

## 更复杂的表达式

从 CSP 0.1.77 开始，输入可以引用其他输入并使用表达式。首先，要引用另一个输入，你可以创建新的共享输入：

```ini
[SHARED_INPUT_...]
NAME = my_input  ; 用于引用它的名称
INPUT = GAS
; 所有常规 INPUT 参数都可用
```

稍后使用它，或仅使用复杂表达式：

```ini
[EMISSIVE_...]
INPUT = 'calc:max(my_input * GAS, BRAKE)'
```

当然，共享输入也可以引用其他共享输入：

```ini
[SHARED_INPUT_...]
NAME = my_other_input
INPUT = 'calc:pow(my_input, 20) + WIND_SPEED'
```

### 可用函数

- 无参数（常量）：
  - `e`：欧拉数；
  - `pi`：圆周率。
- 一个参数：
  - `abs(x)`：返回 `x` 的绝对值；
  - `acos(x)`：返回弧度角；
  - `asin(x)`：返回弧度角；
  - `atan(x)`：返回弧度角；
  - `ceil(x)`：向上取整；
  - `cos(x)`：接受弧度角；
  - `cosh(x)`：接受弧度角；
  - `exp(x)`：返回 `e^x`；
  - `floor(x)`：向下取整；
  - `ln(x)`：自然对数；
  - `log(x)`：以 10 为底的对数；
  - `log10(x)`：以 10 为底的对数；
  - `saturate(x)`：如果 `x` 在 0 和 1 之间返回 `x`，否则返回 0 或 1，取更接近的；
  - `sign(x)`：返回 `x` 的符号，除非为 0，则返回 0；
  - `sin(x)`：接受弧度角；
  - `sinh(x)`：接受弧度角；
  - `smoothstep(x)`：smoothstep 适用于渐变；
  - `smootherstep(x)`：类似于 smoothstep，但更平滑；
  - `sqrt(x)`：返回平方根；
  - `tan(x)`：接受弧度角；
  - `tanh(x)`：接受弧度角。
- 两个参数：
  - `atan2(x, y)`：将 `x` 和 `y` 转换为弧度角；
  - `max(x, y)`：返回 `x` 和 `y` 中最大的；
  - `min(x, y)`：返回 `x` 和 `y` 中最小的；
  - `pow(x, y)`：将 `x` 的 `y` 次方；
  - `step(x, y)`：如果 `y` 大于或等于 `x`，返回 1，否则返回 0。
- 更多参数：
  - `clamp(x, min, max)`：如果 `x` 在 `min` 和 `max` 之间返回 `x`，否则返回 `min` 或 `max`，取更接近的；
  - `remap(x, a, b, c, d)`：如果 `x` 等于 `a`，返回 `c`，如果是 `b`，返回 `d`，否则在 `c` 和 `d` 之间线性插值（不进行钳制）。

相关内容：[模拟仪表](./analog-instruments)、[数字仪表](./digital-instruments)、[LED 面板](./led-panels)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Instruments-inputs) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
