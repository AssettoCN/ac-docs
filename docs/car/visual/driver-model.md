---
title: 驾驶员模型
---


> 汉化标题：车辆 – 驾驶员模型  
> 原文页面：Cars-–-Driver-model  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

影响驾驶员模型的若干选项。

### 带阴影的驾驶员

如果您没有使用 [顶点环境光遮蔽](https://github.com/ac-custom-shaders-patch/acc-bakeryoptix)，另一种避免驾驶员头部发亮的方法（没有遮蔽时，从车外摄像机看会显得过亮）是在驾驶员头部上方设置一个虚拟遮蔽球：

```ini
[SHADOWED_DRIVER]
OPACITY = 0.7       ; 阴影不透明度
OFFSET = 1          ; 球体距驾驶员头部的高度
RADIUS_INNER = 1    ; 内部完全阴影的半径
RADIUS_OUTER = 1.6  ; 外部完全无阴影的半径
```

### 替换驾驶员模型

对于使用不同驾驶员模型的自定义涂装，这项调整可能会很有用：

```ini
[DRIVER3D_MODEL]
NAME = driver_80  ; content/drivers 中的文件名（不含 “.kn5” 扩展名）

; 别忘了列出要隐藏的对象：
[DRIVER3D_HIDE_OBJECT_...]
NAME = DRIVER:HELMET_SUB0
```

