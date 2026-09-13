---
title: 树木
---


> 汉化标题：赛道 – 树木  
> 原文页面：Tracks-–-Trees  
> 原文锚点：0da025f  
> 汉化时间：2026-09-12T00:00:00+08:00  

CSP 0.1.79 新功能：通过简单配置在赛道上添加成千上万棵树。借助 LOD、远处树木的面片（billboard）以及对实例化的重度使用，CSP 应该能轻松处理数十万棵树（如果不行，请告诉我，我会继续想办法提速）。此外，该系统也可用于灌木——目前它们不会变形，但这一点以后随时可以加上。

<a href="https://gfycat.com/WindingWhiteArgusfish"><img src="https://thumbs.gfycat.com/WindingWhiteArgusfish-size_restricted.gif"></a>

# 树模型

首先你需要一个树模型。将来我希望能尝试加入程序化生成树模型的功能，但目前就先这样。

模型要求：
- LOD A 1 万三角形、LOD B 6 千三角形、LOD C 3 千三角形（只是建议，多点少点都行）；
- 每个 LOD 单个网格（如需树干一种纹理、树枝另一种纹理等，可使用多材质）；
- 每个模型的枢轴应正好位于其底部中央（可将其理解为树在表面上的定位点）；
- 材质应同时包含漫反射（albedo）纹理和法线纹理（在 3DS Max 中使用 bump 纹理）；
- 法线纹理的 alpha 可用于局部环境光遮蔽；
- 漫反射纹理的 alpha 用于透明度：请确保树干纹理是不透明的。

准备好几个符合要求的 LOD 模型后（也不一定要三个 LOD，需要的话可以更少），只需把它们合到同一个场景中并导出为 FBX。

<a href="https://files.acstuff.ru/shared/movf/20221025-093706.png"><img src="https://files.acstuff.ru/shared/movf/20221025-093706.png"></a>

