---
title: 场景查询
---


> 汉化标题：通用 – 场景查询  
> 原文页面：General-–-Scene-queries  
> 原文锚点：6d1c6f0  
> 汉化时间：2026-09-12T19:00:00+08:00  

许多 CSP 配置以及 Lua 中的 `ac.SceneReference()` 都需要一个指向场景中节点或网格的引用。在大多数情况下，一个简单的网格名称就足够了，但有时更高级的写法效果更好，因此这里详细说明一下它们的工作方式。

首先，除非另有说明，所有这些查询都支持通配符「?」，表示任意数量的任意字符。此外，匹配会尝试抓取整个字符串，因此如果你想搜索某个子串，请使用「?keyword?」这样的模式。

### 属性

除了使用名称外，查询还可以引用属性。其语法为「property:value」，例如，你可以不用「MESH_NAME」，而是使用「material:MATERIAL_NAME」。

##### 特定节点

- `carRoot:N`：第 N 辆车的车辆根节点；
- `driverRoot:N`：第 N 辆车的车手根节点；
- `driverNeck:N`：第 N 辆车的车手颈部节点；
- `sceneRoot:yes`/`:no`¹：场景根节点；
- `carsRoot:yes`/`:no`¹：包含所有车辆的节点；
- `trackRoot:yes`/`:no`¹：赛道根节点；
- `staticRoot:yes`/`:no`¹：静态几何体根节点（即「BLURRED」）；
- `dynamicRoot:yes`/`:no`¹：动态几何体根节点（即「UNBLURRED」）。

在车辆或赛道配置中使用其中的大多数根本不会生效——它们的查询范围被限制在各自对应的节点之内。车辆和赛道的 Lua 脚本也是如此，但其他类型的 Lua 脚本可以稍微放开一些。

##### 通用属性

这些属性适用于任何类型的对象。

- `class`：对象类型（已知值：`node`、`model`、`carNodeSorter`、`nodeBoundingSphere`、`parent`、`nodeEvent`、`idealLine`、`particleSystem`、`staticParticleSystem`、`displayNode`、`textNode`、`cspNode`、`renderable`、`mesh`、`skinnedMesh`、`skidmarkBuffer`）；
- `active:yes`/`:no`：激活状态；
- `first:yes`/`:no`¹：父节点的第一个子节点；
- `last:yes`/`:no`¹：父节点的最后一个子节点；
- `lod:N`/`:A`/`:B`/…：对象属于某个 LOD（用于车辆模型）；
- `modelRoot:yes`/`:no`：KN5 文件的根节点；
- `driverPiece:yes`/`:no`：车手模型中的对象；
- `insideInterior:yes`/`:no`：车辆座舱中的对象；
- `insideSteeringWheel:yes`/`:no`：车辆方向盘中的对象；
- `insideWheel:yes`/`:no`：车辆车轮节点中的对象；
- `insideSuspension:yes`/`:no`：车辆悬挂节点中的对象；
- `insideNthWheel:N`：第 N 辆车车轮中的对象；
- `insideNthSuspension:N`：第 N 辆车悬挂中的对象；
- `parent:X`：父节点是否匹配 X（X 也可以是一个属性查询）；
- `child:X`：节点是否有匹配 X 的子节点。比其他查询更昂贵，请谨慎使用。

##### 材质相关属性

这些属性适用于带材质的对象（网格和蒙皮网格）。它们也可以用于（例如）[着色器替换](https://github.com/general/shader-replacements)各节的 `MATERIALS = …` 参数。

- `material:X`：材质名称；
- `shader:X`：着色器名称；
- `vegetation:yes`/`:no`：树木和草地；
- `dynamic:yes`/`:no`：自主移动的物体（树木、草地、旗帜）；
- `supportsDamage:yes`/`:no`：支持损坏效果的材质（例如「ksPerPixelMultiMap_damage_dirt」）；
- `alphaBlend:yes`/`:no`：材质使用 Alpha 混合；
- `alphaTest:yes`/`:no`：材质使用 Alpha 测试；
- `isTextureDefault:X`²：纹理 X 是否为默认纹理而非来自涂装；
- `isTextureSlotDefault:X`²：槽位 X 中的纹理是否为默认纹理而非来自涂装；
- `texture:X`：任意纹理的名称；
- `materialProperty:X`²：材质是否具有属性 X；
- `materialResource:X`²：材质是否具有纹理槽位 X。

##### 网格属性

这些属性仅与网格匹配。

- `renderable:yes`/`:no`：不可渲染的网格用于物理；
- `transparent:yes`/`:no`：透明标志；
- `static:yes`/`:no`：静态标志（通常分配给赛道网格）；
- `largerThan:N`：网格包围球的直径是否大于 N 米（不考虑父节点的缩放）；
- `castsShadows:yes`/`:no`：投射阴影选项；
- `lodIn:N`：LOD 进入距离是否在 N 米的 0.5 米范围内；
- `lodOut`：LOD 退出距离是否在 N 米的 0.5 米范围内；
- `hasLodDistance:yes`/`:no`：网格是否定义了 LOD 距离；
- `wet:yes`/`:no`：网格在雨天是否会淋湿（车辆内部的一些网格始终保持完全干燥）；
- `mirror:yes`/`:no`：车辆后视镜网格；
- `windscreenGeneratedUV:yes`/`:no`：RainFX 为挡风玻璃和后视镜生成的备用 UV；
- `layer:N`：网格层级（即其细节级别，第 5 层的网格仅在世界细节为高时绘制）；
- `actsAsHeadlights:yes`/`:no`：基于车辆自发光配置；
- `actsAsBrakeLights:yes`/`:no`：基于车辆自发光配置。

##### 蒙皮网格属性

- `transparent:yes`/`:no`：透明标志；
- `castsShadows:yes`/`:no`：投射阴影选项；
- `hasLodDistance:yes`/`:no`：网格是否定义了 LOD 距离；
- `layer:N`：网格层级（即其细节级别，第 5 层的网格仅在世界细节为高时绘制）。

所有索引均从 0 开始。

¹ 在 0.1.80-preview400 之前的 CSP 版本中，不支持 `:no` 选项，请使用取反写法（`!first:yes`）。
² 必须精确匹配，不支持「?」。

### 复合查询

要同时使用多个属性，可以将查询组合成复合表达式。首先在表达式两端加上「{」和「}」，然后在其中编写复合条件。支持的运算符：

- `^`：逻辑**非**；
- `&`：逻辑**与**；
- `|`（或 `,`）：逻辑**或**。

可以使用括号来指定明确的优先级（不用括号时「!」优先，其次是「&」）。几个例子：

- `{ RT_DRIVER_Face & ( isTextureDefault:DRIVER_Face.dds | isTextureDefault:DRIVER_Face_NM.dds ) }`；
- `{ transparent:yes & alphaBlend:yes & ( shader:ksPerPixelReflection | shader:smGlass? ) }`。

### 更多补充

请注意：CSP 之所以允许在配置中直接用 `MESHES = A, B, C` 这样的方式列出节点，仅仅是因为 CSP 的配置解析器处理的永远是列表，所以在该示例中它读取到的是三个查询。而另一方面，处理场景的 Lua API 只接受单个查询，因此在那里你需要使用 `ac.findMeshes('{ A, B, C }')`。

另外，如果你在使用着色器替换，请尽量考虑用 `MATERIALS` 代替 `MESHES = material:…`。尽管已有一些优化，但如果你的着色器替换按网格逐个修改材质属性之类的内容，CSP 有时仍不得不为每个网格单独复制一份材质。

