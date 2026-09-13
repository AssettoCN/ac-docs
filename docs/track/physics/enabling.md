---
title: 启用扩展物理
---


> 汉化标题：赛道 – 启用扩展物理  
> 原文页面：Tracks-–-Enabling-extended-physics  
> 原文锚点：2b0da25  
> 汉化时间：2026-09-11T23:59:00+08:00  

为确保所有人都在相同的条件下比赛，在使用任何扩展赛道物理功能之前，你需要先启用扩展物理。为此，打开 `surfaces.ini`，找到 `[SURFACE_0]` 节中的 `WAV_PITCH`，并在其值前添加 `extended-`，如下所示：

```ini
[SURFACE_0]
KEY=PITS
…
WAV_PITCH=extended-0
…
```

其原理是：原版 AC 遇到这个 `WAV_PITCH` 值会直接崩溃（因为它无法将该值解析为整数）。而 Custom Shaders Patch 会捕获这个值，阻止 AC 崩溃，并标记该赛道可以使用扩展物理。而大多数线上服务器进行完整性校验时，检查的正是这个文件。