现在你可以使用 [AC Content Manager](https://acstuff.ru/app/#get) 快速把 FBX 转换为即用的树模型。前往 “Content/Tools/Creator tools” 并选择 tree converter。

<a href="https://files.acstuff.ru/shared/H7Kq/20221025-093900.png"><img src="https://files.acstuff.ru/shared/H7Kq/20221025-093900.png"></a>

在其中选择你的 FBX 文件，以及树的输出 BIN 文件（可以放在 “content/tracks/&lt;yourtrack&gt;/extension/trees” 之类的位置），工具会完成剩下的工作。需要的话，还有几个参数可以调整（例如针叶树肯定需要更少的次表面散射和更低的反射率）。工具运行时还会跟踪 FBX 文件的更改，这样你调整模型后，树模型会自动刷新。

# 树列表

树模型准备就绪后，终于可以把它添加到赛道上了。它们最简单的配置长这样：

```ini
[TREES]
LIST_0 = trees/trees.txt
```

这样写会让 CSP 去读取 “content/tracks/&lt;yourtrack&gt;/extension/trees/trees.txt” 中的树列表。文件里只需按坐标列出树（“my_tree.bin” 是早前由 Tree Model Converter 导出的、与 “trees.txt” 放在一起的文件）：

```
tree: my_tree.bin; 208.4, -1, -53
tree: my_tree.bin; 207.9, -1, -29
tree: my_tree.bin; 207.1, -1, -19
tree: my_tree.bin; 138.5, -1, -12
```

<details><summary>关于树列表格式的更多信息</summary>
首先，当然，像这样设置树并不是最好的方法。一个在 AC 中实时布置树木的工具正在开发中。不过，你也可能想创建自定义导出脚本：如果是这样，你或许对该格式的更多细节感兴趣。

列表的每一行要么是注释，要么是树，要么是配置行。配置行由键和值组成，会覆盖具有该键的参数，直到下一个含相同键的配置行为止。两个简单的配置行：

```
configure: size variance = 0.8, 1.2  ; 尺寸乘数将在 80…120% 范围内随机选取
configure: angle variance = 0, 360   ; 角度将在 0…360° 范围内随机选取
```

所有参数：
- `size variance`：设置随机尺寸的范围；
- `width variance`：设置随机宽度乘数的范围；
- `angle variance`：设置随机角度的范围；
- `color variance`：设置随机 RGB 颜色偏移的范围；
- `brightness variance`：设置随机亮度偏移的范围；
- `fake shadow`：需要单个值，将用作其后所有树木的假阴影不透明度；
- `seed`：用一个新的单值替换其后所有树木的随机种子。

*注：即使未显式设置种子，所有随机值也都由固定种子预先确定。*

每个树行也可以为某一棵特定的树覆盖上述任意值：

```
tree: tree0.bin; pos=-83.3, -0.99, -74.14; angle = 180; size = 1; width = 1; color = 2, 2, 2
```
</details>

为了编辑方便，同一个配置中可以使用多个列表。这样更新一个列表时，就不必重新加载所有列表。

# 其他参数

### 表面对齐

要自动将树木吸附到下方表面上，并让树木的光照与之对齐（在倾斜表面上帮助极大），可使用 `SURFACE_MESHES` 和 `SURFACE_MATERIALS` 参数，像这样：

```ini
[TREES]
LIST_0 = trees.txt
SURFACE_MATERIALS = tarmac, Concrete2Mat
```

### 季节条件

你可以将季节外观绑定到条件上，让树木在秋天变黄、在冬天变白。此外，还可以为不同类型的树木重新定义这些季节性调整（例如不让针叶树在秋天变黄）：

```ini
[CONDITION_...]
NAME = SEASON_WINTER
INPUT = YEAR_PROGRESS
LUT = (|-1=0|0=0.25|0.05=0.35|0.075=2|0.12=0.3|0.2=0|0.45=0|0.6=0.00|0.7=0|0.85=0|0.95=0.2|1=0.25|)

[CONDITION_...]
NAME = SEASON_AUTUMN
INPUT = YEAR_PROGRESS
LUT = (|-1=0|0=0.75|0.2=0|0.45=0|0.6=0.05|0.7=0|0.75=0|0.8=0.75|1=0.75|)

[TREES]
LIST_0 = trees.txt
SEASON_AUTUMN_0 = SEASON_AUTUMN
SEASON_WINTER_0 = SEASON_WINTER
SEASON_AUTUMN_1 = tree_pine?, tree_big_pine.bin, 0
```

*注：目前树木在冬天不会落叶。请在生成的树的 “tree.ini” 中添加 “[BASIC] LEAFLESS_WINTER=1” 参数（那些 bin 文件只是归档，可以用 7Zip 或 WinRAR 之类的工具打开），这样将来我一旦弄清楚如何高效实现，CSP 就会知道要移除你的树的叶片。*

# 烘焙与编译

其余一切就绪后，你可以使用[顶点环境光遮蔽烘焙器](https://github.com/ac-custom-shaders-patch/acc-bakeryoptix)把树列表编译为单个二进制文件，这应能显著加快加载速度。它还会把树木产生的环境阴影添加到赛道上，并计算树木上的方向性环境阴影，帮助为茂密的森林增添纵深感。要进行设置，只需用新的 VAO 烘焙器（[v17+](https://github.com/ac-custom-shaders-patch/acc-bakeryoptix/releases)）烘焙你的赛道。请确保赛道文件夹位于 AC 根目录且已安装 CSP 0.1.79：烘焙器会以 headless 模式运行几次 Assetto Corsa 来协助处理数据。

编译后，赛道目录中会生成一个新文件 “compiled_trees.bin”。把它移动到你希望放置的位置（例如 “content/tracks/&lt;yourtrack&gt;/extension” 文件夹），并将配置改为：

```ini
[TREES]
COMPILED_LIST = compiled_trees.bin
```

设置该值后，AC 会自动加载编译后的列表，而不是指定的 “LIST_…” 值，从而加快读取和初始设置。之后即可从发布版本中删除列表文件。

还有几点细节：
- 若设置了 “COMPILED_LIST” 值，AC 会忽略所有 “LIST_…” 值，但仅限于常规运行时，烘焙过程中不会忽略。这样一来，你不必删除 “LIST…” 来强制 CSP 使用编译数据，也不必删除 “COMPILED_LIST” 行来让 CSP 改回文本列表以更新烘焙数据；
- 表面对齐（通过 “SURFACE_…” 值配置）同样存储在编译后的列表中。如果地形几何体或法线贴图发生变化，请务必重新编译；
- VAO 烘焙器并不一定总要编译二进制列表。请查看 “baked_shadow_params.ini”：“EXT_PROCEDURAL_TREES_…” 值决定树木的处理方式，如果 “EXT_PROCEDURAL_TREES_FINALIZE” 未设为 1，树木的遮蔽信息将改为存储在赛道的 “.vao-patch” 文件中。

