---
title: 制动系统
---


> 汉化标题：车辆 – 制动系统  
> 原文页面：Cars-–-Brakes  
> 原文锚点：3893d20  
> 汉化时间：2026-09-11T23:30:00+08:00  
> 译注：master cylinder 译作「制动总泵」（代码注释中缩写 MC 保留）；brake blanking 译作「制动导管封堵」  

# 0.2.8 新功能（05/2025）

## CSP 防抱死制动系统（ABS）

自 0.2.8 起，可以为 ABS 添加控制器，与 CSP 的牵引力控制类似。这些控制器必然相当复杂，请仔细阅读以下文档以理解其功能。

首先，每个控制器可以使用以下输入：
* GAS（0 到 1 的踏板输入）
* THROTTLE（0 到 1 的引擎输出）
* BRAKE（0 到 1 的踏板输入）
* BRAKE_PRESSURE（每车轮的输入 psi）
* LATG（G 值）
* LONG（G 值）
* SPEEDKMH（车速，km/h）
* GEAR
* STEER（方向盘转角，度）
* WHEEL_ACCEL（角加速度，rad/s/s）
* ABS_SETTING
* SLIP_RATIO（实际滑移率，不推荐使用，因为现实中无法得知）
* ABS_SLIP_RATIO（ABS 系统计算出的滑移率，不一定与真实 SR 相同）
* ABS_TARGET_SLIP（ABS 系统的净目标 SR）
* ABS_SLIP_DIFF_TARGET（SR 减去目标 SR）
* ABS_SLIP_DIFF_LAT（SR 减去另一侧车轮的 SR，2 轮）
* ABS_SLIP_DIFF_LONG（SR 减去另一轴同侧车轮的 SR，2 轮）
* ABS_SLIP_DIFF_SIDE（SR 减去另一侧车轮的 SR，4 轮）
* ABS_SLIP_DIFF_AXLE（SR 减去另一轴同侧车轮的 SR，4 轮）
* ABS_SLIP_DIFF_RATIO（SR 除以目标 SR）
* YAW_RATE（deg/s）
* YAW_RATE_ACCEL（deg/s/s）
* RPM（引擎转速）

基本系统是一个可变增益 PID 控制器，并附加一个常数控制器（独立控制器，不依赖 PID 控制器的控制参数）。建议在试验该系统之前先研究 PID 调参。

所有编程均在 electronics ini 中完成。**控制器格式与牵引力控制相同，2dlut 等用法请参阅其文档（目前在 Trello 上）。**下面控制器中展示的每个参数都可用于其他任何控制器（target、gain、p gain、i gain、d gain），它们内部运行相同的代码。

