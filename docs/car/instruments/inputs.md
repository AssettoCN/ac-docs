---
title: 仪表输入
---


> 汉化标题：车辆 – 仪表输入  
> 原文页面：Cars-–-Instruments-inputs  
> 原文锚点：c74f7dc  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：输入名（如 GAS、RPM）及其别名均保留原文；「flag」指根据条件返回 1.0 或 0.0 的开关型输入；文中 lag 译作「滞后/平滑」  

在 **v0.1.25-preview183** 中，引入了一种更好的仪表设置方式。其思路是提供一份统一的输入列表，供数字和模拟仪表（包括条件文本）、动画乃至发光物体使用（发光物体可选设置切换阈值，也可以切换为模拟模式）。

为避免三套独立系统同时运行，旧的扩展仪表代码已被重写，但我尽量保持了兼容性。如果发现任何东西出问题，请告诉我。

### 语法

为了保持兼容性，选择输入的方式在不同场景下可能有所不同。例如：

注意："..." 代表 INPUT 类型
```ini
; 模拟仪表
; 新方法：
[ANALOG_INDICATOR_...]
INPUT = AMBIENT_TEMP

; 旧式方法（仅对小时、分钟和秒有效，以保持时钟正常工作）：
[HOUR_INDICATOR]
...

; 数字仪表
; 通过 digital_instruments.ini 设置的方法
[ITEM_0]
TYPE_EXT = DRIFT_POINTS

; 旧式方法（适用于任何输入）：
[DI_DRIFT_POINTS]
DIGITAL_ITEM = 0

; 数字仪表（条件）
; 通过 digital_instruments.ini 设置的方法
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

; 发光物体
; 新方法
[EMISSIVE_...]
INPUT = BODY_DAMAGE

; 旧式方法（适用于任何输入）：
[EMISSIVE_LIGHT]
...

...
```

### 输入参数

如你所见，对于所有这些类型的输入，都会有一个节来定义它。在这里，你几乎可以按任何需要的方式配置输入。

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

- `INPUT`：定义输入的类型，但在某些情况下，定义类型的方式可能有所不同。详见「语法」一节。
- `INPUT_SELECTOR`：设置多个数值的取用方式（例如，胎压和车身损伤各有四个数值，分别对应每个车轮或每一侧）。可选值：
  - `MIN`（别名：`MINIMUM`）：取最小值；
  - `MAX`（别名：`MAXIMUM`）：取最大值；
  - `SUM`（别名：`TOTAL`）：将数值相加；
  - `MULT`（别名：`MULTIPLIED`）：将数值相乘；
  - `AVG`（别名：`AVERAGE`）：求和后除以数值个数；
  - `LEN`（别名：`LENGTH`）：计算平方和的平方根（例如用于求总 G 力）；
  - `X`（别名：`FIRST`）：取序列中的第一个值；
  - `Y`（别名：`SECOND`）：取序列中的第二个值；
  - `Z`（别名：`THIRD`）：取序列中的第三个值；
  - `W`（别名：`FOURTH`）：取序列中的第四个值；
  - 任意数字 `N`：取第 N 个值。
- `INPUT_MULT`：将数值乘以 X；
- `INPUT_ADD`：将数值加上 X；
- `INPUT_MIN`、`INPUT_MAX`：若设置了其中任何一个，原始数值将被限制在该范围内，默认值为 —∞/+∞；
- `INPUT_MOD`：若大于零，则在经过查找表之前（但在经过最小/最大值检查之后），取除以该值所得的余数；
- `INPUT_LUT`：可选的查找表，可用于设置缩放或偏移之类，也可用于更复杂的映射，采用线性插值；
- `INPUT_LAG_UP`、`INPUT_LAG_DOWN`：可选的数值变化平滑，在 LUT 之后应用。前者用于实际数值高于平滑值时，后者用于原始数值低于平滑值时；
- `INPUT_ROUND`：可选，舍入到该数值（例如，若想保留小数点后一位，可使用 `INPUT_ROUND = 0.1`）；
- `INPUT_ROUND_MODE`：舍入模式，可以是：
  - `FLOOR`（别名：`FLOORING`）：直接舍弃舍入部分；
  - `ROUND`（别名：`ROUNDING`）：常规规则，舍入部分大于或等于 `INPUT_ROUND` 的一半时进到下一档；
  - `CEIL`（别名：`CEILING`）：只要存在待舍入的部分，总是进到下一档；
