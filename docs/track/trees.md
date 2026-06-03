---
title: 树木系统
---

# 树木系统

CSP 0.1.79 新功能：通过简单配置即可在赛道上添加成千上万棵树木。借助 LOD（细节层次）、远处树木的公告板以及大量实例化，CSP 应该能够毫无问题地处理数十万棵树（如果有问题，请告知，我会进一步优化速度）。此外，此系统也可用于灌木——目前它们不会变形，但这可以在以后添加。

## 树木模型

首先需要的是树木模型。未来希望能够添加程序化树木模型生成，但目前就是现有的方式。

模型要求：
- LOD A 建议 10K 三角形，LOD B 建议 6K 三角形，LOD C 建议 3K（仅为建议，可以更多或更少）；
- 每个 LOD 使用单个网格（如果需要树干一种纹理、树枝另一种纹理，可以使用多材质）；
- 每个模型的枢轴点应位于其底部正中间（将其视为表面上树木的定位点）；
- 材质应同时包含漫反射（albedo）和法线纹理（在 3DS Max 中使用凹凸纹理）；
- 法线纹理的 alpha 通道可用于局部环境光遮蔽；
- 漫反射纹理的 alpha 通道用于透明度：确保树干纹理是不透明的。

获得符合要求的几个 LOD 模型后（也不必非要有三个 LOD，可以更少），将它们合并在单个场景中并导出为 FBX。

现在可以使用 [AC Content Manager](https://acstuff.ru/app/#get) 快速将 FBX 转换为可用的树木模型。转到 "Content/Tools/Creator tools" 并选择树木转换器。

在其中选择 FBX 文件、输出 BIN 文件（可以放在 `content/tracks/&lt;yourtrack&gt;/extension/trees` 中的某个位置），工具会完成其余工作。如果需要，会有一些参数可以调整（例如，针叶树肯定需要更少的次表面散射和反射率）。工具还应跟踪 FBX 文件的更改，因此可以调整模型并自动刷新树木模型。

## 树木列表

树木模型准备好后，可以将其添加到赛道。以下是最简单的配置：

```ini
[TREES]
LIST_0 = trees/trees.txt
```

这样写会指向 "content/tracks/`&lt;yourtrack>`/extension/trees/trees.txt" 中的树木列表。里面可以简单地列出树木及其坐标（"my_tree.bin" 是之前由 Tree Model Converter 导出的、位于 "trees.txt" 旁边的文件）：

```
tree: my_tree.bin; 208.4, -1, -53
tree: my_tree.bin; 207.9, -1, -29
tree: my_tree.bin; 207.1, -1, -19
tree: my_tree.bin; 138.5, -1, -12
```

::: details 更多关于树木列表格式的信息
首先，当然，像这样设置树木不是最好的方法。一个在 AC 中实时排列树木的工具正在开发中。但你也可能对创建自定义导出脚本感兴趣：如果是这样，你可能对格式的更多细节感兴趣。

列表的每一行要么是注释、一棵树或配置行。配置行由键和值组成，并覆盖具有该键的参数，直到下一个具有相同键的配置行。两个简单的配置行：

```
configure: size variance = 0.8, 1.2  ; 大小乘数将在 80…120% 范围内随机选择
configure: angle variance = 0, 360   ; 角度将在 0…360° 范围内随机选择
```

所有参数：
- `size variance`：设置随机大小范围；
- `width variance`：设置随机宽度乘数范围；
- `angle variance`：设置随机角度范围；
- `color variance`：设置随机 RGB 颜色偏移范围；
- `brightness variance`：设置随机亮度偏移范围；
- `fake shadow`：需要一个值，用作后续所有树木的假阴影不透明度；
- `seed`：用新的单个值替换后续所有树木的随机种子。

*注意：所有随机值都使用固定种子预确定，即使未设置显式种子。*

每棵树行也可以覆盖特定树木的任何值：

```
tree: tree0.bin; pos=-83.3, -0.99, -74.14; angle = 180; size = 1; width = 1; color = 2, 2, 2
```
:::

为简化编辑，可以在同一配置中使用多个列表。这样更新列表时不需要重新加载所有列表。

## 其他参数

### 表面对齐

使用 `SURFACE_MESHES` 和 `SURFACE_MATERIALS` 参数自动将树木吸附到基础表面并对齐树木光照（在倾斜表面上非常有帮助）：

```ini
[TREES]
LIST_0 = trees.txt
SURFACE_MATERIALS = tarmac, Concrete2Mat
```

### 季节条件

可以将季节外观绑定到条件，使树木在秋天变黄、冬天变白。还可以为不同类型的树木重新定义这些季节调整（例如阻止针叶树在秋天变黄）：

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

*注意：目前树木在冬天不会落叶。在生成树木的 "tree.ini" 中添加 `[BASIC] LEAFLESS_WINTER=1` 参数（那些 bin 文件只是可以用 7Zip 或 WinRAR 打开的归档），以便将来 CSP 知道在找到高效方法后从树木中移除叶子。*

## 烘焙和编译

一切准备就绪后，可以使用 [顶点环境光遮蔽烘焙器](https://github.com/ac-custom-shaders-patch/acc-bakeryoptix) 将树木列表编译为单个二进制文件，这应该能明显加快加载速度。它还添加了树木对赛道的环境阴影以及树木上的方向环境阴影，有助于为密集森林增加深度。要设置它，只需使用新的 VAO 烘焙器（[v17+](https://github.com/ac-custom-shaders-patch/acc-bakeryoptix/releases)）烘焙赛道。确保赛道文件夹在 AC 根文件夹中且安装了 CSP 0.1.79：烘焙器将以无头模式运行几次 Assetto Corsa 来辅助数据处理。

编译后，赛道目录中将创建一个新文件 "compiled_trees.bin"。只需将其移动到你希望的位置（例如 `content/tracks/&lt;yourtrack&gt;/extension` 文件夹），并将配置更改为：

```ini
[TREES]
COMPILED_LIST = compiled_trees.bin
```

使用该值时，AC 将自动加载编译列表而不是指定的 `LIST_…` 值，从而加快读取和初始设置。列表文件之后可以从发布版本中移除。

更多细节：
- 如果设置了 `COMPILED_LIST` 值，AC 在常规运行期间会忽略所有 `LIST_…` 值，但烘焙过程中不会。这样，你不必移除 `LIST…` 来强制 CSP 使用编译数据，也不必移除 `COMPILED_LIST` 行来恢复 CSP 使用文本列表更新烘焙数据；
- 表面对齐（通过 `SURFACE_…` 值配置）也存储在编译列表中。如果景观几何体或法线贴图更改，请确保重新编译；
- VAO 烘焙器不一定要编译二进制列表。查看 "baked_shadow_params.ini"：值 `EXT_PROCEDURAL_TREES_…` 设置树木的处理方式，如果 `EXT_PROCEDURAL_TREES_FINALIZE` 未设为 1，树木遮挡信息将存储在赛道的 `.vao-patch` 文件中。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Trees) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
