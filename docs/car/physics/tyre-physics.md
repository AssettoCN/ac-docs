---
title: 轮胎物理
---

# 轮胎物理（Tyre Physics）

## 轮胎碰撞检测和接触面移动的扩展光线追踪

**在 `tyres.ini` 中启用：**

```ini
[_EXTENSION]
LATERAL_RAYS=0            ;每侧，0 表示中间 1 条
LONGITUDINAL_RAYS=4       ;每侧，0 表示中间 1 条
MAX_RAY_ANGLE=60          ;每侧扫过的角度
DISABLE_RAY_DOUBLING=0    ;设为 1 禁用低速光线加倍（有助于性能）
```

---

## 载荷灵敏度平滑

```ini
[_EXTENSION]
SMOOTH_LOAD_SENS = 1    ;设为 0 去除载荷灵敏度 LUT 的三次插值，可以帮助避免某些 LUT 形状的问题。
```

---

## 确定性侧壁偏转

从横向和纵向接触面偏转（0.3.0 后）添加垂直偏转（0.3.0 前）。注意，解决方案是确定性的（偏转直接从力推导），因为 AC 的 333Hz 无法进行适当的模拟。

### 示例（`tyres.ini`）

```ini
[FRONT]
SIDEWALL_K_MULT=1.0   ; 横向刚度的垂直率乘数
SIDEWALL_K_MULT_X=2.0 ; 纵向刚度的垂直率乘数
```

---

## 热模型扩展

通过添加胎体温度和改进的传热建模来改进 AC 的轮胎热模型。

*参数变得更现实但也更难调校。*

### 示例实现（`tyres.ini`）

*仅显示扩展相关参数。所有 Kunos 参数仍然需要。*

```ini
[THERMAL_MODEL]
VERSION = 1 ; 热模型版本。当前版本：1, 2。V2 与扩展光线配合使用以动态计算左右温度分布，并更改了一些计算。


[THERMAL_FRONT] ; Kunos 参数（部分重新用途化）
SURFACE_TRANSFER=0.93          ; 从赛道到轮胎表面的冷却率
PATCH_TRANSFER=0.002           ; 胎面上的横向热分布
CORE_TRANSFER=0                ; 已弃用
INTERNAL_CORE_TRANSFER=0       ; 已弃用
FRICTION_K=0.0127              ; 摩擦产生的热量
ROLLING_K=0                    ; 已弃用
PERFORMANCE_CURVE=tcurve_1.lut ; 摄氏度 | 抓地力乘数
COOL_FACTOR=8                  ; SURFACE_TO_AMBIENT 的速度²缩放乘数
SURFACE_ROLLING_K=0.001        ; 内部胎面阻力产生的热量


[THERMAL2_FRONT] ; 新 CSP 参数
CARCASS_ROLLING_K=0.15         ; 滚动阻力 → 胎体热量
BRAKE_TO_CORE=0.0006           ; 刹车热量 → 内部空气
SURFACE_TO_AMBIENT=0.076       ; 表面 → 空气
SURFACE_TO_CARCASS=0.023       ; 表面 → 胎体
CARCASS_TO_SURFACE=0.61        ; 胎体 → 表面
CARCASS_TO_CORE=0.025          ; 胎体 → 内部空气
CORE_TO_CARCASS=0.0005         ; 核心 → 胎体
CORE_TO_AMBIENT=0.002          ; 核心 → 环境（通过轮毂）
```

---

## 温度相关的滑移下降曲线

下降与温度的查找表。

⚠ **注意：** 在轮胎测试仪应用中无法正确显示。

### 示例（`tyres.ini`）

```ini
[FRONT] ; 或任何配方
FALLOFF_LEVEL=0.7
FALLOFF_LEVEL_CURVE=tyres_fall_level.lut ; temp | falloff_level
FALLOFF_SPEED=1.5
FALLOFF_SPEED_CURVE=tyres_fall_speed.lut ; temp | falloff_speed
```

---

## 实际温度比

控制计算抓地力时表面和胎体/核心温度之间的权重。

### 示例（`tyres.ini`）

```ini
[_EXTENSION]
PRACTICAL_TEMP_RATIO = 0.25 ; 0 = 仅胎体/核心，1 = 仅表面（AC 默认 = 0.25）
```

---

## 外倾角对弹簧率的影响

基于查找表应用乘数。

### 示例（`tyres.ini`）

```ini
[FRONT]
CAMBER_SPRING_MULT = camber_sr.lut ; 度 | 弹簧率乘数
```

---

## 载荷对滚动半径的影响

Kunos 将滚动半径视为常数；此修正了该行为。

### 示例（`tyres.ini`）

```ini
[FRONT]
ROLLING_RADIUS_MULT=0.1 ; 应用于滚动半径的偏转比例（0–1）
```

---

## 车轮速度的二次径向增长

为高角速度下的轮胎增长添加二次项。

### 示例（`tyres.ini`）

```ini
[FRONT]
RADIUS_ANGULAR_K_2=0.05
; radius_add = (K2/1e6)*ω² + (RADIUS_ANGULAR_K/1000)*ω
```

---

## 外倾角对纵向抓地力的调整

二次外倾角 → DX 缩放。

### 示例（`tyres.ini`）

```ini
[FRONT]
DX_CAMBER_REF=3   ; 参考外倾角（度）— 不得为 0
DX_CAMBER_MULT=0.98 ; 参考角度处的乘数
```

---

## 额外滑移参数

用于塑造滑移下降行为。

### 示例（`tyres.ini`）

```ini
[FRONT]
DROPOFF_FACTOR_0=60 ; 可在 https://www.desmos.com/calculator/dtlzovroom 可视化
DROPOFF_FACTOR_1=1
```

相关内容：[启用扩展物理](./enabling)、[牵引力控制](./traction-control)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Tyre-Physics) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
