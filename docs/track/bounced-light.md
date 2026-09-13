---
title: 反射光
---


> 汉化标题：赛道 – 反射光  
> 原文页面：Tracks-–-Bounced-light  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：clip point 译作「裁剪点」；light map 译作「光照贴图」  

*这部分内容可能有点绕，如果本文读起来不太明白，还请见谅。如有任何问题或改进建议，请告诉我。*

# 基础

反射光（bounced light）是 Extra FX 的一部分，会把水平受光表面产生的少量额外光照添加到附近的墙体或天花板上。实际效果如下：

<a href="https://i.imgur.com/6FEYdOf.jpg" target="_blank"><img src="https://i.imgur.com/6FEYdOf.jpg" title="Before" width="280"></a> <a href="https://i.imgur.com/Aha9f7r.jpg" target="_blank"><img src="https://i.imgur.com/Aha9f7r.jpg" title="After" width="280"></a>

它的妙处在于：整体只需约 0.3 ms；它不是屏幕空间效果（因此即使被照亮的路面不在画面内也能生效）；而且没有任何时间上的滞后，对光照的任何变化都会立即作出反应。不过它也有几个缺点，因此需要赛道配置才能工作。

### 工作原理

原理简单得出奇：从上方对摄像机周围的赛道拍一张快照，做模糊处理，再用它来添加反射光。稍微复杂一点的是，在应用阶段，它还会比较某一点到下方表面的距离。距离差越大，模糊越强、强度越低：

<a href="https://i.imgur.com/5a6Q5hL.jpg" target="_blank"><img src="https://i.imgur.com/5a6Q5hL.jpg" title="Before" width=380></a>

于是就有了第一个缺点：要让隧道和下穿道正常工作，光照贴图中只能包含那些你期望会把光反射回来的表面。以 Black Cat County 为例（前两张截图），岩石不应出现在光照贴图中，否则整体看起来会非常不对劲。注意光照贴图中并不包含岩石，却带有这些岩石的影子：

<a href="https://i.imgur.com/2Bh4ydT.jpg" target="_blank"><img src="https://i.imgur.com/2Bh4ydT.jpg" width=380></a>

第二个缺点性质类似：整个方案主要适用于单层赛道。我想这也是为什么没有别的游戏真正用过这一招——只要出现比如两层的建筑，整个效果就崩了。好在 AC 中 98% 的赛道都是平坦的，所以效果很好。还有一些额外选项可以帮助处理某些较复杂的情况，但至少目前还远谈不上完美。

### 语法

任何 `…_MATERIALS` 都有对应的 `…MESHES`，例如 `SURFACE_MESHES`；两者可以同时使用。

```ini
[BOUNCED_LIGHT]
SUPPORTED = 1 ; 这个很简单，声明该赛道支持反射光
SURFACE_MATERIALS = ? ; 会把光反射回来的材质列表，默认值为 1
OBJECT_MATERIALS = ; 对象列表：它们会被完全排除在光照贴图之外，把广告牌、标牌、墙体、护栏之类不会把光向上反射的东西都加到这里
SPOT_MATERIALS = ; 会参与反射光但不改变表面高度的对象列表。例如在 Black Cat County 上，岩石就列在这里，它们会把光反射回来，但不会影响地面高度
OCCLUDING_MATERIALS = ; 会被绘制为黑色的对象列表，从而在地面上投下阴影
CLIP_POINT_... = 192, 79, 494 ; 裁剪点列表（稍后详述）
CLIP_POINT_... = -197, 3, -776 ; 请记住，在 CSP 中键可以使用“...”，索引会自动分配
CLIP_POINT_... = ...
```

裁剪点（clip point）是什么？这是把天花板与其他东西分离开的简便方法。再来看看 Black Cat County 上的那些岩石：它们全是一整块网格。虽然我可能希望其下半部分参与反射光，但上半部分当然应该排除在外。而且这种情况很常见：例如，你可能想去掉隧道上方的一座小山，而它使用的网格名和材质与附近某片地形完全相同。这正是裁剪点的用武之地。

想象一张位于 500 米高处的平面。每个裁剪点都会把它向下拉，使其到达该点后再返回：

<a href="https://gfycat.com/AgonizingHonoredGuanaco"><img src="https://thumbs.gfycat.com/AgonizingHonoredGuanaco-size_restricted.gif" width=380 ></a>

*你可以在 Extra FX Debug 应用的 Bounced Light 选项中开启该调试视图。*

这套系统有点奇怪，但我发现它无论在简单的通道还是长隧道中都工作良好，而且与着色器配合得很好（请记住，着色器只会使用最近的 16 个裁剪点，不过看起来已经绰绰有余）。裁剪点不仅可以把那张平面向下拉，当然也可以把它向上推。此外，每个裁剪点还可以有自己的权重，在需要时修改其“引力”。

