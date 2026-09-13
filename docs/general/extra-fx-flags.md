---
title: Extra FX 标志
---


> 汉化标题：通用 – Extra FX 标志  
> 原文页面：General-–-Extra-FX-flags  
> 原文锚点：d57c0bb  
> 汉化时间：2026-09-12T19:00:00+08:00  

Extra FX 是 Custom Shaders Patch 的另一个扩展，它基于场景的深度和法线信息添加了大量屏幕空间效果，例如局部反射、SSAO、反射光、体积大灯或时间抗锯齿。为了让整个系统正常工作，它需要（在主渲染通道之前）第二次渲染场景，以准备法线缓冲区以及诸如运动模糊所用的运动缓冲区、SSLR 所用的反射信息等额外数据。

# 关于不透明的透明表面与车窗

这些效果在此处的实现方式是：为了处理车窗和类似表面，几乎所有这些透明表面都会被渲染到那些 Extra FX 缓冲区中，因此它们显示为不透明。一个例外是从车内看到的车窗：默认情况下它们不会被渲染到 Extra FX 缓冲区中，甚至会被排除在主渲染通道之外，只在 Extra FX 效果应用完毕后才绘制。可以想象，这样一来它们会盖住所有效果，但对于车内视角来说，这通常是更理想的行为。

举个例子，以下是原始场景：

