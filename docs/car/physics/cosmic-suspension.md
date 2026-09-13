---
title: COSMIC 悬挂系统
---


> 汉化标题：车辆 – COSMIC 悬挂系统  
> 原文页面：Cars-–-COSMIC-Suspension  
> 原文锚点：1904868  
> 汉化时间：2026-09-11T23:30:00+08:00  
> 译注：coilover 保留原文（指弹簧与阻尼器合为一体的组件）；heave 译作垂向、3rd spring 译作第三弹簧、torsion bar 译作扭杆、ride height 译作离地间隙  

# 新型「COSMIC」（Comprehensive Suspension with Modular Input of Configurations）悬挂类型允许自定义实现原生 AC 中原本无法实现的悬挂 [CSP v0.1.79+]

在 CSP v0.20+ 中已获完整支持

COSMIC 允许显式创建关节与刚体来实现所需的悬挂类型，而非使用原生 AC 的预设类型（DWB、STRUT、AXLE、ML），同时也避免了 AC 各预设的特定类型缺陷（STRUT 问题众多，ML 几乎无法正常工作等）。

注意：仅推荐资深物理开发者使用——COSMIC 移除了许多开发限制，但这也意味着很容易越界（例如导致游戏崩溃）。此外，Assetto Corsa（相对较低的）默认物理频率意味着某些悬挂类型无法良好运作。连杆机构越复杂、越刚硬，Open Dynamics Engine 物理求解器的处理难度就越大。如需开发支持或对文档提出建议，请访问 CSP Discord。

损坏机制目前与原生 AC 相同，防倾杆（ARB）可使用原生或 cphys 代码（参见通用悬挂文档）。

***滚动到页面底部查看实用的通用提示。***

> **已知缺陷：**
>
>**0.1.79**
> * 滑块关节损坏。已在 0.2 中修复。
> * 「简单」阻尼值在 coilover 上不生效。已在 0.2 中修复。
> * coilover 需要 DAMPER_LUTS 和 dampers.ini。0.2 中通过允许上述选项而修复。
> * FLIP_PRELOAD 意外地默认为 1。要恢复正常行为请设置 FLIP_PRELOAD=0。0.2 起将默认为 0。
> * 阻尼 LUT 可能存在问题。0.2 中已正常。
> * 「Strut」转向轴问题。已在 0.2 中修复
> * 轮辋偏移不生效。0.2 中已可用，功能详见文档（与 KS 不同）。
> * 阻尼/弹簧设置选项一团糟。0.2 中已全部理顺。
>
>**0.2.0**
> * 使用弹簧 LUT 的 coilover 预载损坏。已在 0.2.1 中修复
> * 使用 TORQUE_MODE_EX=2 时 ENGINE_TORQUE_BODY 无法 100% 正确工作（有一个函数仍将扭矩施加到错误的刚体）。已在 0.2.1 中修复
>
>**当前**
> * 扭杆预载损坏，请改用 PRELOAD_TORQUE。将在 0.2.5 中修复

## 请务必通读以下每个示例的全部内容，因为关键信息散布于其中各处。

---

*suspensions.ini*