添加裁剪点时，我建议直接把摄像机移动到相应位置，复制其坐标，然后作为带 `CLIP_POINT_...` 键的新行粘贴到赛道配置中。那个按钮会复制摄像机位置（来自 AccExtHelper 应用，见[这里](https://github.com/ac-custom-shaders-patch/acc-extension-apps)）：

<a href="https://i.imgur.com/Zn9XOOY.jpg" target="_blank"><img src="https://i.imgur.com/Zn9XOOY.jpg" title="Before" width="200"></a>

要修改裁剪点的权重，只需为其添加第四个值。默认权重为 1。还记得我前面提到的 500 米吗？它也是可以更改的：

```ini
[BOUNCED_LIGHT]
CLIP_BASE_WEIGHT = 1 ; 裁剪平面的起始权重，增大可让裁剪点更难拉动平面
CLIP_BASE_Y = 500
```

基础设置就这些了！希望上面讲的都说得通。哦，还有一条重要提示：请务必把所有不参与反射光的东西加进 `OBJECT_MATERIALS`，这能在渲染光照贴图时省下大量时间。


### 计划日后添加的功能

- 赛道灯光的选项：仅在反射光被禁用时才保持启用，作为隧道的修复方案。

# 附加功能

### 焦散

<img src="https://files.acstuff.ru/shared/SOUG/20220611-180033.png" width=380>

要启用焦散，请使用：

```ini
[BOUNCED_LIGHT]
CAUSTICS = 1
CAUSTICS_SCALE = 1  ; 可选，调整焦散强度
```

### 额外裁剪平面

对于带桥梁之类的多层赛道，目前有一种略显奇怪的解决方案：定义一个带新裁剪点的新裁剪平面，并在空间上加以限制。如果摄像机进入该平面下方，就会添加额外的裁剪点。举个例子，假设我想让 Nordschleife 的这条隧道在天花板上获得漂亮的反射光，同时又不破坏其上方所有东西的反射光。

<a href="https://i.imgur.com/vn3mW5s.jpg" target="_blank"><img src="https://i.imgur.com/vn3mW5s.jpg" width=380></a>

为此，我可以像这样定义一个新的裁剪平面：

```ini
[BOUNCED_LIGHT_ADJUSTMENT_...]
CENTER = -441.05, -141.52, -1993.56 ; 新裁剪平面的中心
RADIUS = 200 ; 其半径，用于在摄像机太远时将其丢弃以节省性能，并减少不必要的触发
CLIP_BASE_Y = -200 ; 基础 Y 值
CLIP_POINT_... = -440.49, -145.23, -1996.67 ; 定义平面的点：桥下方一个
CLIP_POINT_... = -468.28, -136.91, -2005.69 ; 左上方一个，用于做出那个凸起
CLIP_POINT_... = -416.11, -135.55, -1975.77 ; 右上方一个，用于做出那个凸起
CLIP_POINT_... = -418.04, -149.52, -2037.85 ; 桥后方一个，把平面压到路面以下
CLIP_POINT_... = -452.52, -142.24, -1974.21 ; 桥前方一个，把平面压到路面以下
```

<a href="https://i.imgur.com/GnbzW1I.jpg" target="_blank"><img src="https://i.imgur.com/GnbzW1I.jpg" width=380></a>

一旦摄像机移动到该平面下方，这些点就会被应用到主裁剪平面，使反射光发生变化：

<a href="https://gfycat.com/DisguisedAdvancedFlycatcher"><img src="https://thumbs.gfycat.com/DisguisedAdvancedFlycatcher-size_restricted.gif" width=380 ></a>

这种做法远谈不上完美，但我认为总体上效果还不错，例如对于绑定到车辆的摄像机，无论车辆从桥上方还是桥下方通过都能工作。另外，那种跳变以后也可能会被平滑掉。

### 高度图

为了让整体效果更好看，它需要知道任意一点到表面的距离。现在，假设表面上存在空洞，或者比如你忘了把某辆停着的车标记为对象网格，它就会被当作一个影响反射光的大鼓包。为了尽量解决这一问题，Custom Shaders Patch 会对深度图进行扩展：基本上，对每个像素，它都会检查一定半径内的所有相邻像素，并选取更低但非零的值（用于处理空洞）。但在某些情况下，这可能会降低陡峭表面上反射光的质量。你可以这样更改该行为：

```ini
[BOUNCED_LIGHT]
DEPTH_EXPANSION_STEPS = 1 ; 默认值为 1
```

增加步数可以增大该检查的半径，用于一些格外复杂的情况（不推荐）。或者，如果你知道你的光照贴图没有空洞和陡峭的跳变（Extra FX Debug 应用中有选项可以查看检测到的到表面的距离），可以将其设为 0，以略微提升性能和质量。

