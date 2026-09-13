---
title: 复古转速表
---


> 汉化标题：车辆 – 复古转速表  
> 原文页面：Cars-–-Vintage-tachometers  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

首先说明：这不是 bug，[它们本来就是这样工作的](https://www.youtube.com/watch?v=klptXsXwCjI)。:D

当然，如有需要，也可以在补丁设置中禁用它。这套机制可让转速表逐格跳动，并为其指针赋予一定的惯性，[这在其他一些场景下可能也很有用](https://youtu.be/qlwNLkbd9lQ?t=108)。

### 语法

```ini
[INSTRUMENTS]
RPM_VINTAGE = 0              ; 设为 1 启用整套功能
RPM_VINTAGE_ROUND_TO = 413   ; 指针应吸附到的 RPM 值
RPM_VINTAGE_DELAY = 0.5      ; 两次更新之间的延迟
RPM_VINTAGE_SPEED_LAG = 0.4  ; 惯性值，从 0 到 1（为 1 时指针不动）
RPM_VINTAGE_LIMIT = 0        ; 如有需要，设为某个值以添加上限
```

这些设置得到的是脉冲式转速表。如果你希望指针不是生硬跳格，而是因惯性而来回摆动，可以使用类似这样的配置：

```ini
[INSTRUMENTS]
RPM_VINTAGE = 1
RPM_VINTAGE_ROUND_TO = 1
RPM_VINTAGE_DELAY = 0
RPM_VINTAGE_SPEED_LAG = 0.95
```

可以在比赛或回放过程中修改这些设置，以便更细致地调校。

### 猜测

猜测器会为 1947 至 1983 年的赛车启用该功能（内部还有更多条件，取决于车辆是否为开放式车轮，以及其制造国），或为 1955 至 1969 年制造的英国街道车启用。当然这不是一套完美的系统，但总体上是有效的，个别车型也总可以用配置解决。如果你对如何改进它有任何建议，请告诉我们。

