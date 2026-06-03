---
title: 自定义射线检测
---

# 自定义射线检测

为了找到轮胎与地面接触的位置，AC 会向激光扫描（或非扫描）的网格投射光线。但在某些情况下，这可能不是最优的方式，例如如果你有高细节的 2D 地形高度图。现在你可以提供自定义射线检测器。

::: info 提示
此功能目前文档较少。如果你有高细节的赛道高度图数据，可以通过自定义射线检测器替代默认的网格射线投射来优化性能。
:::

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Custom-raycasting) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
