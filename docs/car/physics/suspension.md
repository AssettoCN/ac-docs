---
title: 悬挂系统
---

# 悬挂系统（Suspension）

## 扩展物理的附加悬挂值

请记住先[启用扩展物理](./enabling)。

### 扭矩施加到悬挂的替代方式

这是对 Kunos 一个导致反效果几何不准确的 bug 的修复。

*suspensions.ini*

```ini
[_EXTENSION]				; 从 0.2.3p211 开始，对轴式悬挂类型已完全禁用
TORQUE_MODE_EX = 0 			; 选项：
					; 0 为默认/原始，力的施加到轮毂不正确。加速扭矩通过轮毂传递，而实际上不应该是这样。
					; 1 已损坏
					; 2 推荐且应在物理上准确。在 CSP 版本中进行了更新以减少 bug 并改善边缘情况行为。
```

---

### 渐进弹簧率修复

修复另一个 Kunos bug。

*suspensions.ini*

```ini
[_EXTENSION]
FIX_PROGRESSIVE_RATE = 1
```

---

### 新双叉臂悬挂扩展

包括运动比查找表输入、缓冲块查找表、渐进弹簧率修复，以及更多功能。

#### 示例实现

*suspensions.ini*

```ini
[_EXTENSION]
USE_DWB2 = 1

[FRONT]
MOTION_RATIO = motion_ratio_f.lut	; 运动比查找表（从零点偏转|运动比）
BUMP_STOP_LUT = bsf.lut    		; 偏转|力 - 必须以 0|0 开始
					; 旧版实现。请参阅页面下方的当前实现。
[HEAVE_FRONT]
MOTION_RATIO = motion_ratio_hf.lut
BUMP_STOP_LUT = bshf.lut

[REAR]
MOTION_RATIO = motion_ratio_r.lut
BUMP_STOP_LUT = bsr.lut

[HEAVE_REAR]
MOTION_RATIO = motion_ratio_hr.lut
BUMP_STOP_LUT = bshr.lut
```

---

### 使用 DWB2 的车辆的新标签弹簧调整

#### 示例实现

注意：*suspensions.ini* 格式不变。

*setup.ini*

```ini
[SPRING_LF] 				; LF, RF, RR, LR - 替换旧的 SPRING_RATE_LF 条目
SHOW_CLICKS = 0
TAB = SUSPENSIONS
NAME = Spring Rate LF
LUT = suspension_springs.lut 		; 格式：name|rate
POS_X = 0
POS_Y = 1
HELP = HELP_LF_WHEELRATE 		; 与原始 AC 选项相同，目前..
DISPLAY_VALUE_IN_BRACKETS = 1 		; 1 - 在设置窗口中名称旁边以括号显示值
```

---

### 添加防倾杆运动比

---

### 扩展车辆的新标签防倾杆调整

#### 示例实现

*suspensions.ini*

```ini
[ARB]
EXTEND = 1 				; 启用扩展 ARB 所需
FRONT_MOTION_RATIO = 1.0
FRONT = 100000 				; 前防倾杆刚度，N/m
REAR_MOTION_RATIO = 1.0
REAR = 10000 				; 后防倾杆刚度，N/m
```

**注意：** `setup.ini` 条目不是运动比功能所必需的，但 `[ARB]` 下的 `EXTEND` 行是必需的。

*setup.ini*

```ini
[ARB_F] 				; F, R - 替换旧的原始 AC 条目
SHOW_CLICKS = 0
TAB = SUSPENSIONS
NAME = ARB Front
LUT = suspension_arb_front.lut 		; 格式：name|rate
POS_X = 0.5
POS_Y = 0
HELP = HELP_FRONT_ARB 			; 与原始 AC 选项相同，目前...
DISPLAY_VALUE_IN_BRACKETS = 0 		; 1 - 在设置窗口中名称旁边以括号显示值
```

---

### 转向比设置调整（注意会破坏 AI 和动画，因此不推荐）

