---
title: 几何碰撞器
---

# 几何碰撞器

最初，AC 中赛道唯一可用的碰撞器类型是网格碰撞器，这对赛道表面和墙壁等效果不错，但对于一些其他类型的障碍物（例如灯杆）可能效果不佳。另外，如果你有一堆建筑物或薄的双面墙壁，用盒体碰撞器替换包含所有墙壁的网格可能会提供一些性能和稳定性改进。

## 语法

```ini
; data/surfaces.ini:

[_EXTENSION]
COLLIDER_DEBUG = 1  ; 设为 1 时，碰撞器的轮廓会被高亮显示（同时如果设置，
                     ; 碰撞器的实时重载也可用）

; 胶囊碰撞器：像圆柱体但两端有半球，比圆柱体更快；适合灯柱
[COLLIDER_CAPSULE_...]
RADIUS = 0.5         ; 胶囊半径

; 位置和方向可以这样定义：
LENGTH = 10          ; 胶囊长度（米）
POSITION = X, Y, Z   ; 胶囊中心的世界坐标位置
DIRECTION = 0, 1, 0  ; 方向（此处为垂直）

; 或者这样定义：
FROM = X, Y, Z       ; 世界坐标中的起始点
TO = X, Y, Z         ; 世界坐标中的结束点

; 圆柱碰撞器：像胶囊体但两端是平的，稍慢
[COLLIDER_CYLINDER_...]
... ; 参数与胶囊体相同

; 球体碰撞器：最快的选项（常规碰撞器中）
[COLLIDER_SPHERE_...]
POSITION = X, Y, Z   ; 世界坐标位置
RADIUS = 5           ; 半径（米）

; 盒体碰撞器
[COLLIDER_BOX_...]
POSITION = X, Y, Z   ; 世界坐标位置
SIZE = 10, 1, 5      ; 大小（米）：宽度、高度和长度
DIRECTION = 0, 0, 1  ; 方向向量
UP = 0, 1, 0         ; 向上的向量（用于倾斜的盒体）

; 平面碰撞器：平面内侧的所有东西都会被推到外侧；可能适用于
; 底层地面？或者封锁不可进入的区域？
[COLLIDER_PLANE_...]
POSITION = X, Y, Z   ; 平面位置
NORMAL = 0, 1, 0     ; 平面法线
```

此外，每个碰撞器都可以有这些属性：

```ini
[COLLIDER_SPHERE_...]
NAME = my_collider   ; 名称；由自定义碰撞参数的碰撞器过滤器使用
LAYER = 255          ; 碰撞器层
COLOR = R, G, B, A   ; 调试模式下可见的轮廓颜色
```

有关碰撞参数的更多信息请参阅[碰撞参数](./collision-parameters.md)。至于层，具有相同层的碰撞器将被分组在一起，当检查车辆和碰撞器之间的交叉时，CSP 会先检查车辆和碰撞器组之间的交叉，因此将附近的碰撞器分组到单独的层可能是个好主意。不过不用太担心：我希望将来添加一些东西让 CSP 自动将碰撞器分组到最优组中。

注意：你可以使用新的 Render Stats 应用及其 "Other threads" 按钮查看物理碰撞检查步骤花费多少时间。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Geometric-colliders) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
