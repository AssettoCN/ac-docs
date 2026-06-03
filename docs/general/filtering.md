---
title: 过滤规则
---

# 过滤规则

在定义灯光系列、材质调整或自发光对象等配置时，需要指定要操作的实体。大多数情况下，你可以设置一个对象列表：

```ini
[EMISSIVE_LIGHT_0]
MESHES = mesh0, mesh1, mesh2
...
```

## 遮罩匹配

为了简化操作，你也可以使用简单的遮罩匹配。你可能注意到 Windows 使用 `*` 表示"任意数量的任意符号"，CSP 则使用 `?` 来达到相同目的（出于兼容性原因）：

```ini
[EMISSIVE_LIGHT_0]
MESHES = mesh?  ; 也会匹配以"mesh"开头的任何网格，如 mesh_99
...
```

## 属性过滤

还支持按属性进行过滤，必要时可与遮罩配合使用：

```ini
[SHADER_REPLACEMENT_0]
MESHES = texture:cobbles_?.dds
SHADER = nePerPixelMultiMap_parallax
...
```

::: warning 注意
请不要在 `:` 前后添加空格，它不像 CM 的过滤那样灵活。
:::

### 已知属性与示例

- **网格（Meshes）：**
  - `material:Material #91`：材质名称
  - `renderable:yes`：网格是否可渲染
  - `transparent:yes`：网格是否标记为透明
  - `hasLodDistance:yes`：对于赛道，是否设置了 LOD 距离
  - `mirror:yes`：网格是否用于后视镜（v0.1.62 新增）

- **节点和网格（Nodes and meshes）：**
  - `parent:COCKPIT_?R`：父节点名称
  - `child:some_mesh`：某个子节点名称
  - `lod:A`：对于车辆，指定 LOD（用于扩展过滤，见示例）
  - `active:yes`：节点是否激活（v0.1.62 新增）
  - `insideInterior:yes`：节点位于座舱内（v0.1.62 新增）
  - `insideSteeringWheel:yes`：节点位于方向盘内（v0.1.62 新增）
  - `first:yes`：是否为第一个子节点（v0.1.62 新增）
  - `last:yes`：是否为最后一个子节点（v0.1.62 新增）
  - `modelRoot:yes`：是否为模型根节点（v0.1.62 新增）

- **网格和材质（Meshes and materials）：**
  - `shader:ksPerPixel?`：着色器名称
  - `texture:NULL.dds`：如果至少有一个使用的纹理匹配该名称（不区分大小写）则为真
  - `materialProperty:dirtyLevel`：检查着色器是否有某个属性
  - `materialResource:txBlur`：检查着色器是否有某个资源
  - `supportsDamage:yes`：检查着色器是否支持损坏
  - `alphaBlend:yes`：材质是否启用了 Alpha 混合（v0.1.62 新增）
  - `alphaTest:yes`：材质是否启用了 Alpha 测试（v0.1.62 新增）
  - `vegetation:yes`：植被着色器，如树木或草地（v0.1.62 新增）
  - `dynamic:yes`："移动"着色器，如树木、草地或旗帜（v0.1.62 新增）

自 v0.1.62 起，对于 `parent:…` 等属性，你可以在内部使用属性而不仅仅是名称。例如，如果你想移动一个赛道网格使其最后渲染，以下是 Hong 配置的一部分：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = decal_01, decal_02, decal_solids
MOVE_MESH_BEHIND = parent:modelRoot:y
```

（说明：`MOVE_MESH_BEHIND` 的工作方式是找到所有匹配给定过滤器的节点和网格，然后将原始网格移动到找到的最后一个之后渲染。过滤器 `parent:modelRoot:y` 会找到赛道根节点中的所有子节点，因此 `MOVE_MESH_BEHIND` 将贴花移到所有赛道网格之后。）

## 扩展过滤

自 **v0.1.25-preview183** 起，支持扩展过滤，包括逻辑表达式、分组等功能。要使用扩展过滤，首先将查询用花括号 `{}` 包裹起来，表示这是一个扩展过滤器。其余语法与 CM 中的过滤非常相似：

```ini
[REFLECTIONS_FX]
MASK_CUBEMAP_SKIP = MIRROR_GEO, { GEO_INT? & parent:COCKPIT_HR }  ; 可以像以前一样在同一个位置列出常规查询
```

建议使用引号将扩展查询分隔开，并在内部用引号包裹可能包含特殊符号的关键字：

```ini
[MESH_ADJUSTMENT_...]
MESHES = '{ "some mesh^4" & !shader:ksPerPixel }'  ; 空格可选，但有助于可读性
...
```

支持的表达式（从高到低优先级，可以使用括号 `(` 和 `)` 改变顺序）：

- `! A`：NOT，当 A 不匹配时匹配
- `A & B`：AND，当两侧都匹配时匹配
- `A ^ B`：NOR，当 A 或 B 中恰好一个匹配时匹配（但不能同时匹配）
- `A | B`：OR，当 A 或 B 至少一个匹配时匹配（或两者都匹配）

虽然超过 99% 的情况用不到这个功能，但有时确实很有帮助。例如，Highlands 配置中通过 165MB 的替换 KN5 添加发光窗户。有时该文件可能加载失败，此时将 `ksEmissive` 改为发光会导致整栋建筑发光而不是仅窗户发光。使用扩展过滤可以重写：

```ini
[MATERIAL_ADJUSTMENT_2]
MATERIALS = '{ ( buildings_ext2, Gazebo_Tent ) & shader:ksPerPixelMultiMap_emissive }'
KEY_0 = ksEmissive
...
```

这样就不会出现整栋建筑发光的情况，因为只有当着色器被更改为 `ksPerPixelMultiMap_emissive` 时才生效。

## 示例

- 从 LOD A 中选取 mesh1，从 LOD B 中选取 mesh2（防止 LOD B 中有错误的 mesh1，LOD A 中有错误的 mesh2），用于车辆：

```ini
MESHES = '{ lod:A & mesh1 }', '{ lod:B & mesh2 }'
```

## 计划中的功能

- 更多可过滤的属性。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-Filtering) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
