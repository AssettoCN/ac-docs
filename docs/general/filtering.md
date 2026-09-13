---
title: 过滤
---


> 汉化标题：通用 – 过滤  
> 原文页面：General-–-Filtering  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T19:00:00+08:00  
> 译注：源文 `A ^ B` 误标为 NOR，按描述（任一匹配且不同时）译作异或；`modelRoot` 的说明与 `last` 重复，按其功能译作模型根节点  

在定义灯光序列、材质调整或例如自发光对象时，配置需要指定一个要操作的目标实体。在多数此类情况下，也可以设置为一个对象列表：

```ini
[EMISSIVE_LIGHT_0]
MESHES = mesh0, mesh1, mesh2
...
```

### 掩码

为了让事情更简单，还可以使用简单的掩码。也许你注意过 Windows 用 “*” 表示“任意数量的任意符号”？Patch 出于兼容性原因使用 “?” 实现同样的目的。

```ini
[EMISSIVE_LIGHT_0]
MESHES = mesh?  ;还会包含其他所有以 “mesh” 开头的网格，例如 mesh_99
...
```

### 属性

同样支持按属性过滤，需要时还可配合掩码：

```ini
[SHADER_REPLACEMENT_0]
MESHES = texture:cobbles_?.dds
SHADER = nePerPixelMultiMap_parallax
...
```

请不要在 “:” 前后添加空格，它不像 CM 的过滤那样灵活。

##### 已知属性与示例

- 网格：
  - `material:Material #91`：材质名；
  - `renderable:yes`：网格是否可渲染；
  - `transparent:yes`：网格是否被标记为透明；
  - `hasLodDistance:yes`：对赛道而言，是否设置了任意 LOD 距离；
  - `mirror:yes`：网格是否被指定用于后视镜（0.1.62 新增）。
- 节点与网格：
  - `parent:COCKPIT_?R`：父节点的名称；
  - `child:some_mesh`：某个子节点的名称；
  - `lod:A`：对车辆而言，指定 LOD（配合扩展过滤使用；见示例）；
  - `active:yes`：节点是否处于激活状态（0.1.62 新增）；
  - `insideInterior:yes`：节点位于内饰内（0.1.62 新增）；
  - `insideSteeringWheel:yes`：节点位于方向盘内（0.1.62 新增）；
  - `first:yes`：网格是否为第一个子节点（0.1.62 新增）；
  - `last:yes`：网格是否为最后一个子节点（0.1.62 新增）。
  - `modelRoot:yes`：节点是否为模型根节点（0.1.62 新增）。
- 网格与材质：
  - `shader:ksPerPixel?`：着色器名称；
  - `texture:NULL.dds`：若至少任意一张使用中的贴图与该名称匹配（不区分大小写）则为真；
  - `materialProperty:dirtyLevel`：检查着色器是否具有某个属性；
  - `materialResource:txBlur`：检查着色器是否具有某个资源；
  - `supportsDamage:yes`：检查着色器是否支持损坏效果；
  - `alphaBlend:yes`：材质是否启用了 alpha 混合（0.1.62 新增）；
  - `alphaTest:yes`：材质是否启用了 alpha 测试（0.1.62 新增）；
  - `vegetation:yes`：植被类着色器，例如树木或草地（0.1.62 新增）；
  - `dynamic:yes`：“会动”的着色器，例如树、草或旗帜（0.1.62 新增）。

自 0.1.62 起，在 `parent:…` 之类的内容中也可以使用属性，而不仅限于名称。例如，如果你想移动某个赛道网格使其最后渲染，下面是一段 Highlands 的配置：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = decal_01, decal_02, decal_solids
MOVE_MESH_BEHIND = parent:modelRoot:y
```

（解释一下 `MOVE_MESH_BEHIND` 的工作方式：它会找出所有匹配给定过滤器的节点和网格，然后移动原始网格，使其渲染在被找到的那个网格*之后*。过滤器 `parent:modelRoot:y` 会找出赛道根节点中的所有子节点，因此 `MOVE_MESH_BEHIND` 会把贴花移动到最后一个赛道网格之后。把这些写下来更多是给我自己留个备注，因为我刚才也被它搞糊涂了。）

### 扩展过滤

自 **v0.1.25-preview183** 起支持扩展过滤，可使用逻辑表达式、分组等功能。要启用它，首先把查询用花括号括起来，以表明这是一个扩展过滤器。其余部分与 CM 中的过滤非常相似：

```ini
[REFLECTIONS_FX]
MASK_CUBEMAP_SKIP = MIRROR_GEO, { GEO_INT? & parent:COCKPIT_HR }  ;常规查询可以像以前一样写在同一处
```

我建议用引号把扩展查询整体括起来；如果想使用某些特殊符号，再把里面的各个关键词分别用不同的引号包起来：

```ini
[MESH_ADJUSTMENT_...]
MESHES = '{ "some mesh^4" & !shader:ksPerPixel }'  ;空格可有可无，但有助于阅读
...
```

支持的表达式，按优先级从高到低排列（当然，你可以用括号“(”和“)”来改变运算顺序）：

- `! A`：NOT（非），当 A 不匹配时匹配；
- `A & B`：AND（与），当两侧都匹配时匹配；
- `A ^ B`：XOR（异或），当 A 或 B 中恰好一方匹配、而非两者同时匹配时匹配；
- `A | B`：OR（或），当 A 或 B 至少一方匹配（或两者都匹配）时匹配。

我认为在超过 99% 的情况中都用不到这东西，但有时它确实能帮上忙。举个例子，拿 Highlands 配置来说，它通过一个 165 MB 的替换 KN5 添加发光窗户。有时候这个文件可能损坏或加载失败，没有它的话，修改 “ksEmissive” 会让整栋建筑发光，而不只是窗户。而扩展过滤允许把它改写成：

```ini
[MATERIAL_ADJUSTMENT_2]
MATERIALS = '{ ( buildings_ext2, Gazebo_Tent ) & shader:ksPerPixelMultiMap_emissive }'
KEY_0 = ksEmissive
...
```

建筑不会再发光了，因为只有当着色器被改为 “ksPerPixelMultiMap_emissive” 时它才会生效。

### 示例

- 取 LOD A 中的 mesh1 和 LOD B 中的 mesh2（防止 LOD B 中存在错误的 mesh1、LOD A 中存在错误的 mesh2），用于车辆：

  ```ini
  MESHES = '{ lod:A & mesh1 }', '{ lod:B & mesh2 }'
  ```

### 后续计划添加的功能

- 更多可供过滤的属性。

