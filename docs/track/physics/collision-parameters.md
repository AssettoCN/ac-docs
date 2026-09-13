---
title: 碰撞参数
---


> 汉化标题：赛道 – 碰撞参数  
> 原文页面：Tracks-–-Collision-parameters  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-11T23:59:00+08:00  

赛道现在可以为不同的网格覆盖碰撞参数。除了制作低摩擦墙面或高回弹地面网格这类显而易见的用途外，更重要的是它还可以用来调整碰撞的软硬程度。较软的碰撞可以更好地近似轮胎墙之类的场景，而在另一些情况下，较硬的碰撞则有助于避免高速碰撞时车辆穿透物体。

### 语法

所有参数均为可选（但若使用 `MAX_DEPTH`，请至少再添加一个其他参数，至少是 `INTENSITY = 1`）：

```ini
; data/surfaces.ini:

[COLLISION_PARAMS_...]
MESHES = ?WALL?        ; 应用新参数的网格名称
COLLIDERS = CAPSULE_?  ; 几何碰撞体的名称
SOFT_ERP = 0.8         ; 误差缩减参数
SOFT_CFM = 0.0001      ; 约束力混合，值越高碰撞越软
BOUNCE = 0.5           ; 回弹参数
FRICTION = 0.25        ; 接触摩擦
INTENSITY = 1          ; 碰撞强度（影响损伤、音效和视觉效果）
MAX_DEPTH = 0.2        ; 若设置此参数且碰撞深度超过该值，碰撞将变为
                       ; 硬碰撞：可能有助于提升性能，并避免物体
                       ; 穿过墙体
RIGID_WITH_BODIES = 0  ; 设为 1 时，与 3D 碰撞体的碰撞将完全刚性
RIGID_WITH_BOXES = 0   ; 设为 1 时，与盒形碰撞体（通常用于车辆底部）
                       ; 的碰撞将完全刚性
```

相同的逻辑也适用于[额外服务器选项](/server/options)的 `[CUSTOM_COLLISIONS]`，以及几何碰撞体和动态对象的配置。有关几何碰撞体的更多信息请见[这里](/track/physics/geometric-colliders)。

注意：如果你要制作柔软的轮胎墙或类似的东西，还可以[让形变在视觉上呈现出来](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Deforming-walls)。