- `INPUT_STALLED_VALUE`：可选，发动机熄火时用于替代原始数值的值，在最小/最大值检查之后、可选的取模和 LUT 之前应用；
- `INPUT_STALLED_LAG`：若设置了强制熄火值，该数值定义过渡的平滑程度；
- `INPUT_THRESHOLD`：默认模式下的发光物体只有开和关两种状态，该选项用于设置切换的阈值；  
  如果需要改为指定范围，可使用：
  - `INPUT_THRESHOLD_LOWER` 和 `INPUT_THRESHOLD_UPPER`：按 A < x < B 判断，不含 A 和 B；
  - `INPUT_THRESHOLD_LOWER_INC` 和 `INPUT_THRESHOLD_UPPER_INC`：按 A ≤ x ≤ B 判断，包含 A 和 B；
- `INPUT_THRESHOLD_INVERSE`：设为 `0`（即为 false）时，数值低于阈值发光物体即点亮；
- `INPUT_DEBUG`：测试的简便方法，尤其适用于模拟仪表——它用其他值替换原始数值（基本上是通过最先覆盖最小/最大值实现的）。

大多数情况下无需设置这些值，补丁已有一些默认值，但在某些场景下可能会有用。

### 可用输入

标有「flag」的输入会根据条件返回 1.0 或 0.0（可通过滞后设置进行平滑）。

- `SPEED`：当前相对于世界的速度，km/h；
- `SPEED_WHEELS`：基于驱动轮角速度计算的当前速度，km/h；
- `VELOCITY`：当前相对于世界的速度，3D 矢量，m/s；
- `VELOCITY_LOCAL`：相对于车辆的速度（X 为左/右，Y 为上/下），3D 矢量，m/s；
- `RPM`：发动机 RPM；
- `STEER`：方向盘转角，度；
- `HANDBRAKE`：手刹状态，0 到 1；
- `GAS`：油门踏板状态，0 到 1；
- `BRAKE`：刹车踏板状态，0 到 1；
- `CLUTCH`：离合器踏板状态，0 到 1；
- `FUEL`：剩余燃油，升；
- `WATER_TEMPERATURE`（别名：`WATER_TEMP`）：水温，°C；
- `TURBO`：涡轮增压值；
- `GEAR`：当前档位，倒档为 —1、空档为 0（序列式变速箱换挡时不经过空档），默认格式为 `GEAR`（见下文「格式」一节）；
- `PERF_METER`：将本圈与最佳圈对比的性能计，秒；
- `PERF_METER_DIFF`：AC 性能 App 中那个红/绿条显示的就是这个值；
- `TYRE_WEAR`：轮胎磨损，四个数值，0 到 1：
  - 左前：`INPUT_SELECTOR = 0`、`X` 或 `FIRST`；
  - 右前：`INPUT_SELECTOR = 1`、`Y` 或 `SECOND`；
  - 左后：`INPUT_SELECTOR = 2`、`Z` 或 `THIRD`；
  - 右后：`INPUT_SELECTOR = 3`、`W` 或 `FOURTH`；
- `TYRE_VIRTUAL_KM`：轮胎行驶距离，四个数值，0 到 1：
  - 左前：`INPUT_SELECTOR = 0`、`X` 或 `FIRST`；
  - 右前：`INPUT_SELECTOR = 1`、`Y` 或 `SECOND`；
  - 左后：`INPUT_SELECTOR = 2`、`Z` 或 `THIRD`；
  - 右后：`INPUT_SELECTOR = 3`、`W` 或 `FOURTH`；
