---
title: 设置 – 控制器
---


> 汉化标题：车辆 – 设置 – 控制器  
> 原文页面：Cars-–-Setup-controllers  
> 原文锚点：83c1e81  
> 汉化时间：2026-09-11T23:30:00+08:00  

设置控制器允许隐藏某个设置项，改由动态控制器实时控制。配合[新输入](https://github.com/car/physics/dynamic-controller-inputs)，这意味着你现在可以把某些设置项绑定到附加按键上，例如大灯状态，甚至是由 [Lua 编写的物理脚本](https://github.com/car/physics/physics-scripts)实时设置的值。

要为某个设置项进行此配置，只需添加 “EXT_CONTROLLER” 值，如下所示：

```ini
[ROD_LENGTH_LR]
TAB=SUSPENSIONS
SHOW_CLICKS=2
…
HELP=HELP_LR_RODLENGTH
EXT_CONTROLLER=ctrl_setup_rod_length.ini
```

然后照常准备一个新的控制器（与 AC 物理使用的控制器相同）：

```ini
[CONTROLLER_0]
COMBINATOR=ADD
INPUT=BRAKE
LUT=(| 0=400 | 1=4000 |)
FILTER=0
UP_LIMIT=1000000
DOWN_LIMIT=0
```

（在这个特定的例子中，我把悬挂高度绑定到了刹车按键上，这样踩下刹车时车辆就会跳起来，[就像这样](https://files.acstuff.ru/shared/RK9e/20210907-175443.mp4)。）

*注：目前该系统尚无法用于 CSP 新增的设置项，修复将随 0.1.80 到来。*

*小技巧：如果你要把设置项绑定到附加 A/B/C/D/E/F 开关，可以让它们[以切换或按住激活的模式工作，或在某些条件下禁止更改](https://github.com/car/instruments/extra-switches)（例如车辆正在移动时）。例如，可以用这种方式还原布加迪的最高车速切换开关。*

