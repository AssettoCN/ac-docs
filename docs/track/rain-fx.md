---
title: 雨天效果（Rain FX）
---

# 雨天效果（Rain FX）

## 通用定义

- **PUDDLES_MATERIALS** — 生成水坑的物理关键部分。
- **SOAKING_MATERIALS** — 默认情况下，所有材质在潮湿时会变暗 35%，SOAKING_MATERIALS 会变暗 70%（额外增加 35% 变暗）。
- **SMOOTH_MATERIALS** — 完全不会变暗，但会在表面产生雨滴效果，如玻璃、汽车、光滑清洁金属等。如果某物体同时出现在 SMOOTH_… 和 SOAKING_… 中，会产生雨滴，但仍会变暗 35%。
- **ROUGH_MATERIALS** — 不会产生任何反射，也不会明显变亮，只是变暗。这对于草地表面几乎是必需的，否则程序化草地无法获得匹配的良好反射，特别是在 Extra FX 下整体看起来会很差。
- **LINES_MATERIALS** — 允许标记赛道表面的涂料线。它没有任何视觉效果，但稍后会影响物理（更滑）。
- **LINES_FILTER_MATERIALS** — 类似于 LINES_MATERIALS，但不是将整个表面用作涂料遮罩，而是只过滤出较亮的区域。适用于 Silverstone 等赛道，其赛道标线不是叠加网格，而是纹理的一部分。
- **RELIEF_MATERIALS** — 目前已损坏，不确定是否真的需要更改它。其想法是在低洼区域有更多水坑，CSP 使用赛道高度图来实现。该参数指定哪些进入高度图，默认使用所有内容。这意味着在高大建筑物周围可能会有更多水坑，因为周围区域会被视为局部最低点。
- 对于上述每个 `XXX_MATERIALS`，也可以使用 `XXX_MESHES` 版本。

## 更具体的情况

- 主要赛道沥青表面应同时定义为 `PUDDLES_MATERIALS` 和 `SOAKING_MATERIALS`。
- 没有必要将路缘定义为 `SOAKING_MATERIALS`，因为它们在潮湿时通常不会变暗太多，但路缘作为 `PUDDLES_MATERIALS` 是可以的。
- 目前建议仅将 `PUDDLES_MATERIALS` 用于道路，因为它们做了一些假设为道路的操作。对于其他地方的水坑，如看台，可能值得准备一套具有较小非道路水坑的独立着色器，不依赖大规模地形、不读取赛车线偏移等。
- `SOAKING_MATERIALS` 的例子可以是布顶棚。
- 不需要将沟槽定义为任何 Rain FX 材质/网格。现在有一个新的沟槽着色器，根本不会有水坑。水坑的目的是添加实时反射，但沟槽现在所做的只是为 SSLR 遮罩反射。以下链接列出了支持水坑的着色器列表（更多将很快添加，如果急需添加请联系 Ilya）：[gitlab.com/ac-custom-shaders-patch/public/acc-shaders/-/blob/master/.build/lists.txt](https://gitlab.com/ac-custom-shaders-patch/public/acc-shaders/-/blob/master/.build/lists.txt)
- 关于沙地表面，可以定义为 `ROUGH_MATERIALS` 或 `SOAKING_SURFACES`，因为两者看起来都不错，一些反射或只是深色沙坑。建议根据其光滑程度来定义。比如在海滩上的细沙可以更有反射性，而普通沙坑通常很粗糙，可能不带反射更好看。此外，性能也是一个因素，减少反射材质可能有一些帮助。
- 旁观者也可以定义为 `ROUGH_MATERIALS`，因为有时他们变得有反射看起来很奇怪。
- 定义的 `SMOOTH_MATERIALS` 数量不会真正影响性能。可以尽可能多定义，或者只定义驾驶时能看到的。着色器更复杂，但如果当前不占据太多屏幕空间，就没关系。

## 制作配置的教程

1. 将下面的示例代码复制到 `extension\config\tracks\loaded` 文件夹中的 `*.ini` 配置文件末尾。如果你正在处理的赛道配置文件不在 GitHub 仓库中，请在 `content\tracks\your_track` 文件夹中创建 `extension` 文件夹，并在其中创建 `ext_config.ini` 文件。
2. 加载游戏，使用 F7 自由摄像机在赛道周围导航。建议使用窗口模式以便同时处理配置文件。
3. 打开 Objects Inspector 应用，Alt 点击想要处理的对象。
4. 点击 Object Inspector 中的材质/网格名称将其复制到剪贴板，然后粘贴到配置文件中的 `XXX_MATERIALS/MESHES` 下。
5. 保存配置文件，可以立即看到游戏内的效果。
6. 对其他赛道对象重复步骤 3-5。个人使用的话随意处理多少。公开分享的话请尽量详尽。
7. 良好的示例参考：`ks_nordschleife`、`spa` 和 `ks_highlands`。

```ini
[RAIN_FX]
PUDDLES_MATERIALS = some_material  ; 支持通配符 "?"
SOAKING_MATERIALS = ...
SMOOTH_MATERIALS = ...
ROUGH_MATERIALS = ...
LINES_MATERIALS = ...
LINES_FILTER_MATERIALS = ...

; 也可以使用 ..._MESHES = 对应版本！

; 定义雨水应从其滴落的边缘或点...
STREAM_EDGE_... = -1207, 39, -1750, -1173.6, 39.5, -1750.2  ; x1,y1,z1 , x2,y2,z2
STREAM_POINT_... = -1232.69, 38.48, -1411.69                ; x,y,z

; RELIEF_MATERIALS = '{ dynamic:no & !Bx? }'  ; 目前已损坏
```

## 桥梁/隧道

可以定义雨水不应降落的区域：

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

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-RainFX) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
