---
title: 引擎盖变形
---


> 汉化标题：车辆 – 引擎盖变形  
> 原文页面：Cars-–-Deforming-bonnets  
> 原文锚点：6d1c6f0  
> 汉化时间：2026-09-12T00:00:00+08:00  

通过移动引擎盖和后备箱盖顶点，使其呈现受损外观的简单技巧。适用于所有在受损时引擎盖本就会轻微弹开并晃动的车辆。

![实际效果](https://i.imgur.com/3nGbge1.png)

### 语法

```ini
[DEFORMING_HOOD]
NAME = MOTORHOOD          ; 包含所有待变形网格的父节点名称
MAX_DAMAGE = 40           ; km/h，默认 40
OFFSET_Y_MIDDLE = 0.04    ; 满损伤时中心处抬高的程度
OFFSET_Y_END = 0.02       ; 满损伤时远端抬高的程度
OFFSET_Z_END = 0.06       ; 远端偏移的距离
BULGING_EXTRA = 0.0       ; 增大将使形状不那么三角化、更接近梯形
BULGING_EXPONENT = 2.0    ; 影响隆起中心周围坡面的曲线
NOISE_Y_AMPLITUDE = -0.16 ; 中心处的简单垂直噪声
NOISE_Z_AMPLITUDE = 0.2   ; 以及远端的水平噪声
NOISE_Y_FREQUENCY = 7.0    ; 用于添加
NOISE_Z_FREQUENCY = 7.0    ; 一些随机化
Z_FACTOR = 2.5            ; 中心的判定方式
Z_BIAS = 0.0              ; 需要时用于手动偏移

[DEFORMING_REAR]
NAME = REARHOOD
; 其余参数相同
```

所有尺寸单位均为米。与视觉类功能一样，它并不追求物理精确，但反过来说，这也意味着可配置的范围更广。

注意：噪声会因车而异地偏移，以保持多样性，因此不要过于依赖其具体分布。

### 猜测

有些车并不需要此功能，例如装有宽大前保险杠的车辆。手动设置更保险，而且也花不了多少时间。因此，不做猜测。

### 稍后添加的功能

- 车门？
- 保险杠？