[![Original shot](https://i.imgur.com/XT3669h.jpg)](https://i.imgur.com/XT3669h.jpg)

以下是它在 Extra FX 缓冲区中的样子：

[![AO and bounced light](https://i.imgur.com/Hv9Olci.jpg)](https://i.imgur.com/Hv9Olci.jpg)
[![Local reflections](https://i.imgur.com/Kh9H7R8.jpg)](https://i.imgur.com/Kh9H7R8.jpg)

因此，Extra FX 不会影响玻璃后面的任何东西，车窗的反射可能看起来有些奇怪，但请注意侧后视镜是如何映在侧窗中的，同时侧窗又映在侧后视镜中。可以将其与《黑手党 3》（Mafia 3）中的反射对比一下：

[![Screenshot from https://mafiagame.com/](https://i.imgur.com/QmyW1rs.jpg)](https://i.imgur.com/QmyW1rs.jpg)

好，言归正传。有时你可能想要改变这一行为。比如挡风玻璃前的弹出式仪表被错误地施加了运动模糊，或者某些大灯玻璃确实需要在其下方获得一些局部反射，等等。与往常一样，你可以通过扩展配置来实现：

```ini
[EXTRA_FX]
DELAYED_RENDER = ...  ; 所有参数都是网格列表
SKIP_GBUFFER = ...
MASK_GBUFFER = ...
BLEND_GBUFFER = ...
AUTOFIX = 1   ; 1 为默认值
```

不过有一点：使用这些选项时必须非常小心。与该领域的大多数事物一样，这里的所有东西都是一堆拼凑的折中方案。不同的情况可能需要不同的解决方案。

- `DELAYED_RENDER`：直接将网格从 Extra FX 中跳过，并在 Extra FX 应用完毕后再绘制。适用于车内的弹出式仪表之类的东西，即位于仪表板上方、挡风玻璃前的那类仪表。

  请记住，由于这些网格是单独渲染的，它们不会获得与车身类似的照明调整。内部反射的遮罩对它们也不起作用。而且在启用 TAA 的情况下，即使设置中启用了 MSAA，它们也不会有 MSAA。所以，说真的，对大多数情况而言这都不是一个好选择。

- `SKIP_GBUFFER`：将网格从 Extra FX 中跳过，但仍照常在主渲染通道中渲染它。可能适用于在大多数情况下几乎不可见的东西，比如仪表板仪表上方的玻璃（而且该玻璃仍会被正确地应用内部反射遮罩）。

  但是，如果被跳过的网格并没有那么透明，效果可能相当糟糕：
  [![Porsche 911 4.0 by Singer, made by Ben O'Bro, Arch](https://i.imgur.com/s82OVvN.png)](https://i.imgur.com/NpPaIOJ.jpg)

  注意玻璃后某物的反射看起来就像是在玻璃前面一样。

- `MASK_GBUFFER`：新近添加、仍有些实验性的选项，但我相信它应该适用于大多数 `SKIP_GBUFFER` 失效的情况。

  它不会完全跳过网格，而是仍会将其渲染到 Extra FX 缓冲区中，但采用完全不同的方式：压暗反射，让 SSLR 将其考虑在内。它在 SSAO 之类的东西上仍会产生伪影，但就大灯玻璃之类的东西而言，这些伪影通常远不如 SSLR 上的明显。请自行对比：
  [![Click to see full screenshots](https://i.imgur.com/L1B3mmh.png)](https://i.imgur.com/LfX4osB.jpg)

- `BLEND_GBUFFER`：用于叠加层的选项，这类叠加层只应轻微改变反射强度之类的属性，而完全不改变底层表面的形状。如果贴纸需要以平滑渐变的方式混合，则很有用。

- `AUTOFIX`：为这些标志添加一些自动猜测，例如为赛道标记赛车线。

# 关于运动模糊与 TAA

这些也有一些问题，同样提供了一些选项来调整其行为。

```ini
[EXTRA_FX]
ROTATING_FILTER = ...  ; 所有参数同样是网格列表
MOVING_FILTER = ...
GLASS_FILTER = ...
```

- `ROTATING_FILTER`：将节点标记为旋转，这样在执行运动模糊和 TAA 时就会忽略其旋转。指针之类的东西无需添加，但如果你有快速旋转的风扇之类的东西看起来全是故障伪影，这就是解决方案。车轮默认会被自动添加在这里。

  <details><summary>为什么会这样？</summary>

  要做运动模糊，着色器需要知道像素自上一帧以来移动的方向（和速度）。想象旋转车轮上的某块区域：

  [![Oh my](https://i.imgur.com/FFObVa6.png)](https://i.imgur.com/FFObVa6.png)

  它上一帧在点 A，现在在点 B，但简单的相减给着色器得出的是完全错误的移动方向！所以如果对着这样的东西做模糊，车轮看起来会非常糟糕，不知怎的同时向内和向外泄漏。我还没弄清楚大厂是如何处理这个问题的（一种办法可能是保留倒数第二帧并做一些巧妙的曲线插值，但运动模糊着色器本身就已经昂贵得惊人了），至少完全忽略旋转能让它不再显得癫狂。

  </details>

- `MOVING_FILTER`：TAA 最近添加的一项改进是现在会比较物体以减少重影。默认情况下，Custom Shaders Patch 会将整辆车标记为一个移动实体，但如果你想减少模拟仪表之类的重影，就把它们列在这里，它们会被标记为独立移动的物体。对于车辆，默认值为 `ARROW_?, STEER_?, SHIFT_?`。

- `GLASS_FILTER`：TAA 的另一个选项，用于将表面切换为快速响应模式。TAA 会减少对先前帧的关注，从而提高反应速度，代价是锯齿可能增多。非常适合数字仪表（顶部的玻璃或其后的表面）、导航屏幕或某些车窗之类的东西——如果相机移动导致车窗后的东西产生过多重影的话。

你可以在 Extra FX 调试应用中使用调试模板（stencil）视图来查看每个网格被标记成了什么。亮紫色区域是快速响应的。

# 关于半透明的 Grass FX

默认情况下，Grass FX 的程序化草地不会渲染到 G 缓冲区中，从而将耗时几乎减半。在大多数草地较矮、表面为哑光的赛道上这完全没问题，然而在一些草较高或其后有反射表面（如水面）的赛道上，草地会出现故障和透明的情况。要修复这个问题，请使用：

```ini
[EXTRA_FX]
FORCE_GRASSFX_GBUFFER_PASS = 1
```

Extra FX 设置中也有一个选项，可以为所有赛道启用该通道。