#### 截至 2022 年 5 月已损坏/不支持

#### 示例实现

*setup.ini*

```ini
[STEERING_RATIO]
SHOW_CLICKS = 0
TAB = SUSPENSIONS 			; 目标标签
NAME = Steering Ratio
LUT = suspension_steer.lut 		; 格式：display_name|ratio
POS_X = 0.5
POS_Y = 4
HELP = NULL 				; 目前没有合适的选项
DISPLAY_VALUE_IN_BRACKETS = 1 		; 1 - 在设置窗口中名称旁边以括号显示值
```

---

### 可调双叉臂悬挂几何（需要 DWB2）

#### 示例实现

*setup.ini*

```ini
[FRONT_GEOMETRY]
SHOW_CLICKS = 0
TAB = SUSPENSIONS
NAME = Front Geometry
LUT = setup_front_geometry.lut		; name|index
GEO_0 = suspensions_front_1.ini		; 包含更改项的 INI 文件（选项：hub_mass 和所有连接点）
GEO_1 = suspensions_front_2.ini		; 与 suspensions.ini 格式相同 - 仅需要修改的项
					; （如果值不存在，将从 suspensions.ini 加载）
DEFAULT = 0				; 默认加载的 GEO_ 索引
POS_X = 0.5
POS_Y = 3
HELP = NULL 				; 目前没有合适的选项

[REAR_GEOMETRY]
SHOW_CLICKS = 0
TAB = SUSPENSIONS
NAME = Rear Geometry
LUT = suspensions_setup_rear_geometry.lut
GEO_0 = suspensions_rear_1.ini
GEO_1 = suspensions_rear_2.ini
DEFAULT = 0;
POS_X = 0.5
POS_Y = 4
HELP = NULL
```

---

### 使用 DWB2 悬挂的车辆阻尼器查找表（注意运动比将应用于阻尼器）

#### 示例实现

*suspensions.ini*

```ini
[_EXTENSION]
DAMPER_LUTS = 1    			; 当前需要
```

创建新文件：
*dampers.ini* 

```ini
[HEADER]
ENABLE = 1 				; 0 禁用

[FRONT]
BUMP_SLOW_0 = damp_bump_slowf_0.lut	; 格式：速度 (m/s) | 力（牛顿 - 符号无关紧要）
BUMP_SLOW_4 = damp_bump_slowf_4.lut	; 注意：SLOW 条目不外推，仅 FAST 外推。如果仅使用 SLOW，请确保速度足够高以满足预期用途。建议至少高达 5 m/s 作为基线。
BUMP_SLOW_9 = damp_bump_slowf_9.lut	; 你必须至少有第一个和最后一个调整的 LUT
REBOUND_SLOW_0 = damp_reb_slowf_0.lut	; （如果不可调，你只需要 _0 条目）。
REBOUND_SLOW_4 = damp_reb_slowf_4.lut	; 对于不存在的条目，将在周围的条目之间进行线性插值
REBOUND_SLOW_9 = damp_reb_slowf_9.lut	;（此示例中的 1-3 和 5-8）。
BUMP_FAST_0 = damp_bump_fastf_0.lut
REBOUND_FAST_0 = damp_reb_fastf_0.lut
```

*setup.ini*

```ini
[DAMPER_BUMP_LF]    			; 名称与 Kunos 条目相同，只是 DAMP 已替换为 DAMPER
SHOW_CLICKS = 2
TAB = DAMPERS
NAME = Bump
MIN = 0					; 最小设置
MAX = 11				; 最大设置
STEP = 1
DEFAULT = 7				; 默认设置
POS_X = 0
POS_Y = 0
HELP = HELP_LF_DAMPER_BUMP
```

---

### 使用 DWB2 悬挂的车辆的缓冲块/橡胶查找表（从 v1.74 起可用）

