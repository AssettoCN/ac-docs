---
title: 火花
---


> 汉化标题：车辆 – 火花  
> 原文页面：Cars-–-Sparks  
> 原文锚点：e273150  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：skidpad 译作「赛道摩擦垫」；源文中 COLLIDER_1_SPARKS_AS 的注释误写为 COLLIDER_0，按原意译出  

碰撞时会从碰撞点沿赛道碰撞体表面的切平面发射火花。嗯，理论上应该是这样工作的。

要知道，粒子的行为和寿命可以针对不同的碰撞体进行调整。默认情况下，补丁为普通车辆使用近似钢铁的火花，并假设开轮式赛车的车身由碳纤维制成，因此它们在普通碰撞中不产生火花。补丁还会尝试找到赛道摩擦垫（skidpad）的碰撞体（应在 X 轴上居中、长于 1.8 米且宽度小于 1 米），并将其视为钢制（对于 1994 年前制造的车辆）或钛制（对于 2014 年后制造的车辆）。当然，这些设置中有许多可以通过配置显式指定，不过一如既往，我建议尽量少设参数，并保持语义化，而不是去设置颜色之类的细节。

由于大多数设置是碰撞体特定的，你也可以在 data/colliders.ini 中设置它们。

### 语法

```ini
[PARTICLES_FX]
SPARKS_AS = STEEL          ;包括 collider.kn5 在内所有碰撞体的基础材质标签
BODY_SPARKS_AS = CARBON    ;collider.kn5 的材质标签
COLLIDER_0_SPARKS_AS = TITANIUM, SKIDPAD ;colliders.ini 中 COLLIDER_0 的材质标签
COLLIDER_1_SPARKS_AS = IRON ;colliders.ini 中 COLLIDER_1 的材质标签
```

### 猜测

**语法**段落中列出的设置是所有车辆默认使用的设置。

### 待添加功能

- 功能列表。