electronics.ini
```ini
[ABS]
SLIP_RATIO_LIMIT=0.08
CURVE=abs_settings.lut
PRESENT=1
ACTIVE=1
RATE_HZ=333  ; 目前已弃用，但在官方将其更新并恢复功能之前，暂时应使用 333 以保持向后兼容

[ABS_EXT]
ENABLE=1
DEBUG=1                        ; 注意：发布版本中切勿启用。会以最大日志速率在 CSP Logger 中记录大量通道用于调试。便于查看控制器的实际行为。
USE_WHEEL_SPEED_SLIP=0         ; 尚未实现。设为 1 使用 ECU 车轮转速计算滑移率，默认 0（真实 SR）
RESPONSE_TIME=0.01             ; 秒，一阶函数的 95% 响应时间。对整个系统的控制而言非常重要的参数。除非你想要不真实的 ABS，否则不要将其调得过低来作弊。
INTEGRAL_ERROR_LIM=-0.01,10000 ; 钳制积分控制器的积分计算。没有它可能出现欠调情况。可在 CSP Logger 的调试通道中监控积分计算。


[ABS_TARGET_CONTROLLER_0] ;这些控制器修改 ABS 系统的滑移目标。[ABS] CURVE/SLIP_RATIO_LIMIT 设定的数值是基准，这些控制器在其之上进行调制。此控制器在横向载荷增加时降低允许的纵向滑移（因为轮胎无法同时兼顾两件事）。
LUT=(-1.2=0.5|-0.6=0.8|0=1|0.6=0.8|1.2=0.5)
INPUT=LATG
COMBINATOR=MULT

[ABS_TARGET_CONTROLLER_1] ;这是一个略带实验性的控制器，尝试在制动时做一些抗横摆修正（增加稳定性）。这并不是真正好的做法，但它展示了 FLIP_RHS 功能。
LUT=(-20=1|0=1|20=0.7)
INPUT=YAW_RATE
COMBINATOR=MULT
FLIP_RHS=1                ;会为车身另一侧翻转输入值，意味着你可以让两侧产生相反的效果（例如一侧加重制动、另一侧松开）。

[ABS_TARGET_CONTROLLER_2] ;此控制器在大力制动时稍微降低后轮的滑移目标，从而增加一些稳定性
LUT=(-1.2=0.9|0=1)
INPUT=LONG
COMBINATOR=MULT
FILTER_TIME_CONSTANT=0.1  ;此滤波器应用于控制器的输出。它是一阶传递函数，值为时间常数（秒）。如此处所示，它过滤掉了直接使用 G 力信号会带来的部分噪声。
ENABLED_WHEELS=0,0,1,1    ;此参数告知 ABS 系统该控制器作用于哪些车轮（FL、FR、RL、RR）。此处仅对后轮启用。


[ABS_GAIN_CONTROLLER_0] ;「常数」增益控制器与 TC 控制器类似，接收输入并输出干预量（0 为无 ABS 干预，1 为完全释放制动）。它们可能是增益控制器中最直观易用的，但也是最不稳定的之一。它们独立于 PID 控制器，因为不一定以 ABS_SLIP_DIFF 作为主控制参数（不过这一个确实如此）。这可以实现滑移误差之外的一些可能需要的特定效果。此控制器利用滑移差与目标的偏离来决定削减多少制动。当 SR 超出目标 15% 时，它会尝试完全释放制动。用它代替比例控制器，是因为在此配置下净效果相当相似，但更直观。
LUT=(0=0|0.03=0.5|0.06=0.7|0.15=1)
INPUT=ABS_SLIP_DIFF
COMBINATOR=ADD          ;对每组增益控制器，第一个都需要用 ADD，因为它们默认值均为 0

[ABS_GAIN_CONTROLLER_1] ;此控制器仅用于在制动输入低于 1% 左右时禁用 ABS。
LUT=(0=0.0|0.01=0|0.015=1)
INPUT=BRAKE
COMBINATOR=MULT

[ABS_GAIN_CONTROLLER_2] ;此控制器在车速下降时为系统增加一些稳定性：降低常数控制器增益，转而更多依赖比例、积分和微分控制器。
LUT=(0=0.0|50=0.2|100=1)
INPUT=SPEEDKMH
COMBINATOR=MULT


[ABS_PROPORTIONAL_GAIN_CONTROLLER_0] ;此类控制器未在本系统中使用，但本质上与上面常数控制器的效果相当相似。它是以 ABS_SLIP_DIFF 为输入的比例控制器（即输出为 gain*ABS_SLIP_DIFF）
LUT=(0=0|1=0)
INPUT=NONE
COMBINATOR=ADD


[ABS_INTEGRAL_GAIN_CONTROLLER_0] ;这些是积分增益控制器。此处展示的实现极其简单。积分控制器的净输出为 gain*clampedIntegral(ABS_SLIP_DIFF)。积分控制器可以消除其他类型控制器导致的稳态误差。通常增益越高，过冲越大。
LUT=(0=150|1=150)
INPUT=NONE
COMBINATOR=ADD

[ABS_INTEGRAL_GAIN_CONTROLLER_1] ;在制动输入低于或等于 1% 时禁用控制器增益。
LUT=(0=0.0|0.01=0|0.015=1)
INPUT=BRAKE
COMBINATOR=MULT


[ABS_DERIVATIVE_GAIN_CONTROLLER_0] ;这些是微分增益控制器。此处展示的实现极其简单。净输出为 gain*derivative(ABS_SLIP_DIFF)。微分控制器可以抑制系统响应、减少振荡。增益过高可能导致振动和不稳定。
LUT=(0=0.05|1=0.05)
INPUT=NONE
COMBINATOR=ADD
FILTER_TIME_CONSTANT=0.03 ;此处添加滤波器以模拟现实中微分信号所需的滤波处理，因为此类信号易受噪声影响。

[ABS_DERIVATIVE_GAIN_CONTROLLER_1] ;在制动输入低于或等于 1% 时禁用控制器增益。
LUT=(0=0.0|0.01=0|0.015=1)
INPUT=BRAKE
COMBINATOR=MULT
```