对于 heave 元件，添加了额外功能。你可以将旧的 packer rate 用作第三弹簧，将新的 bumpstop rate 用作缓冲橡胶，两者都有相关的间隙。每个间隙都在地面处（即当车辆处于静态偏转时）。Packer range 用作角弹簧的 bumpstop gap，其工作方式与原始 AC 相同。

进一步说明：缓冲块查找表的旧版实现仍然有效。

#### 示例实现

*suspensions.ini*

```ini
[_EXTENSION]
SEPARATE_BSH_GAPS = 1 			; 如果为 0 或行不存在，bumpstop_gap = packer_range

[HEAVE_FRONT]
BUMPSTOP_GAP = 0.1 			; 静态载荷下缓冲块的间隙，单位为米

[HEAVE_REAR]
BUMPSTOP_GAP = 0.1 			; 静态载荷下缓冲块的间隙，单位为米
```

创建新文件：
*bumpstops.ini*

```ini
[HEADER]
ENABLE = 1

[FRONT]
DEFAULT = 0 				; 默认索引/缓冲橡胶选择
STACK = 1 				; 堆叠的橡胶数量
[REAR]
DEFAULT = 0
STACK = 2

[FRONT_HEAVE]
DEFAULT = 0
STACK = 2
[REAR_HEAVE]
DEFAULT = 1
STACK = 3

[FRONT_0] 				; 可以有任意多个
LUT = filename.lut 			; 偏转（米）|力（牛顿）。必须以 0|0 开始
[FRONT_1]				; （"弹簧"在任何情况下都不应在 0 偏转时产生力）
LUT = filename.lut

[REAR_0]
LUT = filename.lut
[REAR_1]
LUT = filename.lut

[FRONT_HEAVE_0]
LUT = filename.lut
[FRONT_HEAVE_1]
LUT = filename.lut

[REAR_HEAVE_0]
LUT = filename.lut
[REAR_HEAVE_1]
LUT = filename.lut
```

*setup.ini*

```ini
[BUMPSTOP_HF] 				; HF, HR
SHOW_CLICKS = 0
TAB = SUSPENSION HEAVE
NAME = Bump Rubber F
LUT = bs_setup.lut 			; 可用于为每个橡胶分配名称。格式：Name|index
POS_X = 1
POS_Y = 0
HELP = HELP_HR_WHEELRATE

[BUMPSTOP_GAP_HF] 			; HF, HR
SHOW_CLICKS = 0
TAB = SUSPENSION HEAVE
NAME = Bump Rubber Gap
MIN = 0
MAX = 100
STEP = 1
POS_X = 1
POS_Y = 1
HELP = HELP_HF_TRAVEL_RANGE

[BUMPSTOP_NUM_HF] 			; HF, HR
SHOW_CLICKS = 0
TAB = SUSPENSION HEAVE
NAME = Bump Rubber Stack
MIN = 1
MAX = 3
STEP = 1
POS_X = 0.5
POS_Y = 2
HELP = Null

[BUMPSTOP_LF]				; LF, RF, LR, RR
SHOW_CLICKS = 0
TAB = SUSPENSION ADV.
NAME = Bump Rubber LF
LUT = bs_setup.lut
POS_X = 0
POS_Y = 0
HELP = HELP_LF_BUMP_STOP_RATE

[BUMPSTOP_NUM_LF]			; LF, RF, LR, RR
SHOW_CLICKS = 0
TAB = SUSPENSION ADV.
NAME = Rubber Stack LF
MIN = 1
MAX = 3
STEP = 1
POS_X = 0
POS_Y = 1
HELP = Null

[PACKER_RANGE_LF] 			; LF, RF, LR, RR - 与原始相同
SHOW_CLICKS = 0
TAB = SUSPENSION ADV.
NAME = Bump Rubber Gap LF
MIN = 0
MAX = 50
STEP = 1
POS_X = 0
POS_Y = 2
HELP = HELP_LF_TRAVEL_RANGE
```

相关内容：[启用扩展物理](./enabling)、[转向系统](./steering)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Suspension) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
