---
title: 智能后视镜
---


> 汉化标题：车辆 – 智能后视镜  
> 原文页面：Cars-–-Smart-Mirror  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

智能后视镜扩展为后视镜添加了一些实用的功能。最主要的当然是由 henter 开发的 Real Mirrors（真实后视镜），这个惊艳的功能把所有后视镜共用的单个反射替换为各自独立的反射，在反射中加入可见的车辆，甚至能针对相机位置做精确校正。

### 语法

针对车辆可用的调整选项有若干项：

```ini
[SMART_MIRROR]
DISALLOW_REFLECTION_TILTING = 1     ;禁用简单的倾斜效果（适用于带显示器的车辆）
DISALLOW_MAPPING_NORMALIZATION = 1  ;自 0.1.49 起，Custom Shaders Patch 默认会自动重映射后视镜的 UV
  ;以确保纵横比正确。将此值设为 1 可为特定车辆禁用该行为。
  ;更改后需要重新加载 AC。

; 真实后视镜的选项：
[REAL_MIRROR_N]  ;N 为后视镜索引
ROTATION = 0, 0  ;旋转
FOV = 10         ;视场角（度）
ASPECT_MULT = 1  ;纵横比乘数
IS_MONITOR = 0   ;设为 1 使后视镜作为显示器工作
FLIP = 0         ;设为 1 翻转后视镜

USE_MONITOR_SHADER = 0           ;设为 1 使用显示器着色器，相机过近时可以看到像素
MONITOR_SHADER_SCALE = 400, 100  ;调整显示器着色器的像素密度
MONITOR_SHADER_TYPE = 0          ;设为 1 为显示器使用 IPS 面板，不产生色偏
```

玩家之后可以按照自己的喜好重新调整真实后视镜。

### 猜测

- 如果任意真实后视镜设置了 `IS_MONITOR = 1`，默认将禁用简单的倾斜效果；
- 对于 2015 年后制造的任何车辆，IPS 面板为默认设置。

