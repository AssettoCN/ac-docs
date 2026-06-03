---
title: 火花效果
---

# 火花效果（Sparks）

火花在碰撞时从碰撞点沿赛道碰撞器表面切面发射。嗯，理论上是这样的。

实际上，粒子的行为、外观和寿命可以针对不同的碰撞器进行调整。默认情况下，补丁对常规车辆使用类似钢的火花，并假设开放式车轮的车身由碳纤维制成，因此它们不会从常规碰撞中产生火花。补丁还会尝试找到用于滑板区的碰撞器（应该在 X 轴上居中，长度超过 1.8 米，宽度不到 1 米），并将 1994 年之前制造的汽车视为钢制，2014 年之后制造的汽车视为钛制。当然，许多这些设置可以通过配置明确设置，但一如既往，我建议尽可能少地设置，保持语义而不是设置颜色等。

由于大多数设置是碰撞器特定的，你也可以在 `data/colliders.ini` 中设置它们。

## 语法

```ini
[PARTICLES_FX]
SPARKS_AS = STEEL 			; 所有碰撞器的基础材质标签，包括 collider.kn5
BODY_SPARKS_AS = CARBON 	; collider.kn5 的材质标签
COLLIDER_0_SPARKS_AS = TITANIUM, SKIDPAD ; colliders.ini 中 COLLIDER_0 的材质标签
COLLIDER_1_SPARKS_AS = IRON ; colliders.ini 中 COLLIDER_1 的材质标签
```

## 材质标签说明

- `STEEL`：钢质火花
- `CARBON`：碳纤维（不产生火花）
- `TITANIUM`：钛质火花
- `IRON`：铁质火花
- `SKIDPAD`：标记为滑板区

## 自动猜测

语法段落中列出的设置是所有车辆默认使用的设置。

相关内容：[车轮设置](./wheels)、[车辆通用选项](./general-options)（`SPARKS_UPWARDS_FORCE` 设置）。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Sparks) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
