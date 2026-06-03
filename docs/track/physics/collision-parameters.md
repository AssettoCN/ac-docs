---
title: 碰撞参数
---

# 碰撞参数

赛道现在可以为不同网格覆盖碰撞参数。除了明显的用途如创建低摩擦墙壁或超弹性地面网格外，更重要的是这也可以用于调整碰撞柔软度。更柔软的碰撞可以更好地近似轮胎墙等，而更硬的碰撞在高速碰撞时可以帮助防止车辆穿过物体。

## 语法

所有参数都是可选的（但如果使用 `MAX_DEPTH`，至少添加一个其他参数，至少 `INTENSITY = 1`）：

```ini
; data/surfaces.ini:

[COLLISION_PARAMS_...]
MESHES = ?WALL?        ; 获取新参数的网格名称
COLLIDERS = CAPSULE_?  ; 几何碰撞器名称
SOFT_ERP = 0.8         ; 误差减少参数
SOFT_CFM = 0.0001      ; 约束力混合，越高碰撞越柔软
BOUNCE = 0.5           ; 弹跳参数
FRICTION = 0.25        ; 接触摩擦
INTENSITY = 1          ; 碰撞强度（影响损伤、音频和视觉效果）
MAX_DEPTH = 0.2        ; 如果设置且碰撞深度超过该参数，碰撞变为
                        ; 硬碰撞：可能有助于提高性能并避免物体穿过墙壁
RIGID_WITH_BODIES = 0  ; 设为 1 时，与 3D 碰撞器的碰撞将完全刚性
RIGID_WITH_BOXES = 0   ; 设为 1 时，与盒体（通常用于车底）的碰撞将完全刚性
```

相同的逻辑也适用于[额外服务器选项]中 `[CUSTOM_COLLISIONS]`，或几何碰撞器和动态对象配置。有关几何碰撞器的更多信息请参阅[几何碰撞器](./geometric-colliders.md)。

注意：如果你正在制作柔软的轮胎墙或类似的东西，还可以让[变形在视觉上应用](#)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Collision-parameters) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
