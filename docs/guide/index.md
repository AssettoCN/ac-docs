---
title: 简介
---

# 指南

欢迎来到 **神力科莎（Assetto Corsa）CSP 开发指南**。

Custom Shaders Patch（CSP）是 Assetto Corsa 最强大的扩展补丁，为游戏带来了高级光照、天气系统、物理扩展、视觉特效等大量功能。本指南将帮助你快速掌握 CSP 配置开发。

## 这是给谁看的？

- 想为 AC 车辆/赛道添加 CSP 视觉效果的 **模组制作者**
- 想了解 INIpp 配置语法的 **开发者**
- 想调优 CSP 参数的 **玩家**

## 学习路径

### 1. 了解配置格式

CSP 使用扩展的 INI 格式 —— **INIpp**。它支持变量、模板、Lua 表达式等高级特性。

→ [INIpp 基础语法](/inipp/basic-syntax) · [变量与表达式](/inipp/variables) · [模板与混入](/inipp/templates)

### 2. 车辆配置

从基础的 `ext_config.ini` 开始，为车辆添加灯光、轮胎效果、仪表盘等。

→ [基础选项](/car/visual/general-options) · [灯光系统](/car/visual/lights) · [轮胎效果](/car/visual/tyres-fx)

### 3. 赛道配置

为赛道添加 GrassFX 草地、RainFX 雨天、动画对象、条件系统等。

→ [基础选项](/track/general-options) · [GrassFX](/track/grass-fx) · [RainFX](/track/rain-fx) · [条件系统](/track/conditions)

### 4. 技巧与排错

→ [过滤系统](/general/filtering) · [Shader 替换](/general/shader-replacements) · [故障排除](/general/troubleshooting)

## 纯参考文档

如果你已经熟悉基础知识，需要查找具体参数，请使用顶部导航的 **参考** 菜单：

- [车辆视觉参考](/car/visual/general-options) — 灯光、仪表、轮胎、排气等全部参数
- [车辆物理参考](/car/physics/powertrain) — 动力、悬挂、转向、轮胎物理
- [赛道配置参考](/track/general-options) — GrassFX、RainFX、树木、水面
- [通用参考](/general/) — 过滤、Shader 替换、场景查询等
- [Python API](/python/new-functions) · [服务器配置](/server/options) · [自定义 AI](/custom-ai/)

## 参考配置

学习已有配置是最好的方式。以下是一些带注释的参考配置：

- **车辆**: [RUF Yellowbird](https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/master/config/cars/kunos/ruf_yellowbird.ini) · [BMW M3 E30](https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/master/config/cars/kunos/bmw_m3_e30.ini)
- **赛道**: [Brands Hatch](https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/master/config/tracks/ks_brands_hatch.ini) · [Nordschleife](https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/master/config/tracks/ks_nordschleife.ini)