实现示例（注意：直接复制粘贴可能无法在游戏中加载，因为几何坐标被随意改动过，此处仅用于展示参数）：
```ini
[_EXTENSION]
TORQUE_MODE_EX=2                ;强烈推荐
DAMPER_LUTS=1                   ;v0.1.79 中为 coilover 必需，v0.2+ 起不再必需

;[ODE]                          ;可选——调整这些参数有助于提高稳定性。更多信息请参阅 Open Dynamics Engine 手册 (http://ode.org/wiki/index.php/Manual#Joint_error_and_the_Error_Reduction_Parameter_.28ERP.29)。
;ERP=0.9                        ;这是 AC 对部分关节类型的默认值，其余（及全局值）为 0.3
;CFM=1                          ;*10^-7——如此处理只是为了让数值更合理

[REAR] ;或前轮
TYPE=COSMIC
RIM_OFFSET=0.00                 ;与 KS 相同
BASEY=0.0                       ;质心（CG）到车轮中心的距离，单位米。后轮半径+BASEY=后桥 CoG。实际 CG 高度 =(FWR+FBasey)+(RWR+Rbasey))/CG_LOCATION%      ;与 KS 相同
TRACK=1.5                       ;与坐标对应的轮辋偏移处的轮距（如果坐标从车轮中心量起，此值即车轮中心处的轮距。若使用了轮辋偏移，建议从轮毂面量取坐标/轮距并输入真实轮辋偏移）。
HUB_MASS=50                     ;与 KS 相同 *但请参阅下方关于刚体的说明
TOE_OUT=0.0004, 0.0004          ;与 KS 相同；但自 0.3.0 起，多数参数可为左右两侧设置不同的默认值。用逗号分隔的数值分别表示左、右
STATIC_CAMBER=-2, -1.5          ;同上

BODY_0_NAME=ROCKER              ;刚体可从 #0 开始定义。预先存在的刚体包括 HUB_L、HUB_R 和 CHASSIS。
BODY_0_MASS=0.2                 ;刚体质量，单位 kg
BODY_0_INERTIA=0.1, 0.05, 0.1   ;刚体的惯性盒——多数应用并非特别需要，默认 0,0,0
BODY_0_POS=0.6, 0.1, 0.1        ;通常最好将其放在刚体质心处。坐标相对于车轮。
BODY_0_MIRROR=1                 ;0 表示禁用沿横向镜像到车辆另一侧，默认 0

BODY_1_NAME=T_BAR
BODY_1_MASS=0.1                 ;质量不必与真实部件一致，有时为了求解器稳定，部件做得更轻/更重反而更好。若该部件属于簧下质量，最好按合理比例将其从 HUB_MASS 中扣除（例如叉臂应从 HUB_MASS 中扣除约 50% 的质量。这样做是为了让车辆的簧下质量保持为期望值）
BODY_1_INERTIA=0.0, 0.0, 0.0
BODY_1_POS=0.8, 0.2, 0.4

;BODY_2_NAME=CHASSIS2 
;BODY_2_MASS=500                ;所有质量都会自动调整 CHASSIS 质量，以确保遵守 car.ini 规定的总质量			
;BODY_2_INERTIA=1,1,1
;BODY_2_CARPOS=0,0.0,0          ;carpos 采用车辆参考系；此处该刚体被放置在车辆原点（簧上质心）
;ENGINE_TORQUE_BODY=CHASSIS2    ; 此行告知求解器：发动机/车轮传来的反作用扭矩应施加到哪个刚体。对整体桥等设计有用且必要。

HJ0=ROCKER_HINGE                ;铰链关节用途广泛，此处用作摇臂铰链
HJ0_BODY_B=ROCKER               ;若未列出 BODY_A，则视为 CHASSIS；若未列出 BODY_B，则视为 HUB_L。所有关节类型均如此。HUB_R 也可用，默认为 L。
HJ0_POS_A=0.6, 0, 1             ;POS0 与 POS1 是 v0.1.79 的标准写法。POS_A 与 POS_B 在 CSP v0.2 及更高版本中可作为替代使用，并将成为标准。POS0 与 POS1 仍可继续使用以保持向后兼容。位置相对于车轮（与 KS 相同）
HJ0_POS_B=0.6, 0.1, 1
HJ0_PARITY=-1                   ;-1 表示左右镜像，0 表示仅左侧，1 表示仅右侧，默认 -1

;关于刚体指定的重要说明：
;若 Body A 与 Body B 填写相同名称，代码会认为你要连接左右两侧互相镜像的刚体（如果存在）。例如，若有一根垂向弹簧需要连接两侧的摇臂，只需写 _BODY_A=ROCKER 和 _BODY_B=ROCKER，即会自动建立连接，无需额外干预。此规则适用于关节/弹簧/阻尼器/coilover 等。

;HJ1=CHASSIS_HINGE              ;可以用铰链连接主底盘与副车架刚体、再辅以扭杆（见下文），实现一个基础版的底盘形变
;HJ1_BODY_B=CHASSIS2 
;HJ1_CARPOS_A=0, 0, 1.5         ;关节的 carpos 采用 BODY_A 的参考系。此命名略欠妥，未来可能会添加别名。
;HJ1_CARPOS_B=0, 0, -1.5

DJ0=WB_BOTTOM_FRONT             ;距离关节，AC 中 DWB 悬挂等用的正是它
;DJ0_BODY_A=CHASSIS2
DJ0_POS_A=0.6, -0.1, 0.4
DJ0_POS_A_1=0.6, -0.11, 0.4     ;v0.2+ 提供的悬挂几何调整，见下方 setup.ini 文档
DJ0_POS_B=0.05, -0.1, 0.0       ;若要创建三点式叉臂（如本例所示），请确保其轮毂侧坐标一致共用，否则求解器会出问题
DJ1=WB_BOTTOM_REAR
;DJ1_BODY_A=CHASSIS2
DJ1_POS_A=0.6, -0.1, -0.1
DJ1_POS_B=0.05, -0.1, 0.0
DJ1_KP=0                        ;标明此关节为主销下点（对球头关节同样适用）——用于转向轴——POS1+BODY_B 即指定的坐标/刚体组合

DJ2=WB_TOP_FRONT
;DJ2_BODY_A=CHASSIS2
DJ2_POS_A=0.5, 0.0, 0.3
DJ2_POS_B=0.1, 0.05, 0.1
DJ3=WB_TOP_REAR
;DJ3_BODY_A=CHASSIS2
DJ3_POS_A=0.6, 0.0, 0.1
DJ3_POS_B=0.1, 0.05, 0.1
DJ3_KP=1                        ;标明此关节为主销上点

STEER_JOINT_0=STEER_LINK        ;转向拉杆——与距离关节的唯一区别在于前束设置，且其随转向移动
;STEER_JOINT_0_BODY_A=CHASSIS2
STEER_JOINT_0_POS_A=0.7, 0.0, -0.2 ;车身侧（此例中 body A 为底盘）。POS_A 与 POS_B 于 0.2 起可用
STEER_JOINT_0_POS_A_1=0.7, 0.0, -0.22
STEER_JOINT_0_POS_B=0.05, 0.0, -0.2 ;轮胎侧（body B 为轮毂）

DJ4=PUSHROD                     ;用作推杆（从轮毂到摇臂）的距离关节
DJ4_BODY_A=ROCKER
DJ4_POS_A=0.6, 0.1, 0.05        ;摇臂侧
DJ4_POS_B=0.1, -0.2, 0.1        ;车轮侧
DJ4_LENGTH_OFFSET = 0.0         ; 默认长度调整——本例中推杆将用于调整离地间隙，因此它在某种程度上类似于原生悬挂类型中的 "rod_length"。不过大多数悬挂会改用弹簧预载来实现这一目的。

DJ5=T_BAR_ROD
DJ5_BODY_A=ROCKER
DJ5_BODY_B=T_BAR
DJ5_POS_A=0.7, 0.1, 0.1         ;摇臂侧
DJ5_POS_B=0.7, 0.2, 0.4         ;t-bar 侧

DJ6=ARB_CONSTRAINT1             ;这些距离关节在复现一套相对复杂的防倾杆（ARB）/第三弹簧连杆机构
;DJ6_BODY_A=CHASSIS2
DJ6_BODY_B=T_BAR
DJ6_POS_A=0.5, 0.0, 0.4         ;底盘侧
DJ6_POS_B=0.8, 0.2, 0.4         ;t-bar 侧
DJ6_PARITY=-1

J0=T_BAR_BJ                     ;球头关节可用于将刚体连接在一起，仅保留旋转自由度
;J0_BODY_A=CHASSIS2
J0_BODY_B=T_BAR
J0_POS=0.8, 0.0, 0.4
J0_PARITY=0                     ;有意不做镜像，因为全车只有一个该部件

;SLIDER_0=TOOLBOX_PATH          ;滑块将两个刚体约束为仅沿单一轴移动。
;SLIDER_0_BODY_B=TOOLBOX        ;可以直接定义 AXIS，或用 POS_A、POS_B 计算得出
;SLIDER_0_AXIS=0.0,0.0,1.0
;SLIDER_0_POS_A=0,0,0           ;生成的轴优先于 AXIS，两者皆可使用
;SLIDER_0_POS_B=0,0,1

;[REAR_TORSION_0]               ;扭杆可用于实现底盘形变——注意别做成无阻尼弹簧！
;RATE=30000                     ;Nm/deg
;PRELOAD_TORQUE=0               ;施加到铰链的预紧扭矩（Nm）
;PRELOAD=0                      ;施加到铰链的预载角度（度），与扭矩叠加生效
;HINGE=CHASSIS_HINGE            ;扭杆所连接的铰链
;PARITY=0

[REAR_COILOVER_0]               ;用作角阻尼器的 coilover。coilover 将弹簧与阻尼器合为一体（还附带一些其他功能）。截至 v1.79 使用时需要 dampers.ini。
PULL_FORCE=0                    ;1 表示拉式弹簧/阻尼器，默认 0（常规受压式弹簧/阻尼器）
INSTALL_RATE=4000000            ;可选——coilover 总成的安装刚度，N/m
RATE=200000                     ;N/m
;HELPER_RATE=2000               ;辅助弹簧的 N/m——0.2.2 新增——目前无法与弹簧 LUT 同用（弹簧 LUT 与线性弹簧并联作用，而非串联）
;HELPER_TRAVEL=0.02             ;辅助弹簧完全压缩时的变形量（米）——0.2.2 新增
;BODY_A=CHASSIS2                ;默认为 CHASSIS
BODY_B=ROCKER                   ;默认为 HUB_L
PRELOAD=0.0                     ;米
PRELOAD_FORCE=2400              ;N——适用于希望无论使用哪根弹簧，静态离地间隙下弹簧长度始终一致的情况。本例中车辆以推杆调整离地间隙，并希望阻尼器保持「设计」长度，因此使用预紧力。
POS_A=0.5, 0.1, 0.5             ;POS_A 与 POS_B 为 0.2+ 写法
POS_B=0.7, 0.1, 0.1
MIN_LENGTH=0.3                  ;阻尼器最小长度（触及硬限位、限制悬挂行程之处）
MAX_LENGTH=0.5                  ;阻尼器最大长度
END_RATE=1000000                ;硬限位的弹簧刚度
END_VTAPER=0.02                 ;回弹时限位刚度开始衰减的速度
END_VMAX=0.10                   ;回弹时限位附加力降为 0 的速度（这些参数有助于能量耗散，避免剧烈落地后反复弹跳）
BUMPSTOP_GAP=0.035              ;到缓冲块的间隙（悬挂处于阻尼器设计长度时，即 sqrt((pos0-pos1)^2)）。另一种理解：缓冲块开始介入时相对于 0 点（设计位置）的行程
ELECT_LOG=CORNER                ;CORNER 或 HEAVE；每根车轴仅使用一次，它指定将该 coilover 的行程作为该车轴所指定的角/垂向阻尼器行程记录到特定通道

[REAR_COILOVER_1] ;垂向阻尼器
PULL_FORCE=1                    ;拉式弹簧/阻尼器
INSTALL_RATE=5000000            ;N/m
RATE=0                          ;N/m——本例中无弹簧，仅缓冲块
;BODY_A=CHASSIS2
BODY_B=T_BAR
PRELOAD=0.0                     ;米
PRELOAD_FORCE=0                 ;N——此处不施加任何预载，因为悬挂的其余部分已负责此事（况且此 coilover 没有弹簧，预载也不会生效）
POS_A=0.8, 0.1, 0.1             ;底盘（body A）
POS_B=0.8, 0.2, 0.4             ;t-bar
MIN_LENGTH=0.2
MAX_LENGTH=0.4
END_RATE=1000000
END_VTAPER=0.02
END_VMAX=0.10
BUMPSTOP_GAP=0.020
PARITY=0                        ;不镜像，因为垂向弹簧全车仅一根
ELECT_LOG=HEAVE
FLIP_PRELOAD=1                  ;可在设置菜单中翻转预载的符号，说明见下方 setup.ini 条目
;DAMP_BUMP=5000                 ;N sec/m 
;DAMP_FAST_BUMP=1000            ;注意：v0.2+。要在设置菜单中可调，仍需 dampers.ini。「简单」刚度仅用于不可调阻尼器。
;DAMP_FAST_BUMPTHRESHOLD=0.05
;DAMP_REBOUND=10000
;DAMP_FAST_REBOUND=2000
;DAMP_FAST_REBOUNDTHRESHOLD=0.10

;[REAR_SPRING_0]                ;也可以添加简单弹簧
;PULL_FORCE=1                   ;默认 0；其行为与 coilover 不同：无论变形为正还是为负，它都施加拉力；而在 coilover 上只是简单地翻转符号
;POS_A=0.7, 0.1, 0.1            ;底盘（body A）
;POS_B=0.7, 0.2, 0.4            ;t-bar
;BODY_A=ROCKER
;BODY_B=T_BAR
;RATE=1                         ;N/m
;INSTALL_RATE=4000000           ;可选——弹簧的安装刚度，N/m
;SPRING_LUT=(0.2=0|0.3=1230|0.4=2500)    ;可选，m|N
;BUMPSTOP_LUT=(0=0|0.03=5000|0.06=20000) ;可选，橡胶缓冲块的 变形(m)=力(N) LUT
;BUMPSTOP_GAP=0.25

;[REAR_DAMPER_0]                ;以及简单阻尼器
;DAMP_BUMP=5000                 ;N sec/m
;DAMP_FAST_BUMP=1000
;DAMP_FAST_BUMPTHRESHOLD=0.05
;DAMP_REBOUND=10000
;DAMP_FAST_REBOUND=2000
;DAMP_FAST_REBOUNDTHRESHOLD=0.10
;BODY_A=CHASSIS
;BODY_B=HUB_L
;POS_A=0.3,0.5,0
;POS_B=0.3,0.0,0
;MIN_LENGTH=0.355
;MAX_LENGTH=0.575
;END_RATE=1000000
;END_VTAPER=0.02
;END_VMAX=0.10
```

