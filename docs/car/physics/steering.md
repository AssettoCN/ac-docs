---
title: 转向系统
---

# 转向系统（Steering）

## Real-Feel 转向

启用 CSP 的 *Real-Feel* 力反馈模块。

该模块将转向扭矩标准化到你的模拟方向盘的转向扭矩（在 CM 的 CSP 设置中指定），使你感受到的与模拟产生的 1:1 一致。

此系统还包括带有助力转向的车辆的助力转向模块。

**在 `car.ini` 中启用：**

```ini
[CONTROLS]
ENABLE_REAL_FEEL=1 ; 启用 CSP 的真实转向力。助力转向需要此选项。默认为无辅助扭矩。
```

---

## 助力转向系统

添加**电动或液压助力转向辅助**的模拟。

真实的转向力通过 Real-Feel 计算，然后 CSP 执行助力转向系统模拟，产生发送到你的方向盘基座的净扭矩。

### 最大辅助扭矩

```ini
ASSIST_TORQUE_MAX = 90 ; 系统的最大辅助扭矩，Nm
```

定义助力转向系统可以施加的扭矩**上限**。

值越高 = 辅助越强，转向感觉越轻。

---

### 转向辅助映射

查找表定义**助力转向系统如何响应驾驶员施加的扭矩**，输出 0–1 的辅助因子。

```ini
ASSIST_MAP_0=car_steer_assist_map0.lut ; 驾驶员扭矩 (Nm) | 辅助因子 (0–1)
ASSIST_MAP_1=car_steer_assist_map1.lut ; 允许无限制地添加额外的辅助映射
```

**注意：**
- 值应映射**驾驶员输入扭矩 → 应用的 ASSIST_TORQUE_MAX 比例**。
- Desmos 帮助可视化系统工作方式：https://www.desmos.com/calculator/qjxnqdr4zx
- 你可以定义任意数量的映射（`ASSIST_MAP_2`、`ASSIST_MAP_3` 等）。

---

### 助力转向设置选项

定义一个游戏内设置滑块，用于选择**助力转向辅助映射**（或辅助级别）。

出现在设置菜单的指定标签和命名下。

**示例 — `setup.ini`：**

```ini
[POWER_STEERING_SETTING]
SHOW_CLICKS=0
TAB=GENERAL
NAME=Power Steering
MIN=0    ;始终为 0，也可以使用 LUT 设置选项
MAX=1    ;car.ini 中指定的最大索引
STEP=1
DEFAULT=0 ;默认映射
POS_X=0.5
POS_Y=6
HELP="Power Steering Assist - Note: Power steering requires real steering forces to be enabled in CSP settings!"
```

---

---

## 齿条行程查找表

定义**转向齿条位移**作为**方向盘旋转**的函数。

这允许非线性的转向比行为（在实际车辆中很常见，由于万向节非线性和变速齿条系统）。

**示例 — `car.ini`（`[CONTROLS]` 部分）：**

```ini
[CONTROLS]
RACK_TRAVEL_LUT=car_susp_rack_travel.lut ; 方向盘度数 | 齿条行程 (m)。自动镜像；不需要负 X 值。
```

**注意：**
- LUT 仅期望正向转向角度的值——CSP 自动镜像表格。
- 允许精确模拟可变比转向齿条或万向节非线性。
- 对于万向节，可以使用此 Desmos 辅助工具：https://www.desmos.com/calculator/hhtnwqoaxv（不适合胆小者）

相关内容：[悬挂系统](./suspension)、[启用扩展物理](./enabling)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Steering) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
