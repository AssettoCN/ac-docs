---
title: 仪表选项
---


> 汉化标题：车辆 – 仪表选项  
> 原文页面：Cars-–-Instruments-options  
> 原文锚点：780b077  
> 汉化时间：2026-09-12T00:00:00+08:00  

一些零散的仪表选项，不值得各自单独开一个页面。

```ini
[INSTRUMENTS]
HAZARDS_G_THRESHOLD = -1  ; 设置急刹车时危险警示灯自动点亮的 G 力阈值
SPEED_FIX = 1             ; 速度表采用驱动轮速度
SPEED_LAG = 0.85          ; SPEED_FIX 选项的速度滞后
SPEED_LIMIT = 0           ; 大于 0 时，作为 SPEED_FIX 选项的速度上限

[STATUS_BATTERY]
; 用于仪表的极简电瓶电压估算参数
; 电瓶电压随 RPM 变化
BASE_VOLTAGE = 12.4  ; 基准电瓶电压
MAX_VOLTAGE = 13.6   ; 最大电瓶电压
RPM_LAG = 0.98       ; RPM 滞后

[STATUS_OIL]
; 类似的东西，用于仪表的极简估算
PRESSURE_BASE = 1.0         ; 发动机怠速时的基准机油压力
PRESSURE_STEP = 1.0         ; 每 1000 RPM 增加的机油压力
PRESSURE_LAG_UP = 0.998     ; 机油压力上升滞后
PRESSURE_LAG_DOWN = 0.9985  ; 机油压力下降滞后

TEMPERATURE_MULT = 1.0         ; 机油温度与水温的比值关系
TEMPERATURE_RPM_FACTOR = 0.03  ; 每 1000 RPM 额外增加的机油温度
TEMPERATURE_LAG_UP = 0.995     ; 机油温度上升滞后
TEMPERATURE_LAG_DOWN = 0.995   ; 机油温度下降滞后
```

