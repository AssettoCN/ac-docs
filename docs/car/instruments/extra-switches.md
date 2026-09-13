---
title: 额外开关
---


> 汉化标题：车辆 – 额外开关  
> 原文页面：Cars-–-Extra-switches  
> 原文锚点：a531f51  
> 汉化时间：2026-09-12T00:00:00+08:00  

车辆最多可以定义四个额外开关（自 0.1.76 起最多六个），通常称为 EXTRA_A、EXTRA_B 等。用户可以在 Content Manager 的 Patch 部分的按键设置中为每个开关指定关联按钮。在 controls.ini 中它们写作 `__EXT_LIGHT_A`、`__EXT_LIGHT_B` 等，因为最初它们主要用于额外灯光。

这些开关可以用作模拟或数字仪表、发光物体条目或动画的输入。此外，Lua 脚本中也可以通过 car.extraA、car.extraB 等访问它们。若启用了扩展物理，还可以在动态控制器中以 `LIGHT_EXTRA_A`、`LIGHT_EXTRA_B` 等名称使用它们。

自 0.1.76 起，额外开关还可以进行配置：

```ini
[EXTRA_SWITCHES]
SWITCH_A = Role   ; 开关的用途，加载时显示（可选）
SWITCH_A_FLAGS =  ; 开关标志（可选）
```

可用的开关标志：

- `HOLD_MODE`：将默认的切换开关行为改为仅在按钮按住期间生效；
- `STATIONARY_ONLY`：仅在车辆静止时才能切换；
- `NEURAL_GEAR_ONLY`：仅在空档时才能切换；
- `REQUIRES_BRAKE`：仅在踩下刹车踏板时才能切换；
- `KEEP_ON_RESET`：车辆传送重置时不要关闭（0.3.0-preview123 中新增）。

