---
title: 排气烟雾
---


> 汉化标题：车辆 – 排气烟雾  
> 原文页面：Cars-–-Exhaust-smoke  
> 原文锚点：dcc1beb  
> 汉化时间：2026-09-12T00:00:00+08:00  

排气烟雾模板（不完整）

可用参数：
```SPREAD, GROW, STARTING_SIZE, SPAWN_OFFSET, LIFE, SPEED, INTENSITY,  SPEED_THRESHOLD```  
请使用两个值而非一个。第一个用于滑行，第二个用于油门踩满（在应用 GAS_LAG 之后）。

```ini
[BASIC]
DIESEL_ENGINE = 0 		; 或 1

[PARTICLES_FX_EXHAUST_...]
POSITION = -0.56, 0.28, -2.1 		; 含义不言自明
DIRECTION = 0, 0.3, -1 			; 含义不言自明
COLOR = 0.75,0.8,1 			; RGB 混色——0,0,0 为黑色，1,1,1 为白色
LIFE = 1, 2 				; 粒子在空气中存留多久后消失
SPEED = 0.5, 1 				; 烟雾粒子从排气口喷出的速度
SPREAD = 0.25				; 粒子的初始扩散
STARTING_SIZE = 0.04			; 粒子的初始尺寸
SPAWN_OFFSET = 0.02			; 生成点的初始偏移（沿长度方向）
INTENSITY = 0.3, 0.5			; 烟雾浓度
TEMPERATURE_LAG = 1 			; 发动机预热（1 为禁用）
SPEED_THRESHOLD = 15, 100 		; 烟雾消失时的速度
```



默认值：
```cpp
float2 p_spread_k = {0.25f};
float2 p_grow_k = {-0.4f};
float2 p_starting_size = {0.03f};
float2 p_spawn_offset = {0.02f};
float2 p_life = {1.6f, 2.f};
float2 p_speed = {0.4f, 0.8f};
float2 p_intensity = {0.2f, 0.4f};
float2 p_temperature_threshold = {40.f, 60.f};
float2 p_speed_threshold = {5.f, 20.f};```