- `TYRE_DIRT`：轮胎泥土程度，四个数值，0 到 1；
- `TYRE_SLIP`：轮胎滑移值，四个数值；
- `TYRE_SLIP_ANGLE`：轮胎滑移角，四个数值；
- `TYRE_SLIP_RATIO`：轮胎滑移率，四个数值；
- `ENGINE_LIFE`（别名：`ENGINE_DAMAGE`）：剩余发动机寿命点数，0.0 到 1000.0（别名默认反转阈值）；
- `SUSP_DAMAGE`：悬挂损伤，四个数值，0 到 1；
- `GEARBOX_DAMAGE`：变速箱损伤，0 到 1；
- `BODY_DAMAGE`：给定侧面的最大碰撞速度，四个数值，km/h：
  - 前：`INPUT_SELECTOR = 0`、`X` 或 `FIRST`；
  - 后：`INPUT_SELECTOR = 1`、`Y` 或 `SECOND`；
  - 左：`INPUT_SELECTOR = 2`、`Z` 或 `THIRD`；
  - 右：`INPUT_SELECTOR = 3`、`W` 或 `FOURTH`；
- `SUSP_TRAVEL`：悬挂行程，四个数值，米；
- `RIDE_HEIGHT`：离地间隙，四个数值，米；
- `BLIND_SPOT`：盲区检测，四个数值；
- `SLIP_RATIO`：车轮滑移率，四个数值；
- `G_FORCE`：当前 G 力，3D 矢量，G：
  - 横向：`INPUT_SELECTOR = 0`、`X` 或 `FIRST`；
  - 垂直：`INPUT_SELECTOR = 1`、`Y` 或 `SECOND`；
  - 纵向：`INPUT_SELECTOR = 2`、`Z` 或 `THIRD`；
- `GEAR_GRINDING`（flag）：齿轮是否打齿？
- `LAP_TIME`：圈速，秒；
- `LAP_TIME_BEST`：最佳圈速，秒；
- `LAP_TIME_LAST`：上一圈用时，秒；
- `LAP_COUNT`：已完成的圈数；
- `HORN`（flag）：喇叭是否正在鸣响？
- `POSITION`：车辆在排行榜中的位置

##### 来自发光物体集合

- `LIGHT`（别名：`HEADLIGHTS`，flag）：大灯是否开启？
- `LIGHT_SUGGESTION`：AI 大灯建议值；
- `BRAKE`（别名：`BRAKE_LIGHTS`，flag）：刹车灯是否点亮？
- `REVERSE`（别名：`REVERSE_LIGHTS`，flag）：倒车灯是否点亮？
- `HAZARD`（flag）：危险警示灯是否开启（默认为发光物体带闪烁效果）？
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
- `TURNSIGNAL_LEFT`（flag）：左转向灯是否点亮？
- `TURNSIGNAL_RIGHT`（flag）：右转向灯是否点亮？
- `TURNSIGNAL_NOHAZARD_LEFT`（flag）：左转向灯是否点亮（而非由危险警示灯引起）？
- `TURNSIGNAL_NOHAZARD_RIGHT`（flag）：右转向灯是否点亮（而非由危险警示灯引起）？
- `TURNSIGNAL`（flag）：是否有任意转向灯点亮？
- `TURNSIGNAL_NOHAZARD`（flag）：是否有任意转向灯点亮（而非由危险警示灯引起）？
- `CORNERINGLAMP_LEFT`（flag）：左转角灯是否点亮？
- `CORNERINGLAMP_RIGHT`（flag）：右转角灯是否点亮？
- `OPENDOORS`（flag）：车门是否打开？
- `SEATBELT`（flag）：安全带是否系好？

##### 为兼容及备用而单独提供的档位输入

