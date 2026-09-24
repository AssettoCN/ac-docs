---
title: CSP 功能
---


> 汉化标题：通用 – CSP 功能  
> 原文页面：General-–-CSP-features  
> 原文锚点：b47d954  
> 汉化时间：2026-09-12T19:00:00+08:00  

Custom Shaders Patch 被拆分为多个可以禁用的模块。不过，也有少数选项不属于任何模块，还有些功能无法禁用。

# 模块

## Lighting FX

为赛道灯光和车灯（例如大灯）添加动态光照。赛道灯光由赛道配置设定；车灯既可以在配置中定义，若未定义，则会基于模型、贴图以及制造年份等各种参数自动猜测。使用 [BVH 加速着色](https://worldoffries.wordpress.com/2015/02/19/simple-alternative-to-clustered-shading-for-thousands-of-lights/) 来加快渲染速度，允许同时渲染数百盏灯。

灯光类型：
- 点光源；
- 聚光灯；
- 供车辆大灯使用的双裁剪聚光灯；
- 线光源（虽然不算很精确），用于车底霓虹灯之类的场景。

计划中：
- 尝试 Forward+？
- IES 贴图；
- 动态阴影。

## Extra FX

增加一个额外的渲染 pass 来获取有关场景的更多信息，例如场景法线贴图、深度或运动缓冲区。有了这些信息，就可以实现新的效果：

- 局部反射（SSLR）；
- 环境光遮蔽（SSAO，或者多亏 NVIDIA 才有的 HBAO+）；
- 新的运动模糊；
- 时域抗锯齿；
- 简单的局部光线反弹（SSGI）；
- [场景光线反弹](https://youtu.be/R9gsC5vB1Eg)（非屏幕空间）；
- 体积光；
- 雾模糊。

<a href="https://i.imgur.com/as1FEAj.png" target="_blank" title="Volumetric lights"><img src="https://i.imgur.com/as1FEAj.png" width="400"></a>

# 杂项调整

嗯，看来写这篇文章所花的时间要比当初开发这东西本身还要长……