---

*dampers.ini*（基础文档请参见 Cars - Suspension）

新标头（**仅限 1.79**）：
```ini
[FRONT_0] ;为车上每个阻尼器递增索引（包括 coilover 与简单阻尼器——所有简单阻尼器在前，之后是 coilover）

[FRONT_0_BLOWOFF]
```
**v0.2+**：
```ini
[FRONT_0] ;用于简单阻尼器

[FRONT_C0] ;用于 coilover，索引与 suspensions.ini 中一致

[FRONT_0_BLOWOFF]

[FRONT_C0_BLOWOFF]
```
---
*bumpstops.ini*（基础文档请参见 Cars - Suspension）

新标头：
```ini
[FRONT_C0] ;简单阻尼器使用 FRONT_0 格式，coilover 则加 C，请确保索引与 suspensions.ini 中的一致
DEFAULT=1 ;与基础文档相同
STACK=2 ;与基础文档相同

[FRONT_C0_0]
LUT=sameasbasedocs.lut
[FRONT_C0_1]
LUT=stillsameasbasedocs.lut
```

---

*setup.ini*

与上面的 suspensions.ini 示例配套使用：
```ini
[TORSION_RATE_LF_0] ;每个角各一条，索引与 suspensions.ini 相同
SHOW_CLICKS=0
TAB=SUSPENSION
NAME=Torsion Bar LF
LUT=suspension_bars_t.lut ;可用常规 MIN/MAX/STEP 或 LUT
POS_X=0
POS_Y=0
HELP=HELP_LF_WHEELRATE

[SPRING_RATE_LR_C0] ;C0 表示 coilover 0
SHOW_CLICKS=0
TAB=SUSPENSION
NAME=Spring Rate LR
LUT=suspension_springs.lut
POS_X=0
POS_Y=8
HELP=Null

;[SPRING_RATE_LR_0] ;0 表示简单弹簧 0
;SHOW_CLICKS=0
;TAB=SUSPENSION
;NAME=Spring Rate LR
;LUT=suspension_springs.lut
;POS_X=0
;POS_Y=8
;HELP=Null

[DJ4_LENGTH_OFFSET_LR] ;适用于任何距离关节。通过设置菜单调整长度，0 为设计长度。
SHOW_CLICKS=0
TAB=SUSPENSION
NAME=Pushrod Length Rear
MIN=-100 ;0.1mm
MAX=100  ;0.1mm
STEP=2   ;0.1mm
POS_X=0.5
POS_Y=7
HELP=NULL

[DJ0_POS_A_SETTING_LR]     ;更改指定关节所用的坐标，目前支持 DJ 与 STEER_JOINT（v0.2+）
SHOW_CLICKS=0
TAB=SUSPENSION
NAME=Front Geometry
LUT=setup_front_susp.lut ;LUT 为可选，它按 suspensions.ini 条目中定义的索引进行选择，因此也可使用 MIN/MAX/STEP。
DEFAULT=0                ;更改默认加载的悬挂几何
POS_X=0.5
POS_Y=3
HELP=NULL

[STEER_JOINT_0_POS_A_SETTING_LR]
SHOW_CLICKS=0
TAB=SUSPENSION
NAME=Front Geometry
LUT=setup_front_susp.lut ;LUT 为可选，它按 suspensions.ini 条目中定义的索引进行选择，因此也可使用 MIN/MAX/STEP。
DEFAULT=0                ;更改默认加载的悬挂几何
POS_X=0.5
POS_Y=3
HELP=NULL

[STEER_JOINT_0_LENGTH_OFFSET_LR] ;v0.2+，适用于任何转向关节。通过设置菜单调整长度，0 为设计长度。
SHOW_CLICKS=0
TAB=SUSPENSION
NAME=Tie Rod Length Rear
MIN=-100 ;0.1mm
MAX=100  ;0.1mm
STEP=2   ;0.1mm
POS_X=0.5
POS_Y=7
HELP=NULL

[SPRING_PRELOAD_LR_C1] ; 弹簧间隙，取反符号，单位 0.1mm——可以反向利用预载为弹簧留出间隙；本例中「预载」实际被用作弹簧间隙，因此 suspensions.ini 中的值是翻转过的
SHOW_CLICKS=0
TAB=SUSPENSION HEAVE
NAME=Spring Gap
MIN=-200 ;0.1mm
MAX=700
STEP=1
POS_X=0
POS_Y=4
HELP=HELP_HF_TRAVEL_RANGE

[BUMPSTOP_LR_C1] ; 橡胶
SHOW_CLICKS=0
TAB=SUSPENSION HEAVE
NAME=Bump Rubber R
LUT=bs_setup.lut
POS_X=1
POS_Y=3
HELP=HELP_HR_WHEELRATE

[BUMPSTOP_GAP_LR_C1] ; 橡胶间隙
SHOW_CLICKS=0
TAB=SUSPENSION HEAVE
NAME=Bump Rubber Gap
MIN=0  ;mm
MAX=70 ;mm
STEP=1 ;mm
POS_X=1
POS_Y=4
HELP=HELP_HF_TRAVEL_RANGE

[BUMPSTOP_NUM_LR_C1] ; 橡胶堆叠数
SHOW_CLICKS=0
TAB=SUSPENSION HEAVE
NAME=Bump Rubber Stack
MIN=1
MAX=4
STEP=1
POS_X=0.5
POS_Y=5
HELP=Null

[DAMPER_BUMP_LF_C0] ;v0.2+ 起索引与 suspensions.ini 中的索引一致，而不再是车上的「真实」索引。例如：若 suspensions.ini 中索引 1 处有一个 parity=0 的阻尼器，则 LF_1 存在而 RF_1 不存在。
SHOW_CLICKS=2
TAB=DAMPERS
NAME=Bump
MIN=0
MAX=41
STEP=1
DEFAULT=13
POS_X=0
POS_Y=0
HELP=HELP_LF_DAMPER_BUMP

;[DAMPER_BUMP_LF_0] ;v0.2+
;SHOW_CLICKS=2
;TAB=DAMPERS
;NAME=Bump
;MIN=0
;MAX=41
;STEP=1
;DEFAULT=13
;POS_X=0
;POS_Y=0
;HELP=HELP_LF_DAMPER_BUMP
```
---