## 通过制动总泵实现的新「Real Feel」选项

对于现实中采用双制动总泵 + 平衡杆的车辆，现在可以选择使用以下参数来代替 MAX_PRESSURE_SUM 和 PEDAL_FORCE_REF——只要你有必要的测量数据，它们会替你完成所需的力学计算。

brakes.ini
```ini
[DATA2]
PEDAL_FORCE_REF = 100       ; kgf。若未启用 realfeel、或钳制力被禁用且模拟踏板最大力低于此值，则作为 MC 计算的回退值
MASTER_CYL_F_DEFAULT=1      ; 前 MC 的默认索引
MASTER_CYL_R_DEFAULT=3      ; 后 MC 的默认索引
PEDAL_RATIO=4.04

[FRONT]
DISC_EFFECTIVE_RADIUS=0.1634 ; 制动盘有效半径（米），与之前相同
PISTON_DIAMETER_0=0.0270     ; 活塞直径（米），与之前相同
PISTON_DIAMETER_1=0.0270
PISTON_DIAMETER_2=0.03175
PISTON_DIAMETER_3=0.03175
PISTON_DIAMETER_4=0.0381
PISTON_DIAMETER_5=0.0381
MASTER_CYL_DIA_0=0.0168      ; 制动总泵直径（米）。可添加的选项数量没有限制。
MASTER_CYL_DIA_1=0.0178
MASTER_CYL_DIA_2=0.0191
MASTER_CYL_DIA_3=0.0206
MASTER_CYL_DIA_4=0.0222

[REAR]
DISC_EFFECTIVE_RADIUS=0.1509
PISTON_DIAMETER_0=0.0270
PISTON_DIAMETER_1=0.0270
PISTON_DIAMETER_2=0.03175
PISTON_DIAMETER_3=0.03175
PISTON_DIAMETER_4=0.0381
PISTON_DIAMETER_5=0.0381
MASTER_CYL_DIA_0=0.0168
MASTER_CYL_DIA_1=0.0178
MASTER_CYL_DIA_2=0.0191
MASTER_CYL_DIA_3=0.0206
MASTER_CYL_DIA_4=0.0222
```

setup.ini
```ini
[BRAKE_MC_F]
SHOW_CLICKS=0
TAB=GENERAL
NAME=MC Dia. F
LUT=setup_brake_mc_f.lut  ; 标签 | 索引（不是尺寸！）
POS_X=0
POS_Y=4
HELP="制动总泵尺寸越大，相同管路压力所需的踏板力越大。"

[BRAKE_MC_R]
SHOW_CLICKS=0
TAB=GENERAL
NAME=MC Dia. R
LUT=setup_brake_mc_r.lut  ; 标签 | 索引（不是尺寸！）
POS_X=1
POS_Y=4
HELP="制动总泵尺寸越大，相同管路压力所需的踏板力越大。"
```


# 2023 年新功能

## 「Real Feel」制动校准

通过 CSP 的 FFB Tweaks 设置页面，用户可以使用以下参数设定踏板力，使之与真实车辆一致。注意：仅对高级制动系统有效。

```ini
[DATA2]
PEDAL_FORCE_REF = 100        ; kgf @ 踏板面 @ MAX_PRESSURE_SUM
```


# 2019 年新功能

## 新的可选制动系统（重做加热系统并加入核心温度、制动导管设置调整、支持最多 12 活塞的制动卡钳）

### 高级实现示例：

brakes.ini

注意：仅为补充内容——仍需要 Kunos 参数

