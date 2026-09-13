---
title: 发光物体
---


> 汉化标题：车辆 – 发光物体  
> 原文页面：Cars-–-Emissive-objects  
> 原文锚点：536381c  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：turning signal 译作「转向灯」；原文 `FALLBACK_LOWBEAM_COLOR` 一条的说明存在笔误，译文按回退顺序的实际含义（位于 `FALLBACK_HIGHBEAM_COLOR` 之后、`FALLBACK_HEADLIGHTS_COLOR` 之前）译出  

最初，AC 有 `lights.ini`，允许你根据条件让物体发光（实际上只有两个条件：大灯和刹车灯）。而如果你希望进行更细致的设置，现在补丁提供了更多选项。

### 语法

```ini
[EMISSIVE_REVERSE_0]
NAME = _ext_REVERSE_LIGHTS  ; 要发光的网格名称（一个或多个）（MESHES 也可作为替代键）
COLOR = 25, 25, 25          ; 满足条件时的发光颜色
OFF_COLOR = 0, 0, 0         ; 不满足条件时的发光颜色，默认值为 0
LAG = 0.8                   ; 为 0 时立即开启和关闭
SIMULATE_HEATING = 0.3      ; 添加加热效果，在开启和关闭时经过橙色色调过渡
LOCATION = REAR             ; 用于损坏计算和灯光猜测的灯光位置，默认值取决于类型
ACT_AS_HEADLIGHTS = 0       ; 设为 1 时，相机被车大灯照到时发光度会提升
```

### 支持的类型

- `EMISSIVE_LIGHT_N`：大灯，默认位置为 FRONT；
- `EMISSIVE_BRAKE_N`：刹车灯，默认位置为 REAR；
- `EMISSIVE_REVERSE_N`：倒车灯（用于倒档），默认位置为 REAR；
- `EMISSIVE_TURNSIGNAL_LEFT_N`：左转向灯（别忘了拆分为前、后两部分，猜测功能才能生效）；
- `EMISSIVE_TURNSIGNAL_RIGHT_N`：右转向灯；
- `EMISSIVE_CORNERINGLAMP_LEFT_N`：左转角灯，带有以度为单位的 `STEER_THRESHOLD` 参数；
- `EMISSIVE_CORNERINGLAMP_RIGHT_N`：右转角灯，带有 `STEER_THRESHOLD` 参数；
- `EMISSIVE_LOWBEAM_N`：仅在灯光处于近光状态时激活；
- `EMISSIVE_HIGHBEAM_N`：仅在灯光处于远光状态时激活（添加其中任意一个都会自动禁用补丁对 `lights.ini` 灯光近光/远光发光度的调整）；
- `EMISSIVE_EXTRA_A_N`、`EMISSIVE_EXTRA_B_N`、`EMISSIVE_EXTRA_C_N`、`EMISSIVE_EXTRA_D_N`：四个用于任意自定义需求的额外发光物体，每个都有自己的开关快捷方式，并支持回放和联机。

### 车内指示灯支持的类型（默认位置为 `NONE`）

- `EMISSIVE_HAZARD_N`：危险警示灯（就像仪表板上那个红色按钮）；
- `EMISSIVE_HANDBRAKE_N`：手刹指示灯；
- `EMISSIVE_BATTERY_N`：电瓶指示灯；
- `EMISSIVE_TYRES_N`：轮胎亏气指示灯，带有 `PRESSURE_THRESHOLD` 参数；
- `EMISSIVE_ABS_N`：ABS 指示灯，ABS 开启时点亮；
- `EMISSIVE_ABS_INACTION_N`：看起来你用不到它？如果有哪辆车用到了，请告诉我；
- `EMISSIVE_TRACTIONCONTROL_N`：牵引力控制指示灯，TC 开启时点亮（通常它是 TC 关闭时的警告信号，因此请使用 `COLOR = 0, 0, 0` 和 `OFF_COLOR = 25, 0, 0`）；
- `EMISSIVE_TRACTIONCONTROL_INACTION_N`：在 TC 正在介入工作时触发；
- `EMISSIVE_TURNSIGNAL_N`：仪表板上共用的转向指示灯，就像法拉利 F40 上的那个；
- `EMISSIVE_ENGINE_DAMAGE_N`：发动机故障灯，带有 `ENGINE_LIFE_THRESHOLD` 参数；
- `EMISSIVE_ENGINE_TEMP_N`：发动机温度，带有 `TEMP_MIN`、`TEMP_MAX` 和 `TEMP_EXP` 参数以实现逐渐点亮；
- `EMISSIVE_GEAR_R_N`：倒档时触发；
- `EMISSIVE_GEAR_N_N`：空档时触发；
- `EMISSIVE_GEAR_D_N`：前进档时触发；
- `EMISSIVE_GEAR_…_N`：特定 1…9 档时触发；
- `EMISSIVE_OPENDOORS_N`：车门打开时触发。

