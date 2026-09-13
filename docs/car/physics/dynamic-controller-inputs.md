---
title: 动态控制器新输入
---


> 汉化标题：车辆 – 动态控制器新输入  
> 原文页面：Cars-–-New-inputs-for-dynamic-controllers  
> 原文锚点：ca1fbaf  
> 汉化时间：2026-09-11T23:30:00+08:00  

CSP 新增了一些可用于动态物理控制器的输入（与 `LATG` 等既有输入并存）：

- `HEADLIGHTS`；
- `CLUTCH`；
- `HANDBRAKE`；
- `HORN`；
- `GEAR_ALT`：与原版 `GEAR` 不同，换挡时不会经过空挡；
- `LIGHT_EXTRA_A`；
- `LIGHT_EXTRA_B`；
- `LIGHT_EXTRA_C`；
- `LIGHT_EXTRA_D`；
- `LIGHT_EXTRA_E`（0.1.76 新增）；
- `LIGHT_EXTRA_F`（0.1.76 新增）；
- `AXLES_DIFFERENCE_RELATIVE`：车轴角速度的相对差（对各车轮角速度取平均）；
- `AXLES_DIFFERENCE_ABSOLUTE`：绝对差；
- `AXLES_DIFFERENCE_SIGNED`：前轴转速快于后轴时大于零；
- `FRONT_AXLE_DIFFERENCE_RELATIVE`：前轮角速度的相对差；
- `FRONT_AXLE_DIFFERENCE_ABSOLUTE`：绝对差；
- `FRONT_AXLE_DIFFERENCE_SIGNED`：左轮较快时大于零；
- `REAR_AXLE_DIFFERENCE_RELATIVE`：同上，但针对后轴；
- `REAR_AXLE_DIFFERENCE_ABSOLUTE`；
- `REAR_AXLE_DIFFERENCE_SIGNED`；
- `DAMAGE_ENGINE`：0 到 1（0.1.76 新增）；
- `DAMAGE_GEARBOX`：0 到 1（0.1.76 新增）；

此外，自 0.1.77 起，车辆物理可以使用 Lua 脚本：脚本能够访问车辆状态、执行计算并设置 8 个不同的值：

- `SCRIPT_0`；
- `SCRIPT_1`；
- `SCRIPT_2`；
- `SCRIPT_3`；
- `SCRIPT_4`；
- `SCRIPT_5`；
- `SCRIPT_6`；
- `SCRIPT_7`；

在 CSP 0.2.1 版本中，脚本控制器的数量增加到了 256 个（0-255）。

