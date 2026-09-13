---
title: 转向
---


> 汉化标题：车辆 – 转向  
> 原文页面：Cars-–-Steering  
> 原文锚点：64724fc  
> 汉化时间：2026-09-11T23:30:00+08:00  
> 译注：power steering 译作「助力转向」（又称动力转向）；steering torque 统一译作「转向力矩」  

## Real-Feel 转向  
启用 CSP 的 *Real-Feel* 力反馈模块。  
它会把转向力矩归一化到你模拟方向盘的转向力矩（该值在 CM 的 CSP 设置中指定），使你感受到的力与仿真产生的力 1:1 一致。

该系统还包含面向带助力转向车辆（大多数现代车辆）的助力转向模块。

**在 `car.ini` 中启用：**

```ini
[CONTROLS]
ENABLE_REAL_FEEL=1 ;启用 CSP 的真实转向力。助力转向必需。默认为无助力力矩。
```

---

## 助力转向系统  
新增**电动或液压助力转向辅助**的仿真。  
真实转向负载由 Real-Feel 计算，随后 CSP 进行助力转向系统仿真，得出发送到方向盘基座的净力矩。

### 最大助力力矩

```ini
ASSIST_TORQUE_MAX = 90 ;系统的最大助力力矩，单位 Nm
```

定义助力转向系统可施加力矩的**上限**。  
值越高 = 助力越强，转向手感越轻。

---

### 转向助力映射表  
查找表，定义**助力转向系统如何响应驾驶者施加的力矩**，输出 **0–1** 之间的助力系数。

```ini
ASSIST_MAP_0=car_steer_assist_map0.lut ;驾驶者力矩（Nm）| 助力系数（0–1）
ASSIST_MAP_1=car_steer_assist_map1.lut ;可不受限制地添加更多助力映射表
```

**注意：**  
- 数值应将**驾驶者输入力矩映射为所应用的 ASSIST_TORQUE_MAX 比例**。  
- 用于帮助理解该系统工作原理的 Desmos：https://www.desmos.com/calculator/qjxnqdr4zx
- 可以定义任意数量的映射表（`ASSIST_MAP_2`、`ASSIST_MAP_3` 等）。

---

### 助力转向设置选项

在游戏内定义一个设置滑块，用于选择**助力转向助力映射表**（或助力级别）。  
滑块会出现在设置菜单中，位于所定义的标签页与名称之下。

**示例 —— `setup.ini`：**

```ini
[POWER_STEERING_SETTING]
SHOW_CLICKS=0
TAB=GENERAL
NAME=Power Steering
MIN=0    ;恒为 0，也可以使用 LUT 设置项
MAX=1    ;car.ini 中指定的最大索引
STEP=1
DEFAULT=0 ;默认映射表
POS_X=0.5
POS_Y=6
HELP="Power Steering Assist - Note: Power steering requires real steering forces to be enabled in CSP settings!"
```

---
---

## 齿条行程查找表  
将**转向齿条位移**定义为**方向盘转动角度**的函数。  
由此可以实现非线性的转向齿比行为（由于万向节的非线性以及随速度变化的齿条系统，这在真实汽车中很常见）。

**示例 —— `car.ini`（`[CONTROLS]` 段）：**

```ini
[CONTROLS]
RACK_TRAVEL_LUT=car_susp_rack_travel.lut ;方向盘角度（度）| 齿条行程（m）。自动镜像；无需提供负 X 值。
```

**注意：**  
- 查找表只需提供正转向角的数据——CSP 会自动镜像该表。  
- 可以精确模拟可变齿比转向齿条或万向节的非线性。
- 对于万向节，可以使用这个 Desmos 辅助工具：https://www.desmos.com/calculator/hhtnwqoaxv（胆小勿入）

---