*suspensions.ini 实战示例*

麦弗逊滑柱：
```ini
[FRONT]
TYPE=COSMIC
RIM_OFFSET=0.047	; 原厂规格										
BASEY=-0.222	
TRACK=1.565 ; 使用 COSMIC 时轮距需计入轮辋偏移（本质上是从轮毂面量到轮毂面），原生 TRACK=1.471									
HUB_MASS=52.2		; 前悬簧下质量，不含下文新增的任何簧下质量

BODY_0_NAME=STRUT_HELPER
BODY_0_MASS=10
BODY_0_POS=0.215,0.45,-0.0306 ; 应位于滑柱顶部；借助此刚体，滑块才能通过球头关节安装到底盘上
BODY_0_MIRROR=1
; 转向拉杆
STEER_JOINT_0=STEER_LINK
STEER_JOINT_0_POS_A=0.385, -0.078, 0.07
STEER_JOINT_0_POS_B=0.039, -0.100, 0.129
DJ0=LCA_REAR
DJ0_POS_A=0.42,-0.091, -0.34
DJ0_POS_B=0.0525, -0.122, 0.01
DJ0_KP=0
DJ1=LCA_FRONT
DJ1_POS_A=0.42,-0.091 ,-0.04
DJ1_POS_B=0.0525, -0.122, 0.01
; 将滑柱安装到车身
J0=STRUT_TOP
J0_BODY_B=STRUT_HELPER
J0_POS=0.215,0.45,-0.0306
J0_KP=1
; 滑块使轮毂可相对辅助刚体移动
SLIDER_0=STRUT_MOTION
SLIDER_0_BODY_A=STRUT_HELPER
SLIDER_0_AXIS=-0.108, -0.45, 0.0306 ; 轴或位置坐标均可使用
SLIDER_0_POS_A=0.215,0.45,-0.0306    ; 若给出位置则使用位置
SLIDER_0_POS_B=0.107,0.0,0.0

TOE_OUT=0.00000					; 前束外张值，以车身侧转向拉杆安装点的横向偏移量（米）表示
STATIC_CAMBER=-0.7				; 静态外倾角（度）。实际外倾角随悬挂几何与运动而变，请在游戏中核对数值

[FRONT_COILOVER_0]
RATE=21000
PRELOAD=0.138
POS_A=0.215,0.45,-0.0306 ; 滑柱顶部
POS_B=0.107,0.0,0.0 ; 与滑块相同
MIN_LENGTH=0.40
MAX_LENGTH=0.54
BUMPSTOP_GAP=0.033

[FRONT_DAMPER_0] ;使用简单阻尼值
DAMP_BUMP=2750		
DAMP_FAST_BUMP=1040	
DAMP_FAST_BUMPTHRESHOLD=0.053		
DAMP_REBOUND=5850	
DAMP_FAST_REBOUND=2700	
DAMP_FAST_REBOUNDTHRESHOLD=0.053	
POS_A=0.215,0.45,-0.0306 ; 坐标与 coilover 相同
POS_B=0.107,0.0,0.0
```

