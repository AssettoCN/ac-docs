---
title: 模拟里程表
---


> 汉化标题：车辆 – 模拟里程表  
> 原文页面：Cars-–-Analog-odometers  
> 原文锚点：afd726f  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：trip meter 译作「小计里程」，odometer 译作「里程表」  

模拟里程表是滚轮数字式的：随着车辆行驶，每个数字轮缓缓翻转到下一个数字。整个内容渲染到一张动态纹理中，因此模型只需提供一个供数字绘制其上的平面网格（或一块纹理区域）——无需为每个数字单独建网格，也无需折腾父级节点。

有两个预定义节：`[ODOMETER_MAIN]` 和 `[ODOMETER_TRIP]`，二者均关联到当前车辆已保存的行驶里程（因此在多次会话之间持续累计）。此外，还可以用 `[ODOMETER_0]`…`[ODOMETER_9]` 再添加最多十个里程表，适用于诸如配备两个小计里程、或在仪表板上另设独立显示之类的场景。

### 语法

```ini
[ODOMETER_MAIN]
NAME = ODOMETER_MAIN_DIGITS    ; 绘制数字的网格（或使用 MESHES = … 设置过滤器）
POSITION = 8, 8                ; 左上角的 X、Y 坐标，单位为纹理像素
SIZE = 240, 56                 ; 数字区域的宽度和高度，单位为纹理像素
COUNT = 6                      ; 位数（默认：主里程表 6 位，小计里程 5 位）
DIGIT_WIDTH = 36               ; 单个数字字形的宽度，单位为纹理像素
FONT = 599_big                 ; 使用的字体（会在 content/fonts 中查找字体，但会先在车辆的 extension 文件夹中查找 `<FONT>.txt` 和 `<FONT>.png`）
FONT_SCALE = 1                 ; 字形的额外缩放
FONT_OFFSET = 0                ; 字形在数字单元格内的垂直偏移
COLOR = 1, 1, 1                ; 数字颜色
BACKGROUND = 0.12, 0.12, 0.12  ; 数字背后的背景色
MOVEMENT_INTERVAL = 1          ; 多少单位数值使数字轮完整翻滚一格
JITTER = 0                     ; 0..1，为各数字轮之间添加一点错位
ROTATION = 0                   ; 绕数字区域中心的旋转角度，度
SCALE = 1, 1                   ; 绕数字区域中心的额外缩放
```

`NAME` 和 `MESHES` 的用法与 [LED 面板](https://github.com/car/instruments/led-panels)及其他基于动态纹理的机制相同——`NAME` 是单个网格的简写，而 `MESHES` 可以设置常规的网格过滤器。与通常一样，如果更便于对齐，可以用 `CENTER` 代替 `POSITION`。

如果不需要自定义外观，到这里就完成了。纹理会被自动选取（若该网格尚未存在动态纹理，则会自动生成），数值则从已保存的行驶里程中读取。

### 小计里程与额外里程表

对 `[ODOMETER_TRIP]` 而言，数值默认乘以 10，这通常正是你想要的——这样最末一位数字显示的就是十分之一公里（或英里，取决于单位设置）。若想在自定义里程表上更改该行为，可使用 `TRIP_MODE`：

```ini
[ODOMETER_0]
NAME = ODOMETER_TOTAL_2
TRIP_MODE = 0  ; 仅显示整数单位，与主里程表一样
```

默认情况下，当 `TRIP_MODE` 设为 0 时，额外里程表（`[ODOMETER_0]`…`[ODOMETER_9]`）会继承 `[ODOMETER_MAIN]` 的当前数值，从而与其保持同步。否则，它们会在会话开始时从零计数（与 `[ODOMETER_TRIP]` 一样），因此可用作额外的小计里程表。

如果出于某种原因需要非十进制的乘数（例如在公里里程表旁边再放一个英里里程表），可使用 `OUTPUT_MULT`：

```ini
[ODOMETER_0]
NAME = ODOMETER_MILES
OUTPUT_MULT = 0.621371  ; 将 km 换算为英里
```

`UPPER_BOUND` 同样可用——默认值为 `10^COUNT - 1`，因此一旦数值超出数字轮所能显示的范围就会回绕。如需不同的行为，可以调低该值。

### 末位数字高亮

真实里程表上，最右边的最后一位数字常常使用不同的背景色，以标示其为小数位。这很容易设置：

```ini
[ODOMETER_TRIP]
…
LAST_DIGIT_COLOR = 1, 1, 1                  ; 最后一位数字的颜色（默认：与 COLOR 相同）
LAST_DIGIT_BACKGROUND = '#a01818'           ; 最后一位数字下方的背景
LAST_DIGIT_BACKGROUND_LOCATION = 200, 40    ; 该背景的 X 位置和宽度，单位为纹理像素
                                            ; 默认：恰好覆盖最后一个数字单元格
```

如果 `LAST_DIGIT_COLOR` 和 `LAST_DIGIT_BACKGROUND` 都保持默认值，则完全不会绘制额外的背景。

### 混合模式

默认情况下，里程表区域每帧都会完整重绘：先用背景色填满整个 `SIZE` 矩形，再在其上绘制数字。这是最简单的情形，如果纹理区域专属于里程表，效果很好。

如果想让数字绘制在现有图像之上——比如带有印刷数字窗口的面板纹理，或由其他内容烘焙进动态纹理的风格化背景——可设置 `BLEND_MODE = 1`。此时 `BACKGROUND` 将被忽略，字形之间的空隙会透出原始纹理的内容：

```ini
[ODOMETER_MAIN]
…
BLEND_MODE = 1
```

在该模式下，末位数字高亮（如果使用）也会混合绘制在现有图像之上，因此请记得相应地调整 `LAST_DIGIT_BACKGROUND`。

### 技巧

- 如果数字在垂直方向上看起来错位，先微调 `FONT_OFFSET`，再调 `FONT_SCALE`。默认字体为 `599_big`；
- 如果数字轮在各位之间翻动得过快或过慢，请调高或调低 `MOVEMENT_INTERVAL`——它控制多少输入数值对应最右侧数字轮的一次完整翻滚；
- 少量的 `JITTER`（比如 0.05 左右）可以避免所有数字同时整齐对齐的「过于完美」的观感，模拟真实的机械磨损；
- 要在不删除节的前提下关闭里程表（调试配置时很方便），可使用 `ACTIVE = 0`；
- `[ODOMETER_MAIN]` 的已保存数值存放在 `extension/state/odometers.ini` 中。CSP 还会检查 Content Manager 的 `__CM_DRIVEN_DISTANCE` 以及 Sidekick 的里程表文件，并取三者中的最大值，因此在各工具之间切换时计数不会重置。

