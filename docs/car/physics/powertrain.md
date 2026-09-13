---
title: 动力系统
---


> 汉化标题：车辆 – 动力系统  
> 原文页面：Cars-–-Powertrain  
> 原文锚点：1789b1e  
> 汉化时间：2026-09-11T23:30:00+08:00  
> 译注：engine map 译作「引擎图谱」；rev limiter 译作「断油转速限制器」  

# 发动机通用选项

## 已对发动机功率和空气动力学进行海拔影响建模（扩展物理下默认启用）

---

## 发动机响应延迟（发动机对输入作出响应所需的时间）

*engine.ini*

```ini
[ENGINE_DATA]
RESPONSE_TIME=0.03 ; 响应延迟（秒）
```

---

## 更精确的燃油消耗系统。car.ini 中的燃油消耗参数现已忽略（可删除）。
### 实现示例：

*engine.ini* —— 注意：仅作补充，仍需 Kunos 参数。

```ini
[ENGINE_DATA]    ; Kunos 节
MECHANICAL_EFFICIENCY=0.85 ; %/100 —— 应与你的「传动系统损失」乘数相匹配（注意：目前仅用于燃油计算）
IDLE_THROTTLE=0.04    ; %/100 —— 维持怠速所用的油门量（注意：目前仅用于燃油计算）
IDLE_CUTOFF=1800    ; 怠速油门停止的转速（rpm）（注意：目前仅用于燃油计算——建议大多数车辆取怠速转速 + 100——某些赛车的怠速油门永不切断，此时截止转速应高于断油转速限制器）
```

根据你的偏好/手头可用的数据，在以下选项中择一使用——若没有燃油流量数据，建议选选项 1（其参数更容易获得）。  
LUT 参数并非必须使用——若将其注释掉，数值会默认取常量。  
每个参数必须提供常量或 LUT 之一。

- **选项 1（热效率）：**

```ini
[FUEL_CONSUMPTION]    ; 新节
THERMAL_EFFICIENCY_LUT=therm_eff.lut    ; torque_ratio|发动机热效率（%/100）——扭矩比 = 当前发动机扭矩 / 最大发动机扭矩
THERMAL_EFFICIENCY=0.35 ; %/100 —— 无 LUT 时使用的常量
FUEL_LHV=43 ; 燃油低热值——MJ/kg
TURBO_EFFICIENCY=0.8    ; 可选——涡轮将燃油转化为动力的效率
LOG_FUEL_FLOW=0    ; 为 1 时记录燃油流量——警告：日志体积很大
```

- **选项 2（燃油流量）：**

```ini
[FUEL_CONSUMPTION]
MAX_FUEL_FLOW_LUT=max_flow.lut    ; rpm | 最大燃油流量（kg/hour）
MAX_FUEL_FLOW=100 ; kg/hr —— 无 LUT 时使用的常量
LOG_FUEL_FLOW=0
```

---

## 引擎图谱——每个图谱基于 RPM 的扭矩乘数

实现示例：

*engine.ini*

```ini
[MAP]
DEFAULT=0    ; 默认图谱索引
MAP_0=engine_map0.lut    ; rpm|扭矩乘数
MAP_1=engine_map1.lut    ; 允许添加更多图谱
```

*setup.ini*

```ini
[ENGINE_MAPS]
SHOW_CLICKS=0
TAB=GENERIC
NAME=Engine Map
LUT=engine_map_setup.lut    ; 格式：名称|索引——也可使用直接索引，需确保索引与 MAP_ 条目对应
POS_X=0.5
POS_Y=3
HELP=NULL
```
---
# 离合器
## 扩展离合器损坏

从 0.1.76 起，高扭矩可以造成额外的离合器损坏。新选项设置在 `drivetrain.ini` 中，紧邻现有的损坏选项：

```ini
[DAMAGE]
TORQUE_THRESHOLD =         ; 基于发动机产生的扭矩
TORQUE_DAMAGE_K =          ; 强度乘数，与现有的 DAMAGE_K 类似
ENGINE_TORQUE_THRESHOLD =  ; 基于传动系统总扭矩
ENGINE_TORQUE_DAMAGE_K =
CLUTCH_TORQUE_THRESHOLD =  ; 基于离合器扭矩
CLUTCH_TORQUE_DAMAGE_K =
```
---
# 涡轮

## 0.2.8 新增（05/2025）
扩展涡轮选项。

engine.ini：
```ini
[HEADER]
TURBO_VERSION=1 ;0 为 AC，1 为 v1 CSP

[TURBO_0]                   ; 可用于任意一个涡轮
FLOW_ON_CUT=0.6             ; 点火切断（相对油门切断）时残留的排气能量。基于切断量线性插值（100% 切断即为此流量）。
```
原始 KS 代码的一个问题在于电子油门切断的处理方式。AC 将燃油/点火切断与节气门体运动同等对待。这意味着在换挡切断（以及 TC 切断）时，其表现如同油门被猛然关闭，排气流量降至约 0，从而使涡轮转速迅速回落。现实中，节气门保持开启，点火切断（或点火正时推迟等任何非节气门因素造成的功率切断）时仍有可观的气流，使涡轮能很好地维持转速。净排气能量当然更低，因为燃油并未燃烧，但气流绝不会归零。CPHYS 涡轮正是为纠正这一行为而编写（方式简单、易于使用）。简而言之，它避免增压压力在电子换挡切断和 TC 切断时像原版代码那样大幅跌落，从而可以使用更真实的迟滞下降与上升时间。

## 2019 年新增
补丁为涡轮新增了一些选项，仅在[启用扩展物理](/car/physics/enabling)时可用：用于油门踏板和起转延迟的 LUT。

```ini
[TURBO_0]
LAG_DN=0.985
LAG_UP=0.9965
MAX_BOOST=1.0
WASTEGATE=0.58
DISPLAY_MAX_BOOST=0.58
REFERENCE_RPM=2500
GAMMA=4
COCKPIT_ADJUSTABLE=0
EXT_GAS_CURVE=(|0=0|0.3=0|1=1|)
EXT_SPIN_DELAY=0.2
```

通常，油门踏板用作涡轮激活的乘数。通过 `EXT_GAS_CURVE`（也可以用文件名代替内联 LUT），你可以重新映射该乘数值，例如让涡轮在踏板至少踩到其行程 30% 之前不激活。使用 `INPUT=GAS` 的控制器也能实现类似效果，但 LUT 允许在应用 gamma 之前修改数值。默认值（原版物理）为 `EXT_GAS_CURVE=(|0=0|1=1|)`。

至于 `EXT_SPIN_DELAY`，它会添加某种负涡轮压力，从而扩展增压区间。在涡轮起转到超过零点之前，发动机表现得如同自然吸气。若 `EXT_SPIN_DELAY=1`，原始涡轮增压值为 0.5 时，调整后将降至 0，再从 0 开始攀升。若 `EXT_SPIN_DELAY=0.5`，则为 0.33。默认值（原版物理）为 `EXT_SPIN_DELAY=0`。

感谢 dj_amur 提出添加此功能的建议。