```ini
[_EXTENSION]
ENABLE=1
USE_ADVANCED_SYSTEM=1

[DATA]
MAX_TORQUE=3000              ;尽量使用与计算出的制动力矩相近的数值，因为它仍会被 AI 使用

[DATA2]
MAX_PRESSURE_SUM = 1400      ; 前后最大预期制动压力之和（前部压力 + 后部压力）- PSI

[FRONT]
DISC_EFFECTIVE_RADIUS=0.16   ; 制动盘有效半径（米）（若没有数据，通常接近：(制动盘外半径 + 制动盘内半径)/2
PISTON_DIAMETER_0=0.03 ; 1 号活塞直径（米）
PISTON_DIAMETER_1=0.03 ; 2 号活塞直径（米）
PISTON_DIAMETER_2=0.03 ; 3 号活塞直径（米）
PISTON_DIAMETER_3=0.03 ; 4 号活塞直径（米）
PISTON_DIAMETER_4=0.03 ; 5 号活塞直径（米）
PISTON_DIAMETER_5=0.03 ; 6 号活塞直径（米）

[REAR]
DISC_EFFECTIVE_RADIUS=0.15
PISTON_DIAMETER_0=0.03
PISTON_DIAMETER_1=0.03
PISTON_DIAMETER_2=0.03
PISTON_DIAMETER_3=0.03
PISTON_DIAMETER_4=0.03
PISTON_DIAMETER_5=0.03

[TEMPS_FRONT]
COOL_TRANSFER=0.002    ;热量从表面传至空气的速率（与车速无关）
TORQUE_K=0.60
PERF_CURVE=brake_temp_mu.lut    ;现在作为 摄氏度|摩擦系数 查找表使用
COOL_SPEED_FACTOR=0.03    ;由导管提供的随车速变化的空气冷却
COOL_SPEED_FACTOR_0=0.03    ;随车速变化的空气冷却常数（与导管无关）
CORE_TRANSFER_IN=0.08    ;热量从表面传至核心的速率
CORE_TRANSFER_OUT=0.55    ;热量从核心传至表面的速率
CORE_TRANSFER_AIR=0.0005    ;热量从核心传至空气的速率

[TEMPS_REAR]
COOL_TRANSFER=0.002
TORQUE_K=0.60
PERF_CURVE=brake_temp_mu.lut
COOL_SPEED_FACTOR=0.03
COOL_SPEED_FACTOR_0=0.03
CORE_TRANSFER_IN=0.08
CORE_TRANSFER_OUT=0.55
CORE_TRANSFER_AIR=0.0005
```

### 简单实现示例：

brakes.ini

注意：仅为补充内容——仍需要 Kunos 参数

```ini
[_EXTENSION]
ENABLE=1
USE_ADVANCED_SYSTEM=0

[DATA]
MAX_TORQUE=3000    ; 车辆每侧可达到的期望最大力矩（系统总力矩 = MAX_TORQUE*2）

[TEMPS_FRONT]
COOL_TRANSFER=0.002    ;热量从表面传至空气的速率（与车速无关）
TORQUE_K=0.60
PERF_CURVE=brake_temp.lut    ;现在作为 摄氏度|摩擦系数 查找表使用——对于简单系统，它会被归一化（因此 MAX_TORQUE 始终是制动系统所能产生的绝对最大力矩），在此意义上将其视为 MAX_TORQUE 的乘数即可。
COOL_SPEED_FACTOR=0.03    ;由导管提供的随车速变化的空气冷却
COOL_SPEED_FACTOR_0=0.03    ;随车速变化的空气冷却常数（与导管无关）
CORE_TRANSFER_IN=0.08    ;热量从表面传至核心的速率
CORE_TRANSFER_OUT=0.55    ;热量从核心传至表面的速率
CORE_TRANSFER_AIR=0.0005    ;热量从核心传至空气的速率

[TEMPS_REAR]
COOL_TRANSFER=0.002
TORQUE_K=0.60
PERF_CURVE=brake_temp.lut
COOL_SPEED_FACTOR=0.03
COOL_SPEED_FACTOR_0=0.03
CORE_TRANSFER_IN=0.08
CORE_TRANSFER_OUT=0.55
CORE_TRANSFER_AIR=0.0005
```

有效半径可视化：
[图片待添加]

## 制动导管封堵调整

setup.ini

注意：仅为补充内容——仍需要 Kunos 参数

```ini
[BRAKE_DUCT_F]
SHOW_CLICKS=0
TAB=BRAKES ;所属设置选项卡
NAME=Front Brake Blanking
MIN=0      ;制动封堵最小百分比，数值越高封堵越多（气流越少）
MAX=100    ;制动封堵最大百分比
STEP=10
POS_X=0.5
POS_Y=2
HELP=NULL

[BRAKE_DUCT_R]
SHOW_CLICKS=0
TAB=BRAKES ;所属设置选项卡
NAME=Rear Brake Blanking
MIN=0      ;制动封堵最小百分比
MAX=100    ;制动封堵最大百分比
STEP=10
POS_X=0.5
POS_Y=2
HELP=NULL
```

