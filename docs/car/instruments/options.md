---
title: 仪表选项
---

# 仪表选项（Instruments Options）

一些杂项仪表选项。

```ini
[INSTRUMENTS]
HAZARDS_G_THRESHOLD = -1  ; 设置自动开启危险灯的 G 力阈值（急刹车时）
SPEED_FIX = 1             ; 使用驱动轮的速度用于速度表
SPEED_LAG = 0.85          ; SPEED_FIX 选项的速度延迟
SPEED_LIMIT = 0           ; 如果大于零，用作 SPEED_FIX 选项的速度上限

[STATUS_BATTERY]
; 用于过度简化的电池电压估算的参数（用于仪表）
; 电池电压响应 RPM
BASE_VOLTAGE = 12.4  ; 基础电池电压
MAX_VOLTAGE = 13.6   ; 最大电池电压
RPM_LAG = 0.98       ; RPM 延迟

[STATUS_OIL]
; 类似的，用于仪表的过度简化估算
PRESSURE_BASE = 1.0         ; 怠速引擎的基础油压
PRESSURE_STEP = 1.0         ; 每 1000 RPM 的油压增加
PRESSURE_LAG_UP = 0.998     ; 油压增加延迟
PRESSURE_LAG_DOWN = 0.9985  ; 油压减少延迟

TEMPERATURE_MULT = 1.0         ; 油温与水温的关系
TEMPERATURE_RPM_FACTOR = 0.03  ; 每 1000 RPM 的油温额外增加
TEMPERATURE_LAG_UP = 0.995     ; 油温增加延迟
TEMPERATURE_LAG_DOWN = 0.995   ; 油温减少延迟
```

相关内容：
- [模拟仪表](./analog-instruments)
- [数字仪表](./digital-instruments)
- [LED 面板](./led-panels)
- [仪表输入](./inputs)

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Instruments-options) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
