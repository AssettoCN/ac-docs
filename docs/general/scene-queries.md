---
title: 场景查询
---

# 场景查询

许多 CSP 配置以及 Lua 中的 `ac.SceneReference()` 都期望对场景中的节点或网格的引用。对于大多数情况，简单的网格名称就可以了，但有时更高级的方式效果更好，以下是关于它们工作方式的详细说明。

首先，除非另有说明，所有这些查询都支持通配符 `?`，表示任意数量的任意符号。此外，匹配会尝试匹配整个字符串，所以如果你想搜索子字符串，请使用 `?keyword?` 模式。

## 属性

除了使用名称，查询还可以引用属性。其语法为 `property:value`，所以你可以使用 `material:MATERIAL_NAME` 代替 `MESH_NAME`。

### 特定节点

- `carRoot:N`：第 N 辆车的车辆根节点
- `driverRoot:N`：第 N 辆车的驾驶员根节点
- `driverNeck:N`：第 N 辆车的驾驶员颈部节点
- `sceneRoot:yes`/`:no`¹：根节点
- `carsRoot:yes`/`:no`¹：包含车辆的节点
- `trackRoot:yes`/`:no`¹：赛道根节点
- `staticRoot:yes`/`:no`¹：静态几何体根节点（即"BLURRED"）
- `dynamicRoot:yes`/`:no`¹：动态几何体根节点（即"UNBLURRED"）

从车辆或赛道配置中使用大多数这些属性将不起作用，它们在其查询中仅限于对应的节点。车辆和赛道 Lua 脚本也是如此，但其他类型的 Lua 脚本可以更自由地使用。

### 通用属性

这些属性适用于任何类型的对象。

- `class`：对象类型（已知：`node`、`model`、`carNodeSorter`、`nodeBoundingSphere`、`parent`、`nodeEvent`、`idealLine`、`particleSystem`、`staticParticleSystem`、`displayNode`、`textNode`、`cspNode`、`renderable`、`mesh`、`skinnedMesh`、`skidmarkBuffer`）
- `active:yes`/`:no`：激活状态
- `first:yes`/`:no`¹：是否为其父节点的第一个子节点
- `last:yes`/`:no`¹：是否为其父节点的最后一个子节点
- `lod:N`/`:A`/`:B`/…：对象来自特定 LOD（用于车辆模型）
- `modelRoot:yes`/`:no`：是否为 KN5 文件的根节点
- `driverPiece:yes`/`:no`：驾驶员模型中的对象
- `insideInterior:yes`/`:no`：车辆座舱中的对象
- `insideSteeringWheel:yes`/`:no`：车辆方向盘中的对象
- `insideWheel:yes`/`:no`：车辆车轮节点中的对象
- `insideSuspension:yes`/`:no`：车辆悬挂节点中的对象
- `insideNthWheel:N`：第 N 辆车轮中的对象
- `insideNthSuspension:N`：第 N 辆车悬挂中的对象
- `parent:X`：如果父节点匹配 X（X 也可以是属性查询）
- `child:X`：如果节点有匹配 X 的子节点。比其他查询更昂贵，请谨慎使用。

### 材质相关属性

这些属性适用于带材质的对象（网格和蒙皮网格）。它们也可以用于例如[着色器替换](./shader-replacements)节的 `MATERIALS = …` 参数中。

- `material:X`：材质名称
- `shader:X`：着色器名称
- `vegetation:yes`/`:no`：树木和草地
- `dynamic:yes`/`:no`：自主移动的实体（树木、草地、旗帜）
- `supportsDamage:yes`/`:no`：支持损坏的材质（如 `ksPerPixelMultiMap_damage_dirt`）
- `alphaBlend:yes`/`:no`：材质使用 Alpha 混合
- `alphaTest:yes`/`:no`：材质使用 Alpha 测试
- `isTextureDefault:X`²：如果纹理 X 是默认的而非来自皮肤
- `isTextureSlotDefault:X`²：如果槽位 X 中的纹理是默认的而非来自皮肤
- `texture:X`：任何纹理的名称
- `materialProperty:X`²：如果材质有属性 X
- `materialResource:X`²：如果材质有纹理槽位 X

### 网格属性

这些仅匹配网格。

- `renderable:yes`/`:no`：非可渲染网格用于物理
- `transparent:yes`/`:no`：透明标志
- `static:yes`/`:no`：静态标志（通常分配给赛道网格）
- `largerThan:N`：如果网格包围球直径大于 N 米（不考虑父级缩放）
- `castsShadows:yes`/`:no`：阴影投射选项
- `lodIn:N`：如果 LOD 进入距离在 N 米的 0.5 以内
- `lodOut:N`：如果 LOD 退出距离在 N 米的 0.5 以内
- `hasLodDistance:yes`/`:no`：如果网格有定义的 LOD 距离
- `wet:yes`/`:no`：网格在雨天会变湿（一些车辆内部网格保持完全干燥）
- `mirror:yes`/`:no`：车辆后视镜网格
- `windscreenGeneratedUV:yes`/`:no`：RainFX 为挡风玻璃和后视镜生成的替代 UV
- `layer:N`：网格层（即其细节级别，层 5 的网格仅在高世界细节时绘制）
- `actsAsHeadlights:yes`/`:no`：基于车辆自发光配置
- `actsAsBrakeLights:yes`/`:no`：基于车辆自发光配置

### 蒙皮网格属性

- `transparent:yes`/`:no`：透明标志
- `castsShadows:yes`/`:no`：阴影投射选项
- `hasLodDistance:yes`/`:no`：如果网格有定义的 LOD 距离
- `layer:N`：网格层（即其细节级别，层 5 的网格仅在高世界细节时绘制）

所有索引从零开始。

¹ 在 0.1.80-preview400 之前的 CSP 版本中不支持 `:no` 选项，请使用取反（`!first:yes`）。

² 必须精确匹配，不支持 `?` 通配符。

## 复杂查询

要同时使用多个属性，可以将查询组合成复杂表达式。首先在表达式两端加上 `{` 和 `}`，在其中编写复杂查询。支持的运算符：

- `^`：逻辑**非**
- `&`：逻辑**与**
- `|`（或 `,`）：逻辑**或**

可以使用括号指定显式顺序（没有括号时 `!` 优先，然后是 `&`）。几个示例：

- `{ RT_DRIVER_Face & ( isTextureDefault:DRIVER_Face.dds | isTextureDefault:DRIVER_Face_NM.dds ) }`
- `{ transparent:yes & alphaBlend:yes & ( shader:ksPerPixelReflection | shader:smGlass? ) }`

## 其他注意事项

请注意：CSP 允许在配置中简单地通过 `MESHES = A, B, C` 列出节点，原因仅仅是 CSP 中的配置解析器总是处理列表，所以在这个例子中它读取三个查询。另一方面，Lua API 处理场景时只期望单个查询，所以你需要使用 `ac.findMeshes('{ A, B, C }')`。

此外，如果你使用着色器替换，在可能的情况下请考虑使用 `MATERIALS` 而不是 `MESHES = material:…`。虽然有一些优化，但有时如果你的着色器替换在每个网格基础上更改材质属性等内容，CSP 仍然不得不为每个单独的网格复制材质。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-Scene-queries) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
