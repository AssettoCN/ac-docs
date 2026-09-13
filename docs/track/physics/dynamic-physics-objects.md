---
title: 动态物理对象
---


> 汉化标题：赛道 – 动态物理对象  
> 原文页面：Tracks-–-Dynamic-physics-objects  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-11T23:59:00+08:00  

CSP 0.1.78 为启用扩展物理的赛道新增了一个选项，用于详细配置动态物理对象（即 “AC_POBJECT_…” 类对象）的行为。现在可以重新定义它们的质量、修改碰撞参数、使用几何碰撞体，并启用这些对象之间的碰撞。

<a href="https://gfycat.com/ThreadbareWildDwarfmongoose"><img src="https://thumbs.gfycat.com/ThreadbareWildDwarfmongoose-size_restricted.gif"></a>

### 语法

```ini
; data/surfaces.ini:

[DYNAMIC_OBJECTS_...]
MESHES = AC_POBJECT_1?    ; 对象名称过滤器
DETECT_BOX_COLLIDER = 0   ; 设为 1 时，CSP 会尝试自动检测碰撞体网格是否
                          ; 为盒子，若是，则将其替换为尺寸合适的盒形碰撞体，
                          ; 并带有正确的重心
MASS = 1                  ; 质量，单位 kg（这些对象在 AC 中的默认质量为 1 kg）
LINEAR_DAMPING = 0.9      ; 线性运动的阻尼（增大可让对象更快停下）
ANGULAR_DAMPING = 0.9     ; 角运动的阻尼
INTERCOLLISION = 1        ; 设为 1 时，对象可以与同样开启该标志的其他对象发生碰撞
COLLIDER_DEBUG = 1, 0, 0  ; 设置后，对象将显示其几何碰撞体的轮廓
COG_OFFSET = X, Y, Z      ; 重心的可选偏移

; 碰撞参数
BOUNCE = 0.5             ; 回弹系数
FRICTION = 0.9           ; 接触摩擦
INTENSITY = 0.1          ; 碰撞强度（影响损伤、音效和视觉效果）
                         ; 其他碰撞参数在此同样适用

; 几何碰撞体
NO_MESH_COLLIDER = 1     ; 若使用几何碰撞体，添加此选项可禁用网格碰撞体

; 这些描述可以包含多个碰撞体定义（例如，圆锥可以用一个盒形碰撞体和一个胶囊碰撞体大致近似）
; 几何碰撞体：球体
COLLIDER_SPHERE_0 = R                   ; 添加具有给定半径（单位米）的新球形碰撞体
COLLIDER_SPHERE_0_OFFSET = X, Y, Z      ; 可选偏移

; 几何碰撞体：盒形
COLLIDER_BOX_1 = W, H, L                ; 添加具有给定宽度、高度和长度的新盒形碰撞体
COLLIDER_BOX_1_OFFSET = X, Y, Z         ; 可选偏移
COLLIDER_BOX_1_DIRECTION = 0, 0, 1      ; 用于确定盒子朝向的可选方向
COLLIDER_BOX_1_UP = 0, 1, 0             ; 用于确定盒子朝向的可选上向量

; 几何碰撞体：胶囊（类似带半球端盖的圆柱，比圆柱更快）
COLLIDER_CAPSULE_2 = R                  ; 添加具有给定半径（单位米）的新胶囊碰撞体
COLLIDER_CAPSULE_2_OFFSET = X, Y, Z     ; 可选偏移
COLLIDER_CAPSULE_2_DIRECTION = 0, 0, 1  ; 胶囊的方向
COLLIDER_CAPSULE_2_LENGTH = L           ; 长度，单位米

; 或者，可以不用偏移、方向和长度，而是直接设置起点和终点
COLLIDER_CAPSULE_3 = R
COLLIDER_CAPSULE_3_FROM = X, Y, Z       ; 起点
COLLIDER_CAPSULE_3_TO = X, Y, Z         ; 终点

; 几何碰撞体：圆柱（类似带平面端盖的胶囊，稍慢）
COLLIDER_CYLINDER_4 = R                 ; 添加具有给定半径（单位米）的新圆柱碰撞体
                                        ; 其他参数与胶囊相同
```

如果两个不同的节匹配到同一个对象，两者都会生效，后定义的节会覆盖先前定义的节所设置的值（按数字顺序）。另外请注意：如果你的赛道使用了扩展物理且不存在任何 `[DYNAMIC_OBJECTS_...]` 节，`DETECT_BOX_COLLIDER` 会自动生效。若要禁用它（以防万一），可以添加类似这样的内容：

```ini
[DYNAMIC_OBJECTS_...] 
MESHES = ?
DETECT_BOX_COLLIDER = 0
```

