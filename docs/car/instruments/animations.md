---
title: 动画
---


> 汉化标题：车辆 – 动画  
> 原文页面：Cars-–-Animations  
> 原文锚点：b4246ab  
> 汉化时间：2026-09-12T00:00:00+08:00  

有了车辆附加动画，现在不必再为了添加新动画而专门创建额外的定风翼了。动画可以绑定到许多不同的输入上，例如可以用来制作复杂的仪表盘仪表。

动画可以以两种不同的模式工作：

- 以 `INPUT` 作为触发器：

  一旦输入超过设定的阈值即启动动画（与发光物体使用输入的方式类似）。除了[其他参数](https://github.com/car/instruments/inputs)外，还可以使用 `INPUT_THRESHOLD` 和 `INPUT_THRESHOLD_INVERSE` 来调整行为。

- 直接以 `INPUT` 作为动画进度值：

  例如，若绑定到油门踏板，踏板踩下一半时动画进度即为 50%。可以使用 [LUT 及其他 `INPUT` 选项](https://github.com/car/instruments/inputs)来缩放行为，并添加诸如吸附到动画特定位置之类的效果。

### 语法

```ini
[ANIMATION_...]
INPUT = REVERSE             ; 绑定到倒档
; BIND_TO = REVERSE           ; 或者用这个
FILE = animation.ksanim     ; “animations” 文件夹中新动画的文件名
TIME = 0.5                  ; 动画时长
INPUT_AS_PROGRESS = 0       ; 设为 1 切换为上面第二种「输入作为进度」模式
LOOP_WHILE_ACTIVE = 0       ; 设为 0 时，未触发动画会回到 0%，触发则到 
                            ; 100%；设为 1 时，动画在触发后循环播放， 
                            ; 否则停止
LOOP_KEEP_UNTIL_DONE = 1    ; 仅用于 “LOOP_WHILE_ACTIVE”：设为 1 让动画在 
                            ; 停止后回到 0%（例如雨刷的行为）
TICK_TOCK_MODE = 0          ; 仅用于 “LOOP_WHILE_ACTIVE”：以 0% → 100% → 0% 
                            ; 循环，而不是从 100% 直接跳回 0% 
AFFECTS_INTERIOR_SHAPE = 0  ; 动画播放时强制更新车内反射蒙版（较慢）
HOLD_STATE = 1              ; 用于引擎盖之类
BLEND_STATE = 0.3           ; HOLD_STATE 相关的参数？
LUT = ...                   ; 没错，这里也可以用
```

默认值即如上所列，因此最简配置只需要 `INPUT` 和 `FILE`。使用 `INPUT_AS_PROGRESS` 时，循环选项不会产生任何效果。

### 待添加的功能

- 动画之间的混合（？）。