---

### 通用提示

* 善用默认值！COSMIC 悬挂文件很快就会变得非常冗长，但许多参数保持默认即可，这能显著缩短文件。

* 所有刚度、力等均为部件层面的数值。也就是说不再有车轮刚度的换算：弹簧刚度就是弹簧自身的刚度，阻尼器及其高低速切换速度同理。

* 「设计」COSMIC 悬挂时请注意运动约束。球头关节只约束平移，旋转必须由其他元素来控制（再加一个球头关节可将旋转限制为仅 1 个轴，再加一个则完全限制相对运动）。距离关节本质上是两个相连的球头关节，原理相同。铰链基本上也只是两个球头关节（但附带一个存储轴与角度等信息的记忆框架）。

* 如果几何布局中弹簧/阻尼器连接到某根控制臂（例如多数 DWB 设计），正确做法是在控制臂质心处创建一个刚体（一个不错的近似是对 3 个端点坐标取加权平均——轮毂点权重取 2，底盘两点各取 1），再用球头关节将该刚体连接到底盘与轮毂。仅当有部件需要安装到控制臂上时才需要这么做；否则直接用距离关节构造即可。

* 麦弗逊滑柱悬挂可用一个滑块关节、一个刚体和一个球头关节构成。球头关节把滑柱顶部（刚体）连接到底盘，滑块关节把轮毂连接到滑柱顶部。

#### 关节类型

- `BALL`：经由可自由旋转的球窝连接，保持两物体间距恒定：

  <img src="https://files.acstuff.ru/shared/hcP7/20221025-145018.png" width="200">

- `SLIDER`：基础滑块连接：

  <img src="https://ode.org/wiki/images/8/89/Slider.jpeg" width="200">

- `DISTANCE`：保持点间距离恒定的连接：

  <img src="https://files.acstuff.ru/shared/PbU1/20221025-145918.png" width="200">

- `HINGE`：仅允许绕给定轴保留 1 个自由度的连接：

  <img src="https://ode.org/pix/hinge.jpg" width="200">

