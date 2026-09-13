---
title: 悬挂
---


> 汉化标题：车辆 – 悬挂  
> 原文页面：Cars-–-Suspension  
> 原文锚点：2b9e66e  
> 汉化时间：2026-09-11T23:30:00+08:00  
> 译注：heave 译作「起伏」（车身垂直方向）；double wishbone 译作「双叉臂」；bump stop 译作「缓冲块」、bump rubber 译作「缓冲橡胶」  

## 扩展物理中的附加悬挂参数

记得[启用扩展物理](https://github.com/car/physics/enabling)

### 向悬挂施加扭矩的替代方式
这是对一个 Kunos bug 的修复，该 bug 曾导致几何抗效应（anti-effects）不准确。

*suspensions.ini*

```ini
[_EXTENSION]				; 自 0.2.3p211 起，对整体桥（axle）悬挂类型现已完全禁用
TORQUE_MODE_EX = 0 			; 选项：
					; 0 为默认/原版，力施加到轮毂的方式不正确：加速扭矩会经由轮毂传递，而现实中并非如此。
					; 1 已损坏
					; 2 为推荐值，应能做到物理准确。CSP 各版本的更新曾改变其行为，但都只是为了减少 bug、改善边缘情况下的表现。
```
---
### 渐进弹簧刚度的修复
修复另一个 Kunos bug

*suspensions.ini*

```ini
[_EXTENSION]
FIX_PROGRESSIVE_RATE = 1
```
---
### 新的双叉臂悬挂扩展
包含运动比查找表与缓冲块查找表的输入、渐进刚度修复，后续还会加入更多
示例实现：

*suspensions.ini*

```ini
[_EXTENSION]
USE_DWB2 = 1

[FRONT]
MOTION_RATIO = motion_ratio_f.lut	; 运动比查找表（偏离零点的变形量|运动比）
BUMP_STOP_LUT = bsf.lut    		; 变形量|力 - 必须以 0|0 开头
					; 旧版实现。当前实现见页面下方。
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
### 使用 DWB2 的车辆的新增标签弹簧调整
示例实现：
注意：*suspensions.ini* 格式不变。
*setup.ini*

```ini
[SPRING_LF] 				; LF、RF、RR、LR - 替换旧的 SPRING_RATE_LF 条目
SHOW_CLICKS = 0
TAB = SUSPENSIONS
NAME = Spring Rate LF
LUT = suspension_springs.lut 		; 格式：名称|刚度
POS_X = 0
POS_Y = 1
HELP = HELP_LF_WHEELRATE 		; 暂时与原版 AC 选项相同..
DISPLAY_VALUE_IN_BRACKETS = 1 		; 1 - 在设置窗口中名称旁以括号显示数值。
```

---
### 新增防倾杆运动比

---
### 扩展车辆的新增标签防倾杆调整
示例实现：

*suspensions.ini*

```ini
[ARB]
EXTEND = 1 				; 启用扩展 ARB 所必需
FRONT_MOTION_RATIO = 1.0
FRONT = 100000 				; 前防倾杆刚度（N/m）
REAR_MOTION_RATIO = 1.0
REAR = 10000 				; 后防倾杆刚度（N/m）
```

**注意：** 运动比生效不需要 setup.ini 条目，但 [ARB] 下的 EXTEND 行是必需的。

*setup.ini*

```ini
[ARB_F] 				; F、R - 替换旧的原版 AC 条目
SHOW_CLICKS = 0
TAB = SUSPENSIONS
NAME = ARB Front
LUT = suspension_arb_front.lut 		; 格式：名称|刚度
POS_X = 0.5
POS_Y = 0
HELP = HELP_FRONT_ARB 			; 暂时与原版 AC 选项相同...
DISPLAY_VALUE_IN_BRACKETS = 0 		; 1 - 在设置窗口中名称旁以括号显示数值。
```

---
### 转向比设置调整（注意会破坏 AI 和动画，故不推荐）
#### 自 2022 年 5 月起已损坏/不受支持
示例实现：
*setup.ini*

```ini
[STEERING_RATIO]
SHOW_CLICKS = 0
TAB = SUSPENSIONS 			; 目标选项卡
NAME = Steering Ratio
LUT = suspension_steer.lut 		; 格式：显示名|转向比
POS_X = 0.5
POS_Y = 4
HELP = NULL 				; 目前没有合适的选项
DISPLAY_VALUE_IN_BRACKETS = 1 		; 1 - 在设置窗口中名称旁以括号显示数值。
```

---
### 可调双叉臂悬挂几何（需要 DWB2）
示例实现：

*setup.ini*

```ini
[FRONT_GEOMETRY]
SHOW_CLICKS = 0
TAB = SUSPENSIONS
NAME = Front Geometry
LUT = setup_front_geometry.lut		; 名称|索引
GEO_0 = suspensions_front_1.ini		; 包含所更改项的 INI 文件（可选：hub_mass 和所有 pickup 点）
GEO_1 = suspensions_front_2.ini		; 与 suspensions.ini 格式相同 - 只需写入修改过的项
					; （若值缺失，将从 suspensions.ini 加载）
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
### 使用 DWB2 悬挂的车辆的阻尼器查找表（注意运动比将应用于阻尼器）
示例实现：

*suspensions.ini*

```ini
[_EXTENSION]
DAMPER_LUTS = 1    			; 目前为必需
```

创建一个新文件：
*dampers.ini*

```ini
[HEADER]
ENABLE = 1 				; 0 为禁用

[FRONT]
BUMP_SLOW_0 = damp_bump_slowf_0.lut	; 格式：速度（m/s）| 力（牛顿——正负号无关）。
BUMP_SLOW_4 = damp_bump_slowf_4.lut	; 注意：SLOW 条目不做外推，只有 FAST 条目会外推。若仅使用 SLOW，请确保速度范围足以覆盖预期用途。建议至少以 5 m/s 为基线。
BUMP_SLOW_9 = damp_bump_slowf_9.lut	; 至少要为第一个和最后一个调整档位各提供一个 LUT
REBOUND_SLOW_0 = damp_reb_slowf_0.lut	; （若不可调，则只需要 _0 条目）。
REBOUND_SLOW_4 = damp_reb_slowf_4.lut	; 缺失的条目将由相邻条目线性插值得到
REBOUND_SLOW_9 = damp_reb_slowf_9.lut	; （本例中为 1-3 和 5-8）。
BUMP_FAST_0 = damp_bump_fastf_0.lut
REBOUND_FAST_0 = damp_reb_fastf_0.lut
```

*setup.ini*

```ini
[DAMPER_BUMP_LF]    			; 名称与 Kunos 条目相同，只是 DAMP 已被替换为 DAMPER
SHOW_CLICKS = 2
TAB = DAMPERS
NAME = Bump
MIN = 0					; 最小设置值
MAX = 11				; 最大设置值
STEP = 1
DEFAULT = 7				; 默认设置值
POS_X = 0
POS_Y = 0
HELP = HELP_LF_DAMPER_BUMP
```

---
### 使用 DWB2 悬挂的车辆的缓冲块/缓冲橡胶查找表（自 v1.74 起可用）

对于起伏（heave）元件，新增了额外功能。你可以把旧的垫块（packer）刚度用作第三弹簧，把新的缓冲块刚度用作缓冲橡胶，二者各有对应的间隙。两者的间隙均为落地状态（即车辆处于静态变形时）的间隙。垫块行程（packer range）用作角弹簧的缓冲块间隙，其工作方式与原版 AC 相同。

另注：缓冲块查找表的旧实现仍然有效。

示例实现：

*suspensions.ini*
```ini
[_EXTENSION]
SEPARATE_BSH_GAPS = 1 			; 若为 0 或该行不存在，则 bumpstop_gap = packer_range

[HEAVE_FRONT]
BUMPSTOP_GAP = 0.1 			; 静态载荷下到缓冲块的间隙（米）

[HEAVE_REAR]
BUMPSTOP_GAP = 0.1 			; 静态载荷下到缓冲块的间隙（米）
```

创建一个新文件：
*bumpstops.ini*
```ini
[HEADER]
ENABLE = 1

[FRONT]
DEFAULT = 0 				; 缓冲橡胶的默认索引/选项
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

[FRONT_0] 				; 数量按需任意添加
LUT = filename.lut 			; 变形量（米）|力（牛顿）。必须以 0|0 开头
[FRONT_1]				; （「弹簧」在任何情况下都不应在 0 变形时出力）
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
[BUMPSTOP_HF] 				; HF、HR
SHOW_CLICKS = 0
TAB = SUSPENSION HEAVE
NAME = Bump Rubber F
LUT = bs_setup.lut 			; 可用它为每块橡胶分配名称。格式：名称|索引
POS_X = 1
POS_Y = 0
HELP = HELP_HR_WHEELRATE

[BUMPSTOP_GAP_HF] 			; HF、HR
SHOW_CLICKS = 0
TAB = SUSPENSION HEAVE
NAME = Bump Rubber Gap
MIN = 0
MAX = 100
STEP = 1
POS_X = 1
POS_Y = 1
HELP = HELP_HF_TRAVEL_RANGE

[BUMPSTOP_NUM_HF] 			; HF、HR
SHOW_CLICKS = 0
TAB = SUSPENSION HEAVE
NAME = Bump Rubber Stack
MIN = 1
MAX = 3
STEP = 1
POS_X = 0.5
POS_Y = 2
HELP = Null

[BUMPSTOP_LF]				; LF、RF、LR、RR
SHOW_CLICKS = 0
TAB = SUSPENSION ADV.
NAME = Bump Rubber LF
LUT = bs_setup.lut
POS_X = 0
POS_Y = 0
HELP = HELP_LF_BUMP_STOP_RATE

[BUMPSTOP_NUM_LF]			; LF、RF、LR、RR
SHOW_CLICKS = 0
TAB = SUSPENSION ADV.
NAME = Rubber Stack LF
MIN = 1
MAX = 3
STEP = 1
POS_X = 0
POS_Y = 1
HELP = Null

[PACKER_RANGE_LF] 			; LF、RF、LR、RR - 与原版相同
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

