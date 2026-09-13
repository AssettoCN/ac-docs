---
title: 表面调整
---


> 汉化标题：赛道 – 表面调整  
> 原文页面：Tracks-–-Surface-tweaks  
> 原文锚点：b970c57  
> 汉化时间：2026-09-11T23:59:00+08:00  
> 译注：octave 译作「倍频」，persistence 译作「持续度」  

除了 `FRICTION`、`DAMPING` 等常规表面属性外，CSP 现在还添加了一些额外的属性。

- `_EXT_SURFACE_TYPE`：表面类型（覆盖基于 `WAV` 的猜测）。
  - `EXTRATURF`；
  - `GRASS`；
  - `GRAVEL`；
  - `KERB`；
  - `OLD`；
  - `SAND`；
  - `ICE`（0.2.5 新增）；
  - `SNOW`（0.2.5 新增）。
- `_EXT_SURFACE_TYPE_MODIFIER`：调整 SurfacesFX 在沙地、草地和碎石上的行为。默认值为 `REGULAR`。
  - `LOOSE`；
  - `REGULAR`；
  - `FIRM`。
- `_EXT_PERLIN_NOISE`：设为 0 可确保无视 CSP 设置、始终使用正弦噪声；设为 1 则用 Perlin 噪声替换正弦噪声（`SIN_HEIGHT` 和 `SIN_LENGTH` 仍会被使用，只是改为作用于 Perlin 噪声）。
- `_EXT_PERLIN_OCTAVES`：Perlin 噪声的倍频数，范围为 1 到 10。
- `_EXT_PERLIN_PERSISTENCE`：Perlin 噪声的持续度（后续倍频的振幅乘数）。

注意：如果未显式设置表面类型，SurfacesFX 的碎石效果（在启用了 SurfacesFX 模块，或存在任何带有 `TYPE_HINT=GRAVEL` 的轮胎时）将作用于 `DIRT_ADDITIVE ≥ 0.7` 的表面，或 `DIRT_ADDITIVE ≥ 0.3` 且（`FRICTION < 0.9` 或 `WAV` 设为 “grass.wav”、“gravel.wav” 或 “sand.wav”）的表面。

