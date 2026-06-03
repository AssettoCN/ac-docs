---
title: 牵引力控制
---

# 牵引力控制（Traction Control）

## 2019 年新增

## 新的可选牵引力控制系统。允许更改滑移目标和切断量。

### 示例实现

*electronics.ini*

```ini
[TRACTION_CONTROL]            ; 与 Kunos 实现相同；必需且仍然有效
SLIP_RATIO_LIMIT=0.08         ; 默认滑移比限制
CURVE=traction_control.lut    ; tc_setting | 滑移比限制
PRESENT=1 ; 是否可用
ACTIVE=1 ; 是否开启
RATE_HZ=80
MIN_SPEED_KMH=30

[TRACTION_CONTROL_2]
ACTIVE=1
TC2_SETTING=0                            ; TC2 设置调整所需，TC2 的默认设置

[TC_CONTROLLER_0]
2DLUT=file.2dlut       ; 指定控制器使用的 2D 查找表
2D_INPUT_X=SPEED       ; 2dlut 的 x 轴变量 - 选项：SPEED, GAS, GEAR, LATG, LONG, STEER, ENGINE_ACCEL, YAW_RATE
2D_INPUT_Y=GAS         ; 与上面相同但为 y 轴
MODIFY_SLIP_INPUT=1    ; 如果为零，控制器修改 % 切断量，如果为 1，控制器修改目标滑移值
COMBINATOR_2D=ADD      ; ADD 或 MULT - 指定 LUT 中的值对修改值执行的操作

[TC_CONTROLLER_1]
INPUT=LATG             ; 用于查找的变量 - 选项：SPEED, GAS, GEAR, LATG, LONG, STEER, ENGINE_ACCEL, YAW_RATE
COMBINATOR=MULT        ; ADD 或 MULT - 指定 LUT 中的值对修改值执行的操作
LUT=file2.lut          ; 指定控制器使用的查找表
MODIFY_SLIP_INPUT=1

[TC_CONTROLLER_2]      ; 注意：一维 LUT 数学运算在二维运算之前完成
MODIFY_SLIP_INPUT=0
2DLUT=file3.2dlut
2D_INPUT_X=SETTING_2   ; 这是 TC2 设置，不一定需要使用。
2D_INPUT_Y=LONG
COMBINATOR_2D=MULT
LUT=file4.lut          ; 指定控制器使用的一维查找表
INPUT=GEAR
COMBINATOR=ADD
```

*setup.ini*

```ini
[TRACTION_CONTROL_2]
SHOW_CLICKS=0
TAB=ELECTRONICS
NAME=Traction Control 2
MIN=0 ;最小 # 设置
MAX=10 ;最大 # 设置
STEP=1
POS_X=0.5
POS_Y=1
HELP=NULL
```

相关内容：[启用扩展物理](./enabling)、[轮胎物理](./tyre-physics)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Traction-Control) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
