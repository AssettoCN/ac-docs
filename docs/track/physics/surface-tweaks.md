---
title: 表面微调
---

# 表面微调

除了常规的表面属性（如 `FRICTION` 或 `DAMPING`）之外，CSP 还新增了一些额外的属性。

## 可用属性

- `_EXT_SURFACE_TYPE`：表面类型（覆盖基于 `WAV` 的猜测）。
  - `EXTRATURF`
  - `GRASS`
  - `GRAVEL`
  - `KERB`
  - `OLD`
  - `SAND`
  - `ICE`（0.2.5 新增）
  - `SNOW`（0.2.5 新增）

- `_EXT_SURFACE_TYPE_MODIFIER`：调整 SurfacesFX 对沙地、草地和砾石的行为。默认值为 `REGULAR`。
  - `LOOSE`
  - `REGULAR`
  - `FIRM`

- `_EXT_PERLIN_NOISE`：设为 0 确保使用正弦噪声（尽管 CSP 设置），或设为 1 将正弦噪声替换为柏林噪声（`SIN_HEIGHT` 和 `SIN_LENGTH` 仍会使用，但用于柏林噪声）。

- `_EXT_PERLIN_OCTAVES`：柏林噪声的八度数，从 1 到 10。

- `_EXT_PERLIN_PERSISTENCE`：柏林噪声的持久度（后续八度的振幅乘数）。

::: info 注意
如果表面类型未显式设置，SurfacesFX 砾石效果（如果 SurfacesFX 模块已启用，或存在任何 `TYPE_HINT=GRAVEL` 的轮胎）将在以下条件下激活：
- `DIRT_ADDITIVE ≥ 0.7` 的表面，或
- `DIRT_ADDITIVE ≥ 0.3` 且（`FRICTION < 0.9` 或 `WAV` 设置为 "grass.wav"、"gravel.wav" 或 "sand.wav"）的表面。
:::

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Surface-tweaks) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
