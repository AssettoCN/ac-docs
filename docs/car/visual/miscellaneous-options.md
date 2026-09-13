---
title: 杂项选项
---


> 汉化标题：车辆 – 杂项选项  
> 原文页面：Cars-–-Miscellaneous-options  
> 原文锚点：9608d9f  
> 汉化时间：2026-09-12T00:00:00+08:00  

一批可能值得配置的小功能。

### 挡风玻璃横幅

<img src="https://files.acstuff.ru/shared/PR4w/20220611-193050.png" width=380>

如果您的车辆有半透明的挡风玻璃横幅，可以考虑使用 “materials_interior.ini” 中的 `[Material_WindscreenBanner]`。它会处理好一切，包括正确的 RainFX 集成、可选的背景模糊、彩色阴影与环境光以及遮罩通道。

### 车内摄像机视角下延迟渲染的网格

```ini
[INTERIOR_DELAYED_RENDER]
MESHES = 
MATERIALS = shader:ksWindscreen?, shader:ksBrokenGlass?
```

这些网格会被最后渲染，这样就不会对 ExtraFX 之类造成问题。

### 玻璃的侧边部分

<a href="https://acstuff.ru/u/comparison/APi" title="Click to see the comparison"><img src="https://files.acstuff.ru/shared/bhrc/20220611-211044-ks_silverstone1967-lotus_49.jpg" width=380></a>

材质 `[Material_Glass]` 有一项额外特性，可以对朝向某个局部点的特定区域进行不同的渲染。这对于 Lotus Type 49 之类的车辆很有用，可通过模糊玻璃背后的内容使玻璃边缘呈现不同效果。设置方法如下：

```ini
[INCLUDE]
INCLUDE = common/materials_glass.ini   ; 对应的模板

[Material_Glass]
Materials = glass_material
PROP_... = extEdgePosL, 0, 1, 0      ; 目视点
PROP_... = extEdgeThreshold, 0.5     ; look-at 阈值
PROP_... = extEdgeRefractionBias, 4  ; 玻璃背后内容的模糊程度
```

这样，所有朝向目视点超过阈值的面都会获得磨砂玻璃效果。将 `extEdgeRefractionBias` 设为负值可以调试 look-at 值。

以上是驾驶员位于封闭座舱内的车辆的默认设置（基于车辆高度图计算）。

