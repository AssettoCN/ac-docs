---
title: 节点调整
---


> 汉化标题：车辆 – 节点调整  
> 原文页面：Cars-–-Node-adjustments  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

可用于激活或停用节点（可将其视为网格和其他节点的父级），或将它们移动到别处。例如，一个很好的用法是把某个不慎遗留在“外部”的内饰网格移动到 COCKPIT_HR。

### 语法

```ini
[NODE_ADJUSTMENT_...]
NODES = list, of, nodes, and?or, f?lters
MOVE_TO = node_to_move_to  ; 可选，可为过滤器或多个条目
                           ; 若找到多个，将使用第一个
IS_ACTIVE = 1              ; 可选，开关整个节点
```

