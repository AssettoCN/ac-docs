---
title: 轮胎热模型
---


> 汉化标题：车辆 – 轮胎热模型  
> 原文页面：Cars-–-Tyre-Thermal-Models  
> 原文锚点：1f0d3be  
> 汉化时间：2026-09-11T23:30:00+08:00  
> 译注：core 译作「核心」（指胎内空气温度层）；compound 译作「配方」  

# 热模型 V4（开发中，0.3.0 新增）
全新的基于物理的热模型，包含轮辋温度、侧壁温度以及多层胎面/胎体温度，还包含物理轮胎磨损。计算开销远高于 V1/2 模型。

调试/可视化页面请见 Car Debug 应用。

强烈建议将麦克斯韦迟滞阻尼（代码见轮胎物理页）与本模型配合使用。

本模型设计为基本即插即用，因此即使不显式写出大多数参数也应能正常工作（它们已被设为合理的默认值）。如果根据描述无法判断某参数的含义，建议不要修改它。

注意：该模型仍处于开发阶段，**将来必定**会变化，在项目中使用时请牢记这一点。

### 实现示例（`tyres.ini`）

```ini
[_EXTENSION]
PRACTICAL_TEMP_RATIO=1              ; 目前已废弃。
USE_TREAD_COVER=1                   ; 可能现已废弃，但无论如何建议保留。
LATERAL_RAYS=3                      ; 每侧数量，热分布计算需要一定数量
LONGITUDINAL_RAYS=4                 ; 每侧数量，热分布计算需要一定数量

[THERMAL_MODEL]  
VERSION=4
DEBUG=0                             ; 将热功率输出到 CSP Logger。通道数量庞大，勿长期开启。

[ADDITIONAL1]
CAMBER_TEMP_SPREAD_K=1              ; 控制轮胎温度的横向分布。公式可能会变。

[FRONT]
WIDTH=0.300                         ; 轮胎胎面宽度，用于热模型中的体积/质量计算
RADIUS=0.350                        ; 轮胎无负载半径，用于热模型中的体积/质量计算
TREAD_DEPTH=0.01                    ; 胎面部分深度（米），光头胎不要包含此行
TREAD_COVER=0.3                     ; 胎面沟槽占比（%/100），现用于表面对流计算，光头胎不要包含此行
WEAR_RATE=0.03                      ; 物理磨损率（主要基于做功能量），用于计算材料脱落导致的温度损失
SIDEWALL_K_MULT=1.0                 ; 侧壁横向刚度与垂直刚度之比
SIDEWALL_K_MULT_X=2.0               ; 侧壁纵向刚度与垂直刚度之比
ROLLING_RESISTANCE_0=12             ; 如今比以往任何时候都更重要，滚动阻力直接控制轮胎内部的能量产生
ROLLING_RESISTANCE_1=0.0001         ; 与速度成正比的分量，影响净 RR 及净能量输入
ROLLING_RESISTANCE_SLIP=1000        ; 与「滑移」成正比的分量，影响弯道行驶带来的额外 RR（以及内部产热）

[THERMAL_FRONT]
OPTIMAL_TEMP_OFFSET=0               ; 可用于为不同配方快速偏移摩擦 LUT
PERFORMANCE_CURVE=tcurve.lut        ; 抓地力乘数 vs 温度查找表
;PERFORMANCE_MAP=tmap.2dlut         ; 抓地力乘数 vs 温度（degC，x 轴）与滑移速度（m/s，y 轴）的 2D 查找表。若没有数据，不推荐使用。

BULK_THICKNESS=0.015                ; 整个主体部分的厚度（米）
SIDEWALL_THICKNESS=0.005            ; 整个侧壁部分的厚度（每侧，米）

VOLUMETRIC_HEAT_CAPACITY=1700       ; kJ/(m^3K)，0C 时的基准值
SURFACE_TRANSFER=500                ; 路面传热基准速率，W/(m^2K)
CONDUCTIVITY=0.25                   ; 胎面/主体导热系数，W/(mK)
EFFUSIVITY=0.50                     ; 热渗透系数（effusivity）控制轮胎:沥青路面的能量分配（effusivity 比值），1.0 表示 100% 能量进入轮胎
WEAR_K=1.0                          ; 物理磨损吸收能量的系数
GRAIN_GAIN=0.0                      ; 与原版相同
BLISTER_GAIN=0.0                    ; 与原版相同
SURFACE_TO_AMBIENT=10               ; 表面对流总增益
SURFACE_TO_AMBIENT_SIDEWALL=5       ; 侧壁对流总增益
ENGINE_BAY_MIX=0, 0                 ; 左、右。控制发动机舱空气与流向轮胎/车轮气流混合的比例。经验修正因子，仅在必要时使用。

RADIATION_CONSTANT=0.95             ; 发射率（控制辐射散热）

CARCASS_ROLLING_K=0.6               ; 控制滚动阻力转化为轮胎主体内部热量的百分比
FLEX_SPEED_COEFF=0.5                ; 控制垂直阻尼转化为轮胎主体内部热量的百分比

INTERNAL_CONVECTION_K=0.5           ; 控制轮辋/核心/胎体之间传热的内部对流

RIM_TO_AMBIENT=0.0005               ; 待重做，控制轮辋向环境的传热（与 v1/2 模型类似）
BRAKE_TO_RIM=0.00010                ; 待重做，控制制动向轮辋的传热（与 v1/2 模型类似）
```


# 热模型 V1 与 V2
通过添加胎体温度和改进的传热建模来革新 AC 的轮胎热模型。  
*参数更真实，但也更难调校。*

### 实现示例（`tyres.ini`）  
*仅显示与扩展相关的参数。所有 Kunos 参数仍然必需。*

```ini
[THERMAL_MODEL]
VERSION = 1 ; 热模型版本。当前版本：1、2。V2 与扩展光线配合使用，可动态计算左右两侧的温度分布，并更改部分计算。


[THERMAL_FRONT] ; Kunos 参数（部分被赋予新用途）
SURFACE_TRANSFER=0.93          ; 赛道到轮胎表面的冷却速率
PATCH_TRANSFER=0.002           ; 胎面上的横向热分布
CORE_TRANSFER=0                ; 已废弃
INTERNAL_CORE_TRANSFER=0       ; 已废弃
FRICTION_K=0.0127              ; 摩擦产生的热量
ROLLING_K=0                    ; 已废弃
PERFORMANCE_CURVE=tcurve_1.lut ; 摄氏度 | 抓地力乘数
COOL_FACTOR=8                  ; SURFACE_TO_AMBIENT 的按速度²缩放的乘数
SURFACE_ROLLING_K=0.001        ; 胎面内部阻力产生的热量


[THERMAL2_FRONT] ; CSP 新增参数
CARCASS_ROLLING_K=0.15         ; 滚动阻力 → 胎体热量
BRAKE_TO_CORE=0.0006           ; 制动热量 → 核心
SURFACE_TO_AMBIENT=0.076       ; 表面 → 空气
SURFACE_TO_CARCASS=0.023       ; 表面 → 胎体
CARCASS_TO_SURFACE=0.61        ; 胎体 → 表面
CARCASS_TO_CORE=0.025          ; 胎体 → 核心
CORE_TO_CARCASS=0.0005         ; 核心 → 胎体
CORE_TO_AMBIENT=0.002          ; 核心 → 环境（经轮辋）
```

---

