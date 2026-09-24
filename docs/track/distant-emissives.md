---
title: 远处发光体
---


> 汉化标题：赛道 – 远处发光体  
> 原文页面：Tracks-–-Distant-emissives  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：billboard 译作「公告板」（始终朝向摄像机的广告牌式面片）  

远处发光体（distant emissives）有助于减轻灯光随距离增大产生的闪烁。其工作方式是：找到一块自发光网格，生成一个发光的公告板（一个始终“朝向”摄像机的正方形），并随距离增大逐渐用该公告板取代常规的自发光。[对比截图](https://acstuff.ru/u/comparison/F7T)（注意原截图中光晕有多么不均匀）。

新的光晕由两部分组成：中心较小的光点和雾天中可见的大得多的公告板，从而像这样营造出一种低成本的雾气被照亮的效果：

![img](https://acstuff.ru/patch/screens/03_Distant%20emissives%20in%20fog.jpg)

### 语法

```ini
[INCLUDE: common/materials_track.ini]

[Material_DistantEmissive]
Meshes =                 ; 需要为其生成公告板的网格列表
UseAlpha = 0             ; 若原着色器为 ksPerPixelAlpha 则设为 1，这样会使用 alpha 属性
UseEmissiveTexture = 0   ; 设为 1 以使用 txEmissive 纹理
FloodlightPower = 0.0    ; 为泛光灯模式增大该值，这样当摄像机正对时自发光会增强
FloodlightEXP = 20.0     ; 增大可获得更聚焦的泛光灯效果
DistantGlowTextured = 1  ; 远处光晕使用 txDiffuse 的轻微模糊采样
BrightnessMult = 1.0     ; 亮度乘数
DotMaxDistance = 2000.0  ; 光点的最大距离（在一半距离处开始淡出）
```

其他参数可在 “common/materials_track.ini” 的 `[TEMPLATE: Material_DistantEmissive]` 中查看。不过我建议将其保持为默认值。

Custom Shaders Patch 生成公告板时使用了一种简单的聚类算法，以避免在距离过近的位置创建过多的发光区域。你可以按如下方式调整这些设置（请避免把数值降得太低，否则会损害性能）：

```ini
[DISTANT_GLOW]
THRESHOLD = 50 ; 单个网格内部的阈值
SHARED_THRESHOLD = 25 ; 所有网格之间共享的阈值：这样，网格 A 的发光区域就不会离网格 B 的发光区域太近
IGNORE_SHARED_THRESHOLD = 0 ; 忽略共享阈值；实在不推荐，如果紧凑空间里出现大量这类区域，FPS 可能会跌得太厉害，混合工作量会非常大
```