- `GEAR_R`（flag）：是否处于倒档？
- `GEAR_N`（flag）：是否处于空档？
- `GEAR_D`（flag）：是否处于前进档？
- `GEAR_1`（flag）：是否处于 1 档？
- `GEAR_2`（flag）：是否处于 2 档？
- `GEAR_3`（flag）：是否处于 3 档？
- `GEAR_4`（flag）：是否处于 4 档？
- `GEAR_5`（flag）：是否处于 5 档？
- `GEAR_6`（flag）：是否处于 6 档？
- `GEAR_7`（flag）：是否处于 7 档？
- `GEAR_8`（flag）：是否处于 8 档？
- `GEAR_9`（flag）：是否处于 9 档？

##### 扩展物理附加项（目前回放中不可用）

- `BRAKEBIAS`：刹车平衡，0.0 到 1.0；
- `ABS`（flag）：ABS 是开还是关？
- `ABS_INACTION`（flag）：ABS 当前是否正在介入（默认为发光物体带闪烁效果）？
- `SPEEDLIMITER`：限速器，0 表示禁用，km/h；
- `SPEEDLIMITER_INACTION`（flag）：限速器当前是否正在限制车辆（默认为发光物体带闪烁效果）？
- `TYRE_COMPOUND_INDEX`：当前所选轮胎套装的索引；
- `DIFF_PRELOAD`：差速器锁紧 preload 值；
- `TRACTIONCONTROL`（别名：`TC`）：牵引力控制模式，整数；
- `TRACTIONCONTROL_INACTION`（别名：`TC_INACTION`，flag）：牵引力控制当前是否正在工作（默认为发光物体带闪烁效果）？
- `AWD_FRONT_SHARE_PERC`：当前分配到前轴的扭矩比例，0 到 1；
- `AWD_FRONT_SHARE_NM`：当前分配到前轴的扭矩，N×m；
- `TYRE_PRESSURE`（别名：`TYRES`）：胎压，四个数值；
- `TYRE_TEMPERATURE`：胎温，四个数值；
- `ENGINE_TORQUE`：当前发动机扭矩，Nm；
- `ENGINE_POWER`：当前发动机功率，bhp；
- `KERS_CHARGE`：KERS 电量；
- `KERS_CURRENT_KJ`：KERS 电流；
- `KERS_MAX_KJ`：KERS 最大电流；
- `KERS_LOAD`：KERS 负载；
- `KERS_INPUT`：KERS 输入；
- `KERS_CHARGING`（flag）：KERS 是否正在充电？
- `TURBO_BOOST`：涡轮增压值（对[带 `EXT_SPIN_DELAY` 的扩展涡轮](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Extra-turbo-options)可能为负值），每个涡轮各有一个数值（可用于设置绑定到特定涡轮的指针）；
- `TURBO_WASTEGATE`：当前涡轮泄压阀开度，每个涡轮各有一个数值（可用于设置绑定到特定涡轮的指针）；
- `AUTO_SHIFTING`（flag）：自动换挡是否激活？
- `MANUAL_SPEED_LIMITER`（flag）：手动限速器（外部强制）是否激活？

##### 扩展物理

- `USER_SPEEDLIMITER`（flag）：用户限速器（在 electronics.ini 中通过自定义物理设置）是否激活？
- `ENGINE_MAP`：当前所选发动机地图的索引；
- `CPHYS_SCRIPT_0`：由自定义物理 Lua 脚本设置的 #0 号值；
- `CPHYS_SCRIPT_1`：由自定义物理 Lua 脚本设置的 #1 号值；
- `CPHYS_SCRIPT_2`：由自定义物理 Lua 脚本设置的 #2 号值；
- `CPHYS_SCRIPT_3`：由自定义物理 Lua 脚本设置的 #3 号值；
- `CPHYS_SCRIPT_4`：由自定义物理 Lua 脚本设置的 #4 号值；
- `CPHYS_SCRIPT_5`：由自定义物理 Lua 脚本设置的 #5 号值；
- `CPHYS_SCRIPT_6`：由自定义物理 Lua 脚本设置的 #6 号值；
- `CPHYS_SCRIPT_7`：由自定义物理 Lua 脚本设置的 #7 号值；
- `TC2`；
- `FUELMAP`；

