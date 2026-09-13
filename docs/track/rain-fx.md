---
title: 雨 FX
---


> 汉化标题：赛道 – 雨 FX  
> 原文页面：Tracks-–-RainFX  
> 原文锚点：572e825  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：groove 译作「车辙」（指赛道走线上沉积的橡胶层）；bystanders 译作「旁观者」  

**通用定义**

* PUDDLES_MATERIALS——生成水洼相关物理效果的关键部分。
* SOAKING_MATERIALS——默认情况下，所有材质在受潮时都会变暗 35%，而 SOAKING_MATERIALS 会变暗 70%（在原有基础上再加深 35%）。
* SMOOTH_MATERIALS——这类材质完全不会变暗，而是会在表面出现雨滴，例如玻璃碎片、车辆、光滑干净的金属等。如果某样东西同时列在 SMOOTH_… 和 SOAKING_… 中，它会出现雨滴，但仍会变暗 35%。
* ROUGH_MATERIALS——不会获得任何反射，甚至不会明显变得更有光泽，只是受潮时变暗。对任何草地表面来说几乎是必需的，否则程序化生成的草无法获得与之匹配的漂亮反射，尤其是在 Extra FX 下，整体画面看起来会非常糟糕。
* LINES_MATERIALS——允许标记赛道表面上的油漆线。它不会有任何视觉效果，但稍后会影响物理（会滑得多）。
* LINES_FILTER_MATERIALS——与 LINES_MATERIALS 类似，但不是将整个对象用作表面油漆遮罩，而是只筛出较亮的区域，适用于 Silverstone 这类赛道线不是叠加网格、而是纹理一部分的赛道。
* RELIEF_MATERIALS——目前有问题，而且不确定是否真有修改它的必要。其思路是让低洼区域出现更多水洼，为此 CSP 会使用赛道高度图。该参数指定哪些内容计入高度图，默认使用所有内容。这意味着高楼周围可能出现更多水洼，因为周边区域会被视为局部最低点。不清楚现实中的情况是否如此，但如果不是，这个参数可以快速排除建筑物。
* 对于上述每个 XXX_MATERIALS，也可以使用对应的 XXX_MESHES 版本。

**更具体的情况**

* 赛道主要的沥青路面应同时定义为 PUDDLES_MATERIALS 和 SOAKING_MATERIALS。
* 没有必要将路缘石定义为 SOAKING_MATERIALS，因为它们受潮时通常不会变暗多少，但把路缘石定义为 PUDDLES_MATERIALS 当然没问题。
* 目前建议将 PUDDLES_MATERIALS 仅用于道路，因为相关处理会假定它是道路。对于其他地方的水洼，比如大看台，甚至值得为带有更小的非道路水洼的材质准备单独的着色器集——不依赖大尺度地形起伏，不读取走线偏移等。
* 布料顶棚就是 SOAKING_MATERIALS 的一个例子。
* 无需将车辙（grooves）定义为任何 Rain FX 材质/网格。现在有了专用于车辙的新着色器，它完全不会出现水洼。水洼这套机制的意义在于添加实时反射，而车辙现在所做的只是为 SSLR 遮蔽反射。以下链接列出了支持水洼的着色器（还会陆续增加，如需紧急添加请告知 Ilya）：gitlab.com/ac-custom-shaders-patch/public/acc-shaders/-/blob/master/.build/lists.txt
* 至于沙地表面，既可以定义为 ROUGH_MATERIALS，也可以定义为 SOAKING_SURFACES，两种效果都不错——要么带一点反射，要么只是变暗的沙坑。建议根据它的光滑程度来决定。比如在海滩上，细软的沙子当然可以更有反射性；而普通沙坑通常被翻得相当粗糙，或许不带任何反射反而更好看。另外性能也有影响，反射材质少一些可能会有点帮助。
* 旁观者也可以定义为 ROUGH_MATERIALS，因为看到他们带反射有时显得很奇怪。
* 定义的 SMOOTH_MATERIALS 数量其实不会影响性能。你可以尽可能多地定义，或者只定义驾驶时会看到的那些。这些着色器更复杂，但如果它们当前没有占据太多屏幕空间，就没有什么影响。

**配置制作教程**

1. 将下面的示例代码复制到 extension\config\tracks\loaded 文件夹中 *.ini 配置文件的末尾。如果你要处理的赛道在 GitHub 仓库中没有配置文件，请在 content\tracks\your_track 文件夹中创建一个 extension 文件夹，并在其中创建 ext_config.ini 文件。
2. 载入游戏，用 F7 自由摄像机在赛道上游走。建议使用窗口模式，以便同时编辑配置文件。
3. 打开 Objects Inspector 应用，按住 Alt 点击你想要处理的对象。
4. 在 Object Inspector 中点击材质/网格名称，将其复制到剪贴板，然后粘贴到配置文件中你想要的 XXX_MATERIALS/MESHES 下面。
5. 保存配置文件，即可立即看到游戏内的效果。
6. 对其他赛道对象重复步骤 3–5。个人使用的话，想处理多少就处理多少；如果要公开分享，请尽量详尽。
7. 如果需要参考，ks_nordschleife、spa 和 ks_highlands 都是不错的范例。


```ini
[RAIN_FX]
PUDDLES_MATERIALS = some_material  ; 与通常一样可使用通配符 "?"
SOAKING_MATERIALS = ...
SMOOTH_MATERIALS = ...
ROUGH_MATERIALS = ...
LINES_MATERIALS = ...
LINES_FILTER_MATERIALS = ...

; 你也可以使用对应的 ..._MESHES 写法！

; 定义雨水应从哪些边缘或点滴落……
STREAM_EDGE_... = -1207, 39, -1750, -1173.6, 39.5, -1750.2  ; x1,y1,z1 , x2,y2,z2
STREAM_POINT_... = -1232.69, 38.48, -1411.69                ; x,y,z

; RELIEF_MATERIALS = '{ dynamic:no & !Bx? }'  ; 目前有问题
```
**用于桥梁/隧道**
- 你可以定义雨水不应降落的区域
```ini
[TRACK_OCCLUDER_BOX_0]
DESCRIPTION=upper plane of a box, underneath no rain
POINT_0=726.001, 15.7748, 586.403
POINT_1=730.039, 15.7748, 600.85
POINT_2=723.472, 15.7748, 602.709
POINT_3=719.433, 15.7748, 588.262

[TRACK_OCCLUDER_WALL_0]
DESCRIPTION=for a wall only 2 points needed
POINT_0=678.85, 11.4539, 574.043
POINT_1=734.493, 11.4539, 759.929
```

