---
title: 轮胎物理
---


> 汉化标题：车辆 – 轮胎物理  
> 原文页面：Cars-–-Tyre-Physics  
> 原文锚点：5d5983f  
> 汉化时间：2026-09-11T22:40:00+08:00  
> 译注：compound 译作「配方」（指轮胎胶料）；slip 译作「滑移」；上游已将热模型拆分至独立页《车辆 – 轮胎热模型》

## 轮胎碰撞检测与接触面移动的扩展光线追踪

**在 `tyres.ini` 中启用：**

```ini
[_EXTENSION]
LATERAL_RAYS=0            ;每侧数量，0 表示仅在中间 1 条
LONGITUDINAL_RAYS=4       ;每侧数量，0 表示仅在中间 1 条
MAX_RAY_ANGLE=60          ;每侧扫描的角度（度）
DISABLE_RAY_DOUBLING=0    ;设为 1 禁用低速光线加倍（有利于性能）
```

---

## 麦克斯韦迟滞阻尼（0.3.0 新增）

```ini
[FRONT]
SIDEWALL_LOSS_FACTOR_Z=0.1  ;与 Kunos 粘性阻尼叠加；建议 KS 阻尼初始取 0
```

---

## 负载敏感性平滑

```ini
[_EXTENSION]
SMOOTH_LOAD_SENS = 1    ;设为 0 可取消负载敏感性查找表的三次插值，有助于规避某些查找表形状引发的问题
```

---

## 确定性侧壁变形

由横向与纵向接触面变形（0.3.0 起）叠加生成垂直变形（0.3.0 前参数）。注意该解是确定性的（变形直接由力推导得出），因为 AC 以 333Hz 运行，无法进行真正的仿真。

### 示例（`tyres.ini`）

```ini
[FRONT]
SIDEWALL_K_MULT=1.0   ;横向刚度相对垂直刚度的乘数
SIDEWALL_K_MULT_X=2.0 ;纵向刚度相对垂直刚度的乘数
```

---

## 温度相关的滑移衰减曲线

温度与衰减程度的查找表。
⚠ **注意：**在轮胎测试器 App 中*无法*正确显示。

### 示例（`tyres.ini`）

```ini
[FRONT] ;或任意配方
FALLOFF_LEVEL=0.7
FALLOFF_LEVEL_CURVE=tyres_fall_level.lut ;温度 | 衰减程度
FALLOFF_SPEED=1.5
FALLOFF_SPEED_CURVE=tyres_fall_speed.lut ;温度 | 衰减速度
```

---

## 实用温度比

控制计算抓地力时表面温度与胎体/核心温度之间的权重。

### 示例（`tyres.ini`）

```ini
[_EXTENSION]
PRACTICAL_TEMP_RATIO = 0.25 ;0 = 仅核心/胎体，1 = 仅表面（AC 默认 = 0.25）
```

---

## 弹簧刚度随外倾角变化

基于查找表施加乘数。

### 示例（`tyres.ini`）

```ini
[FRONT]
CAMBER_SPRING_MULT = camber_sr.lut ;度 | 弹簧刚度乘数
```

---

## 滚动半径随负载变化

Kunos 将滚动半径视为常数；本项修正了这一行为。

### 示例（`tyres.ini`）

```ini
[FRONT]
ROLLING_RADIUS_MULT=0.1 ;变形施加到滚动半径的比例（0–1）
```

---

## 径向增长随轮速的二次项

为高角速度下的轮胎增长增加二次项。

### 示例（`tyres.ini`）

```ini
[FRONT]
RADIUS_ANGULAR_K_2=0.05
; radius_add = (K2/1e6)*ω² + (RADIUS_ANGULAR_K/1000)*ω
```

---

## 纵向抓地力随外倾角调整

外倾角到 DX 缩放的二次映射。

### 示例（`tyres.ini`）

```ini
[FRONT]
DX_CAMBER_REF=3   ;参考外倾角（度）——不得为 0
DX_CAMBER_MULT=0.98 ;参考角度处的乘数
```

---

## 附加滑移参数

用于塑造滑移衰减行为。

### 示例（`tyres.ini`）

```ini
[FRONT]
DROPOFF_FACTOR_0=60 ;可在 https://www.desmos.com/calculator/dtlzovroom 可视化
DROPOFF_FACTOR_1=1
```

---