##### 补丁添加的额外数值

- `DRIVEN_TOTAL`：总里程表，数值单位为 km（初值从 Odometer App 或 Sidekick 加载，或由 CM 传入）；
- `DRIVEN_SESSION`：当前会话内的里程，数值单位为 km；
- `STALLED`（flag）：发动机是否熄火（目前指转速极低并持续一段时间）？
- `BATTERY`：估算的电瓶电压；
- `OIL_PRESSURE`（别名：`OIL`）：估算的机油压力；
- `OIL_TEMPERATURE`（别名：`OIL_TEMP`）：估算的机油温度；
- `EXHAUST_TEMPERATURE`（别名：`EXHAUST_TEMP`）：估算的排气温度；

##### 雨刷

- `WIPERS_MODE`：雨刷关闭时为 0，否则为当前所处模式；
- `WIPERS_PROGRESS`：雨刷动画的进度；

##### 一些用于罕见场景的附加项（也许适合某个监视屏？）

- `DRIFT_VALID`（flag）：当前漂移是否有效（例如未处于越野状态）？
- `DRIFT_BONUS_ON`（flag）：漂移连击奖励是否开启？
- `DRIFT_COMBO`：漂移连击计数，整数；
- `DRIFT_INSTANT`：当前漂移分数，整数；
- `DRIFT_POINTS`：总漂移分数，整数；
- `TRACK_PROGRESS`：赛道进度，0 到 1；
- `COMPASS`：车头朝向，度，0° 为北，90° 为东，默认格式为 `COMPASS`；

##### 燃油消耗相关（WIP，公式可能会重做）

- `FUEL_BURNT`：本次会话消耗的燃油，升；
- `FUEL_BURNT_TOTAL`：总计消耗的燃油，升；
- `FUEL_CONSUMPTION_KPL`：燃油消耗率，公里/升，本次会话的平均值；
- `FUEL_CONSUMPTION_LP100K`：燃油消耗率，升/100 公里，本次会话的平均值；
- `FUEL_CONSUMPTION_MPG`：燃油消耗率，英里/加仑，本次会话的平均值；
- `FUEL_CONSUMPTION_LPL`：燃油消耗率，升/圈，本次会话的平均值；
- `FUEL_CONSUMPTION_KPL_TOTAL`：燃油消耗率，公里/升，总计的平均值；
- `FUEL_CONSUMPTION_LP100K_TOTAL`：燃油消耗率，升/100 公里，总计的平均值；
- `FUEL_CONSUMPTION_MPG_TOTAL`：燃油消耗率，英里/加仑，总计的平均值；
- `FUEL_CONSUMPTION_LPL_TOTAL`：燃油消耗率，升/圈，总计的平均值；
- `FUEL_ESTIMATE_DISTANCE`：预计可行驶距离，米，基于本次会话的平均消耗；
- `FUEL_ESTIMATE_DISTANCE_TOTAL`：预计可行驶距离，米，基于总计的平均消耗；
- `FUEL_ESTIMATE_TIME`：预计可行驶时间，秒，基于本次会话的平均消耗；
- `FUEL_ESTIMATE_TIME_TOTAL`：预计可行驶时间，秒，基于总计的平均消耗；
- `FUEL_ESTIMATE_LAPS`：预计可行驶圈数，基于本次会话的平均消耗；
- `FUEL_ESTIMATE_LAPS_TOTAL`：预计可行驶圈数，基于总计的平均消耗；

#### 比赛相关

- `POSITION`：比赛中的位置，从 1 开始；
- `LAP_TIME`：当前圈用时，秒，此项及其他时间类输入的默认格式为 “LAP_TIME”；
- `BEST_LAP_TIME`：最佳圈速，秒；
- `LAST_LAP_TIME`：上一圈用时，秒；
- `EXPECTED_LAP_TIME`：预计圈速，秒（由最佳圈速和性能差值推算）；
- `LAPS_COUNT`：已行驶的圈数；
- `FLAG_TYPE`：当前显示的比赛旗帜类型（与赛道条件中的完全一致）；

