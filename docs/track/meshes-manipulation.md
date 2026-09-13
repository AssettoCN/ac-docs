---
title: 网格操作
---


> 汉化标题：赛道 – 网格操作  
> 原文页面：Tracks-–-Meshes-manipulation  
> 原文锚点：252f19b  
> 汉化时间：2026-09-12T00:00:00+08:00  

理想情况下，这些操作应该在 3D 编辑器中完成，但有时可能做不到，比如在为现成赛道制作配置时。

### 平滑法线

用于修复赛道某些表面不够平滑的问题。在 Rain FX 下这一点尤其明显——水洼中的反射会破碎。现在有一种快捷的方法，通过配置来修复它。

```ini
[SMOOTH_NORMALS_...]
MESHES = mesh0, …         ; 受影响的网格列表
MATERIALS = material0, …  ; 受影响的材质列表（用其一，或两者同用）
PRECISION = 0.0001        ; 平滑阈值
NORMAL_CONTRIBUTION = 0   ; 检测边缘时法线所占的权重
```

其工作方式是：取出找到的所有网格，找出彼此距离小于 `PRECISION` 的顶点，并对它们的法线取平均。如果 `NORMAL_CONTRIBUTION` 不为零，分组阶段它会与顶点位置相加，从而允许保留一些棱边。不过通常在沥青路面这类东西上使用时，并不需要该参数。

示例：

```ini
[SMOOTH_NORMALS_...]
MATERIALS = asph
PRECISION = 0.01
NORMAL_CONTRIBUTION = 0
```

### 法线调整

例如，这一项可用于重新定向树叶的法线，使其朝上。

```ini
[ALTER_NORMALS_...]
MESHES = mesh0, …         ; 受影响的网格列表
MATERIALS = material0, …  ; 受影响的材质列表（用其一，或两者同用）
ALTER = 0, 1, 0           ; 可选的法线向量重定向（将向量转向所给向量的方向）
; OFFSET = 0, -0.01, 0          ; 可选偏移
```

示例：

```ini
[ALTER_NORMALS_...]
MESHES = flat.trees.?
OFFSET = 0, 1e9, 0
```

### 网格拆分

将网格拆分为独立的元素。请务必谨慎使用：这会增加绘制调用（draw call）的次数，未必总是好事。

```ini
[SPLIT_MESHES_...]
MESHES = mesh0, …               ; 受影响的网格列表
MATERIALS = material0, …        ; 受影响的材质列表（用其一，或两者同用）
NAME_FORMAT = '{Name}.{Index}'  ; 新网格的名称
ORDER_PIVOT = X, Z, Y           ; 分离节点的排序从此位置开始（离该位置最近的
                                ; 分离网格将获得索引 0）
```

名称格式中可用的替换项：

- `Name`：原始网格名称；
- `Index`：元素的索引（基于它到 `ORDER_PIVOT` 的距离）；
- `Position`：其 AABB 中心在世界坐标中的位置；
- `NearestPitStop`：最近的维修区车位索引；
- `NearestStart`：最近的发车位置索引。

示例：

```ini
[SPLIT_MESHES_...]
MESHES = PitwallSpotLightsGlass
NAME_FORMAT = PitwallSpotLightsGlass_{NearestPitStop}
```

### 网格细分

在远景几何体方面，一些既充当远景又充当底层地面的巨型低多边形网格可能引发问题，Shuto 赛道就是如此。此功能可以提供帮助。

```ini
[SUBDIVIDE_MESHES_...]
MESHES = mesh0, …         ; 受影响的网格列表
MATERIALS = material0, …  ; 受影响的材质列表（用其一，或两者同用）
ITERATIONS = 2            ; 迭代次数，默认值为 1
```

示例：

```ini
[SUBDIVIDE_MESHES_...]
MESHES = material:mat_main_background
ITERATIONS = 2
```

### 包裹网格

要让对象可动画化，其网格必须包裹在节点中，但如果赛道 KN5 是按 track 方式保存的，一切都会被摊平。一般我建议把动态对象保存到按 car 方式保存的独立 KN5 中，但如果做不到，也可以改为把现有的摊平网格包裹进一个节点：

```ini
[WRAP_MESHES_...]
NAME = node          ; 新节点的名称
MESHES = mesh0, …    ; 要加入的网格列表
PIVOT_POS = X, Z, Y  ; 所创建节点的枢轴位置

; 或者，用向量设置节点朝向：
PIVOT_DIR = X, Z, Y  ; 其 Z 轴方向（或使用 PIVOT_DIR_POINT 以世界坐标指定节点要看向的点）
PIVOT_UP = X, Z, Y   ; 其 Y 轴方向（或使用 PIVOT_UP_POINT 以世界坐标指定）

; 或者用角度（弧度）：
PIVOT_HEADING = …
PIVOT_PITCH = …
PIVOT_ROLL = …
```

示例：

```ini
[WRAP_MESHES_...]
NAME = windmill_spin
MESHES = windmill_spin
PIVOT_POS = -5.47, 9.178, -27.592
```

