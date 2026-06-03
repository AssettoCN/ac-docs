---
title: 动力传动系统
---

# 动力传动系统（Powertrain）

## 通用引擎

### 海拔对引擎功率和空气动力学的影响建模（扩展物理默认启用）

---

### 引擎响应延迟（引擎响应输入所需的时间）

*engine.ini*

```ini
[ENGINE_DATA]
RESPONSE_TIME=0.03 ; 响应延迟（秒）
```

---

### 更精确的燃油消耗系统

`car.ini` 中的燃油消耗参数现在被忽略（可以删除）。

#### 示例实现

*engine.ini* — 注意：仅为补充，Kunos 参数仍然需要。

```ini
[ENGINE_DATA]    ; Kunos 章节
MECHANICAL_EFFICIENCY=0.85 ; %/100 - 应与你的 "传动损失" 乘数匹配（注意：目前仅用于燃油计算）
IDLE_THROTTLE=0.04    ; %/100 - 用于实现怠速的油门量（注意：目前仅用于燃油计算）
IDLE_CUTOFF=1800    ; 怠速油门停止的 RPM（注意：目前仅用于燃油计算 - 建议大多数车辆使用怠速 RPM + 100 - 对于某些赛车，怠速油门永远不会切断，因此截止值应大于转速限制）
```

根据你的偏好/可用数据选择以下选项之一——如果你没有燃油流量数据，建议使用选项 1（因为其参数更容易获取）。

LUT 参数不需要使用——如果注释掉，值默认为常量。

每个参数必须包含一个常量或一个 LUT。

- **选项 1（热效率）：**

```ini
[FUEL_CONSUMPTION]    ; 新章节
THERMAL_EFFICIENCY_LUT=therm_eff.lut    ; torque_ratio|引擎热效率 (%/100) — 扭矩比 = 当前引擎扭矩 / 最大引擎扭矩
THERMAL_EFFICIENCY=0.35 ; %/100 — 如果 LUT 不存在时的常量
FUEL_LHV=43 ; 燃油低热值 — MJ/kg
TURBO_EFFICIENCY=0.8    ; 可选 — 涡轮将燃油转化为动力的效率
LOG_FUEL_FLOW=0    ; 如果为 1，记录燃油流量 — 警告：大型日志
```

- **选项 2（燃油流量）：**

```ini
[FUEL_CONSUMPTION]
MAX_FUEL_FLOW_LUT=max_flow.lut    ; rpm | 最大燃油流量 (kg/hour)
MAX_FUEL_FLOW=100 ; kg/hr — 如果 LUT 不存在时的常量
LOG_FUEL_FLOW=0
```

---

### 引擎映射 — 基于 RPM 的扭矩乘数

#### 示例实现

*engine.ini*

```ini
[MAP]
DEFAULT=0    ; 默认映射索引
MAP_0=engine_map0.lut    ; rpm|扭矩乘数
MAP_1=engine_map1.lut    ; 允许额外的映射
```

*setup.ini*

```ini
[ENGINE_MAPS]
SHOW_CLICKS=0
TAB=GENERIC
NAME=Engine Map
LUT=engine_map_setup.lut    ; 格式：name|index — 也可以使用直接索引，确保索引与 MAP_ 条目匹配
POS_X=0.5
POS_Y=3
HELP=NULL
```

---

## 离合器

### 扩展离合器损坏

从 0.1.76 开始，现在可以从高扭矩获得额外的离合器损坏。新选项设置在 `drivetrain.ini` 中，与现有损坏选项并列：

```ini
[DAMAGE]
TORQUE_THRESHOLD =         ; 使用引擎产生的扭矩
TORQUE_DAMAGE_K =          ; 强度乘数，类似于现有的 DAMAGE_K
ENGINE_TORQUE_THRESHOLD =  ; 使用总传动系统扭矩 
ENGINE_TORQUE_DAMAGE_K =
CLUTCH_TORQUE_THRESHOLD =  ; 使用离合器扭矩
CLUTCH_TORQUE_DAMAGE_K = 
```

---

## 涡轮增压器（Turbos）

### 0.2.8 新增（05/2025）

扩展涡轮选项。

*engine.ini*：

```ini
[HEADER]
TURBO_VERSION=1 ;0 为 AC，1 为 v1 CSP

[TURBO_0]                   ; 可用于任何涡轮
FLOW_ON_CUT=0.6             ; 在点火切断时剩余的排气能量（相对于节气门切断）。根据切断量线性插值（100% 切断产生此流量速率）。
```

原始 KS 代码的一个问题是如何处理电子节气门切断。AC 将燃油/点火切断与节气门体移动以相同方式处理。这意味着在换挡切断（和 TC 切断）时，它表现得像节气门被猛然关闭，将排气流量减少到约 0，从而使涡轮快速解旋。实际上，节气门保持打开，在点火切断（或点火延迟等，任何不是节气门的切断功率的方式）时仍然有显著的气流，允许涡轮很好地维持转速。净排气能量当然较低，因为燃油没有被燃烧，但气流肯定不会降到零。CPHYS 涡轮的编写是为了纠正这种行为（以一种简单、易于使用的方式）。简而言之，它阻止了在电子换挡切断和 TC 切断时像原始代码那样大幅下降增压，允许使用更真实的滞后上升和下降时间。

### 2019 年新增

补丁为涡轮添加了新选项，仅在[启用扩展物理](./enabling)后可用：油门踏板 LUT 和旋转延迟。

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

通常，油门踏板用作涡轮激活的乘数。使用 `EXT_GAS_CURVE`（也可以是文件名而不是内联 LUT），你可以重新映射该乘数值，例如，阻止涡轮在踏板至少按下 30% 范围之前激活。使用 `INPUT=GAS` 的控制器可以实现类似效果，但 LUT 允许在应用 gamma 之前更改值。默认值（原始物理）为 `EXT_GAS_CURVE=(|0=0|1=1|)`。

至于 `EXT_SPIN_DELAY`，它添加了某种负涡轮压力，扩展增压范围。引擎将表现为自然吸气，直到涡轮旋转超过零点。使用 `EXT_SPIN_DELAY=1`，如果原始涡轮增压等于 0.5，修改后将降至 0，并从那里攀升。使用 `EXT_SPIN_DELAY=0.5`，将为 0.33。默认值（原始物理）为 `EXT_SPIN_DELAY=0`。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Powertrain) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