### 自定义输入

发光物体支持自定义输入。更多信息请见[这里](https://github.com/car/instruments/inputs)。

**重要说明：** 虽然自定义输入通常给出的是一个数值（带有各种延迟、LUT 等），但自定义发光物体默认只在该数值超过某个阈值时才开启。可以使用 `USE_SMOOTH_TRANSITION = 1` 来改变这一行为。

```ini
[EMISSIVE_...]
INPUT = BODY_DAMAGE          ; BIND_TO 也可作为替代键
INPUT_THRESHOLD = 20
NAME = _ext_DAMAGE_LIGHT
COLOR = 25, 0, 0
```

还可以用一个单独的输入强制关闭发光物体：

```ini
FORCE_OFF_INPUT = HAZARD     ; FORCE_OFF_BIND_TO 也可作为替代键
```

使用 `FORCE_OFF_INPUT` 时，所有带 `FORCE_OFF_` 前缀的输入参数都会生效（例如 `FORCE_OFF_LUT` 等）。

不过对于外部灯光，我建议暂时继续使用 `EMISSIVE_LIGHT_N` 语法，直到我重写猜测器使其支持新的发光物体类型为止。那部分目前实在是一团糟。

### 其他参数

- `TOGGLE_VISIBILITY = 0`：设为 1 时，网格在未激活时消失；
  - `TOGGLE_VISIBILITY_INVERSE = 0`：设为 1 可反转 `TOGGLE_VISIBILITY` 的行为；
- `USE_SMOOTH_TRANSITION = 0`：使用 INPUT 的数值输出，而不是将其与 `INPUT_THRESHOLD` 比较后的开关标志；
- `ONLY_WITH_HEADLIGHTS = 0`：设为 1 时，发光物体仅在大灯开启时激活（默认值取决于类型）；
- `CAST_LIGHT = 1`：对特定类型的灯光，补丁可以像处理 `lights.ini` 那样尝试猜测动态灯光（如需禁用，可将该参数设为 0）；
- `CLUSTER_THRESHOLD = 0.5`：基于模型猜测动态灯光的方式；
- `BIND_AS = LICENSE_PLATE`：让该发光网格控制车牌动态灯光的亮度（车牌灯是单独猜测和设置的，所以需要像这样绑定）；
- `FALLBACK_HEADLIGHTS_COLOR = 10, 10, 10`：条件不满足且大灯开启时使用的发光颜色，未设置该参数时完全不使用；
- `FALLBACK_HIGHBEAM_COLOR = 20, 20, 20`：此颜色在条件不满足时使用，位于 `FALLBACK_BRAKES_COLOR` 之后、`FALLBACK_LOWBEAM_COLOR` 之前；
- `FALLBACK_LOWBEAM_COLOR = 5, 5, 5`：此颜色位于 `FALLBACK_HIGHBEAM_COLOR` 之后、`FALLBACK_HEADLIGHTS_COLOR` 之前；
- `FALLBACK_BRAKES_COLOR = 15, 0, 0`：条件不满足且刹车灯点亮时使用的发光颜色，在 `FALLBACK_HEADLIGHTS_COLOR` 之前生效；
- `FALLBACK_BRAKES_COLOR_HIGHER = 1`：该参数设为 1 时，`FALLBACK_BRAKES_COLOR` 将优先于主 `COLOR` 使用。
- `FALLBACK_BASE_COLOR = 0, 0, 0 `：大灯关闭时使用的发光颜色，默认为 0
- `FALLBACK_IDLE_COLOR = 0, 0, 0 `：发动机怠速时使用的发光颜色，默认为 0
- `FALLBACK_DRL_COLOR = 0, 0, 0 `：日间行车灯点亮时的发光颜色


结合 `FALLBACK_HEADLIGHTS_COLOR` 和 `FALLBACK_BRAKES_COLOR`，可以让单个网格同时充当转向灯、刹车灯和（尾部）驻车灯。或者，利用 `FALLBACK_BRAKES_COLOR` 和 `FALLBACK_BRAKES_COLOR_HIGHER`，可以将网格设为倒车灯，而一旦踩下刹车踏板，倒车灯就会变红。

### 回退颜色判定顺序

供参考，完整的回退颜色判定顺序（自上而下，先命中者生效）：

1. 主 `COLOR`（发光物体开启且未设置 `FALLBACK_BRAKES_COLOR_HIGHER` 时）
2. `FALLBACK_BRAKES_COLOR`（刹车灯点亮且发光物体关闭时）
3. 设置了 `FALLBACK_BRAKES_COLOR_HIGHER = 1` 时的主 `COLOR`（此时刹车灯即使在开启状态下也会被覆盖）
4. `FALLBACK_HIGHBEAM_COLOR`（远光灯开启时）
5. `FALLBACK_LOWBEAM_COLOR`（近光灯开启时）
6. `FALLBACK_HEADLIGHTS_COLOR`（大灯开启时）
7. `FALLBACK_DRL_COLOR`（日间行车灯开启时）
8. `FALLBACK_IDLE_COLOR`（发动机运转/未熄火时）
9. `FALLBACK_BASE_COLOR`（始终，当大灯关闭时）
10. `OFF_COLOR`（最终回退）

### 闪烁，选项 A

如今的情况是：让发光物体闪烁有两种方法。早知道就该给第二种（B）选项起个不同的名字……第一种适合用于转向灯或指示灯：除非触发了某个相反的输入，它会按给定的次数（多数情况下为 1 次）完成整个闪烁循环。第二种则只是直接关掉发光物体，不会补完整个序列。

- `BLINK_REPEAT = 1                ; 就是让它闪烁`
- `BLINK_FREQENCY_HZ = 2.4         ; 设置闪烁频率`
- `BLINK_FREQENCY_HAZARDS_HZ = 2   ; 如有需要，可为危险警示灯设置不同的频率`
- `;;; BLINK = 1   ; 或者，可以让它只闪烁一次，或以此为最少闪烁次数`

（`REPEAT_FREQUENCY_HZ` 和 `REPEAT_FREQUENCY_HAZARDS_HZ` 是错误的写法，补丁会意外地将其数值除以二，该行为为兼容性而保留。）

### 闪烁，选项 B

该选项在灯光熄灭后不会补完整个序列，并且支持 LUT，适合更注重视觉效果的场景，例如缓慢淡入淡出的霓虹灯：

- `BLINKING_PATTERN = (|0=1|0.5=0.8|1=1|2=0.6|3=0.8|3.5=1)`：将闪烁模式设为 LUT（也可以是文件名），输入为闪烁模式的时间；
- `BLINKING_DURATION = 2`：可选，闪烁模式的时长，单位为秒（若设置，模式将被归一化）。

下面是使用闪烁模式的一个示例：[BMW E30 Drift 的配置](https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/master/config/cars/kunos/bmw_m3_e30_drift.ini#L21)。

### 动画转向灯

对于动画转向灯，可以指定一系列网格依次工作（与 RPM 系列仪表的工作方式类似，把转向灯网格拆分成若干块即可）。指定它们的方式有两种：

```ini
RANGE_START_INDEX = 0
RANGE_END_INDEX = 2
RANGE_PREFIX = _ext_turnsig_left_
```

这样会搜索 `_ext_turnsig_left_0`、`_ext_turnsig_left_1`、`_ext_turnsig_left_2`，或者：

```ini
RANGE_NAMES = _ext_turnsig_left_0, _ext_turnsig_left_1, _ext_turnsig_left_2
```

这样会搜索同样的三个网格，但使用 `RANGE_NAMES` 时可以改变顺序，甚至使用非连续命名的网格。动画转向灯的其他参数：

- `RANGE_DELAY = 0.1`：各块点亮之间的延迟，单位为秒；
- `SMOOTH_IN = 1`：以动画方式点亮；
- `SMOOTH_OUT = 0`：以动画方式熄灭（车辆通常不会这样）。

### 一些小提示

- 补丁每次解析颜色值时都会检查第四个数字，并将颜色乘以它。因此，如果想让颜色更亮，只需添加一个不等于 1 的第四个值；
- 虽然额外灯光也可以使用 `BLINKING_PATTERN`，但更推荐改用 `BOUND_TO`，因为它能确保灯光与发光物体同步；
- 你可以在[这里](https://github.com/ac-custom-shaders-patch/acc-extension-config/tree/master/config/cars/kunos)找到大量示例。