##### 与车辆无关

- `ONE`：常数值 1.0；
- `ZERO`：常数值 0.0；
- `FPS`：当前每秒帧数；
- `FRAME_TIME_MS`：当前帧时间，毫秒；
- `AMBIENT_TEMPERATURE`（别名：`AMBIENT_TEMP`）：环境（空气）温度，°C；
- `ROAD_TEMPERATURE`（别名：`ROAD_TEMP`）：路面温度，°C；
- `WIND_SPEED`：风速，km/h；
- `WIND_VELOCITY`：世界空间中的风矢量，3D 矢量，m/s；
- `WIND_DIR`：风向，度，默认格式为 `COMPASS`；
- `TIME`：从 00:00 起经过的秒数，默认格式为 `TIME`；
- `DATE`：当前日期，以时间戳表示，默认格式为 `DATE`；
- `TIME_HOURS`：小时数，默认 `INPUT_MOD = 24`；
- `TIME_MINUTES`：分钟数，默认 `INPUT_MOD = 60`；
- `TIME_SECONDS`：秒数，默认 `INPUT_MOD = 60`。

### 格式

要让某些类型的输入（例如返回圈速的那些）在数字显示屏上正确显示，需要进行一些格式化。这类输入通常已默认设置好格式，但你也可以覆盖该行为，或为普通输入添加格式。更多信息见[这里](/car/instruments/digital-instruments)。

### 更复杂的表达式

从 CSP 0.1.77 起，输入可以引用其他输入并使用表达式。首先，要引用另一个输入，可以创建新的共享输入：

```ini
[SHARED_INPUT_...]
NAME = my_input  ; 引用它时使用的名称
INPUT = GAS
; 所有常规 INPUT 参数在此均可用
```

之后即可这样使用它，或直接使用复杂表达式：

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

可用函数：

- 无参数（常数）：
  - `e`：自然常数 e；
  - `pi`：圆周率。
- 单参数：
  - `abs(x)`：返回 `x` 的绝对值；
  - `acos(x)`：返回角度，弧度；
  - `asin(x)`：返回角度，弧度；
  - `atan(x)`：返回角度，弧度；
  - `ceil(x)`：向上取整；
  - `cos(x)`：输入为弧度；
  - `cosh(x)`：输入为弧度；
  - `exp(x)`：返回 `e^x`；
  - `floor(x)`：向下取整；
  - `ln(x)`：自然对数；
  - `log(x)`：以 10 为底的对数；
  - `log10(x)`：以 10 为底的对数；
  - `saturate(x)`：若 `x` 在 0 和 1 之间则返回 `x`，否则返回 0 或 1（取更近者）；
  - `sign(x)`：返回 `x` 的符号，`x` 为 0 时则返回 0；
  - `sin(x)`：输入为弧度；
  - `sinh(x)`：输入为弧度；
  - `smoothstep(x)`：smoothstep 适合用于渐变；
  - `smootherstep(x)`：类似 smoothstep，但更平滑；
  - `sqrt(x)`：返回平方根；
  - `tan(x)`：输入为弧度；
  - `tanh(x)`：输入为弧度。
- 双参数：
  - `atan2(x, y)`：将 `x` 和 `y` 转换为角度，弧度；
  - `max(x, y)`：返回 `x` 和 `y` 中较大者；
  - `min(x, y)`：返回 `x` 和 `y` 中较小者；
  - `pow(x, y)`：求 `x` 的 `y` 次幂；
  - `step(x, y)`：若 `y` 大于或等于 `x` 则返回 1，否则返回 0。
- 更多参数：
  - `clamp(x, min, max)`：若 `x` 在 `min` 和 `max` 之间则返回 `x`，否则返回 `min` 或 `max`（取更近者）；
  - `remap(x, a, b, c, d)`：若 `x` 等于 `a` 则返回 `c`，等于 `b` 则返回 `d`，否则在 `c` 和 `d` 之间线性插值（不进行钳制）。

