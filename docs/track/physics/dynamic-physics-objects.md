---
title: 动态物理对象
---

# 动态物理对象

CSP 0.1.78 添加了一个选项，允许具有扩展物理的赛道详细配置动态物理对象（"AC_POBJECT_…" 类型的对象）的行为。现在可以重新定义它们的质量、更改碰撞参数、使用几何碰撞器以及启用这些对象之间的碰撞。

## 语法

```ini
; data/surfaces.ini:

[DYNAMIC_OBJECTS_...]
MESHES = AC_POBJECT_1?    ; 对象名称过滤器
DETECT_BOX_COLLIDER = 0   ; 设为 1 时，CSP 会尝试自动检测碰撞器网格是否
                           ; 为盒体，如果是，替换为具有正确重心的合适盒体碰撞器
MASS = 1                  ; 质量（千克），（AC 中这些对象的默认质量为 1 kg）
LINEAR_DAMPING = 0.9      ; 线性运动的阻尼（增加使对象更快停止）
ANGULAR_DAMPING = 0.9     ; 角运动的阻尼
INTERCOLLISION = 1        ; 设为 1 时，对象可以与具有相同标志的其他对象碰撞
COLLIDER_DEBUG = 1, 0, 0  ; 如果设置，对象将获得其几何碰撞器的轮廓
COG_OFFSET = X, Y, Z      ; 重心的可选偏移

; 碰撞参数
BOUNCE = 0.5             ; 弹跳系数
FRICTION = 0.9           ; 接触摩擦
INTENSITY = 0.1          ; 碰撞强度（影响损伤、音频和视觉效果）
                          ; 其他碰撞参数也适用于此处

; 几何碰撞器
NO_MESH_COLLIDER = 1     ; 如果使用几何碰撞器，添加此选项禁用网格碰撞器

; 这些描述可以包含多个碰撞器定义（例如，锥体可以粗略地用盒体和胶囊体近似）

; 几何碰撞器：球体
COLLIDER_SPHERE_0 = R                   ; 添加新的球形碰撞器，给定半径（米）
COLLIDER_SPHERE_0_OFFSET = X, Y, Z      ; 可选偏移

; 几何碰撞器：盒体
COLLIDER_BOX_1 = W, H, L                ; 添加新的盒体碰撞器，给定宽度、高度和长度
COLLIDER_BOX_1_OFFSET = X, Y, Z         ; 可选偏移
COLLIDER_BOX_1_DIRECTION = 0, 0, 1      ; 盒体方向的向量
COLLIDER_BOX_1_UP = 0, 1, 0             ; 盒体向上方向的向量

; 几何碰撞器：胶囊体（像带半球端盖的圆柱体，比圆柱体更快）
COLLIDER_CAPSULE_2 = R                  ; 添加新的胶囊碰撞器，给定半径（米）
COLLIDER_CAPSULE_2_OFFSET = X, Y, Z     ; 可选偏移
COLLIDER_CAPSULE_2_DIRECTION = 0, 0, 1  ; 胶囊方向
COLLIDER_CAPSULE_2_LENGTH = L           ; 长度（米）

; 或者，不使用偏移、方向和长度，可以设置起点和终点
COLLIDER_CAPSULE_3 = R
COLLIDER_CAPSULE_3_FROM = X, Y, Z       ; 起始点
COLLIDER_CAPSULE_3_TO = X, Y, Z         ; 结束点

; 几何碰撞器：圆柱体（像带平端盖的胶囊体，稍慢）
COLLIDER_CYLINDER_4 = R                 ; 添加新的圆柱碰撞器，给定半径（米）
                                        ; 其他参数与胶囊体相同
```

如果两个不同的部分匹配同一个对象，两者都会应用，后续部分会覆盖先前定义部分设置的值（按数字顺序排列）。另外请注意：如果你的赛道使用扩展物理且没有 `[DYNAMIC_OBJECTS_...]` 部分，`DETECT_BOX_COLLIDER` 会自动应用。要禁用它（以防万一），添加类似：

```ini
[DYNAMIC_OBJECTS_...] 
MESHES = ?
DETECT_BOX_COLLIDER = 0
```

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Dynamic-physics-objects) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
