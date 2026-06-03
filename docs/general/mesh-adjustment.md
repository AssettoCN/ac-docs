---
title: 网格调整
---

# 网格调整

使用这些选项可以调整网格的对象属性。

```ini
[MESH_ADJUSTMENT_...]
MESHES = some_mesh
; MATERIALS = some_material  ; 使用相同材质的所有对象都会受影响
MOVE_TO = some_node
MOVE_IN_FRONT = meshfilter
LAYER = 0  ; 世界细节设置的层
IS_ACTIVE = 1
IS_TRANSPARENT = 0 ; 对象的透明标志
IS_RENDERABLE = 0
CAST_SHADOWS = 1
```

对于节点：

```ini
[NODE_ADJUSTMENT_...]
NODES = some_node
MOVE_TO = some_other_node         ; 这个或
MOVE_IN_FRONT = some_other_node   ; 那个
IS_ACTIVE = 1
```

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Mesh-adjustment) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
