---
title: 排气烟雾
---

# 排气烟雾（Exhaust Smoke）

排气烟雾模板。

## 可用参数

可用参数：`SPREAD`、`GROW`、`STARTING_SIZE`、`SPAWN_OFFSET`、`LIFE`、`SPEED`、`INTENSITY`、`SPEED_THRESHOLD`

使用两个值而不是一个。第一个用于滑行，第二个用于完全踩油门（在应用 `GAS_LAG` 之后）。

```ini
[BASIC]
DIESEL_ENGINE = 0 		; 或 1

[PARTICLES_FX_EXHAUST_...]
POSITION = -0.56, 0.28, -2.1 		; 位置
DIRECTION = 0, 0.3, -1 			; 方向
COLOR = 0.75,0.8,1 			; RGB 混合 - 0,0,0 为黑色，1,1,1 为白色
LIFE = 1, 2 				; 粒子在空中持续时间（秒），然后消失
SPEED = 0.5, 1 				; 烟雾粒子从排气管飞出的速度
SPREAD = 0.25				; 粒子初始扩散
STARTING_SIZE = 0.04			; 粒子初始大小
SPAWN_OFFSET = 0.02			; 初始生成点偏移（沿长度方向）
INTENSITY = 0.3, 0.5			; 烟雾强度
TEMPERATURE_LAG = 1 			; 发动机加热（1 禁用）
SPEED_THRESHOLD = 15, 100 		; 烟雾消失的速度
```

## 默认值

```ini
; 参考默认值（C++ 内部值）
p_spread_k = 0.25
p_grow_k = -0.4
p_starting_size = 0.03
p_spawn_offset = 0.02
p_life = 1.6, 2.0
p_speed = 0.4, 0.8
p_intensity = 0.2, 0.4
p_temperature_threshold = 40.0, 60.0
p_speed_threshold = 5.0, 20.0
```

相关内容：[排气管火焰](./exhaust-flames)、[车辆通用选项](./general-options)（`DIESEL_ENGINE` 设置）。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Exhaust-smoke) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
