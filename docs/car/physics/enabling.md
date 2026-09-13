---
title: 启用扩展物理
---


> 汉化标题：车辆 – 启用扩展物理  
> 原文页面：Cars-–-Enabling-extended-physics  
> 原文锚点：2de1619  
> 汉化时间：2026-09-11T23:30:00+08:00  

与所有其他专注于兼容原版 AC 的特性不同，所有物理扩展都需要经过专门修改的车辆数据：这样一来，现有车辆的行为不会有任何改变，而使用了新特性的车辆在没有该补丁的 AC 中将无法运行。

有关新特性的支持，可在 AC Custom Shaders Discord 服务器的 cphys-support-only 或 mod-talk 频道获取。

请参阅各个页面（空气动力学、悬挂等），了解各项特性及其实装方式。注：所有特性列表和示例代码都会尽可能地保持最新——已弃用的特性将不再提供支持。

---

为确保所有人都在相同的条件下比赛，要使用扩展车辆物理的任何特性，都需要先启用扩展物理。为此，打开 `car.ini`，找到 `[HEADER]` 段，并在 `VERSION` 值前面加上 `extended-` 前缀，如下所示：

```ini
[HEADER]
VERSION=extended-2
```

用于版本锁定（仅限 1.74+）：

```ini
[HEADER]
VERSION=extendedV2-1 ;末尾仍然可以为 1 或 2

[_EXTENSION]
REQUIRED_VERSION=2142 ;此处以 1.79 的版本代码为例。可在 CM->Settings->CSP->About 中轻松找到，名为 "Shaders Patch version ID"
```

其原理是：原版 AC 如果遇到这样的 `VERSION` 值就会崩溃（因为它无法将该值解析为整数）。而 Custom Shaders Patch 则会捕获该值，阻止 AC 崩溃，并将正在加载的车辆标记为可以使用扩展物理的车辆。

