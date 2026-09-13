---
title: 网格调整
---


> 汉化标题：网格调整  
> 原文页面：Mesh-adjustment  
> 原文锚点：976c199  
> 汉化时间：2026-09-12T19:00:00+08:00  

使用这些选项可以调整网格的对象属性。

```ini
[MESH_ADJUSTMENT_...]
MESHES = some_mesh
; MATERIALS = some_material  ; 使用相同材质的所有对象都会受到影响
MOVE_TO = some_node
MOVE_IN_FRONT = meshfilter
LAYER = 0  ; 世界细节设置所用的层级
IS_ACTIVE = 1
IS_TRANSPARENT = 0 ; 对象的透明标志
IS_RENDERABLE = 0
CAST_SHADOWS = 1
```

对于节点：
```ini
[NODE_ADJUSTMENT_...]
NODES = some_node
MOVE_TO = some_other_node         ; 此项或
MOVE_IN_FRONT = some_other_node   ; 那项
IS_ACTIVE = 1
```

