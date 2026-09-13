---
title: 牵引力控制
---


> 汉化标题：车辆 – 牵引力控制  
> 原文页面：Cars-–-Traction-Control  
> 原文锚点：8b3d5ed  
> 汉化时间：2026-09-11T23:30:00+08:00  

# 2019 年新增

## 新的可选牵引力控制系统。允许更改滑移目标值与断油量。

### 示例实现：

electronics.ini

```ini
[TRACTION_CONTROL]            ;与 Kunos 实现相同；必需且仍然有效
SLIP_RATIO_LIMIT=0.08         ;默认滑移率限制
CURVE=traction_control.lut    ;tc_setting | 滑移率限制
PRESENT=1 ;可用
ACTIVE=1 ;开启
RATE_HZ=80
MIN_SPEED_KMH=30

[TRACTION_CONTROL_2]
ACTIVE=1
TC2_SETTING=0                            ;TC2 设置调整所必需，TC2 的默认设置

[TC_CONTROLLER_0]
2DLUT=file.2dlut       ;指定控制器使用的 2D 查找表
2D_INPUT_X=SPEED       ;2dlut 使用的 x 轴变量 - 可选项：SPEED, GAS, GEAR, LATG, LONG, STEER, ENGINE_ACCEL, YAW_RATE
2D_INPUT_Y=GAS         ;同上，但用于 y 轴
MODIFY_SLIP_INPUT=1    ;为 0 时控制器修改断油百分比，为 1 时控制器修改目标滑移值
COMBINATOR_2D=ADD      ;ADD 或 MULT - 指定查找表中的值对被修改值执行的操作

[TC_CONTROLLER_1]
INPUT=LATG             ;用于查找的变量 - 可选项：SPEED, GAS, GEAR, LATG, LONG, STEER, ENGINE_ACCEL, YAW_RATE
COMBINATOR=MULT        ;ADD 或 MULT - 指定查找表中的值对被修改值执行的操作
LUT=file2.lut          ;指定控制器使用的查找表
MODIFY_SLIP_INPUT=1

[TC_CONTROLLER_2]      ;注意：一维 LUT 的数学运算在二维运算之前完成
MODIFY_SLIP_INPUT=0
2DLUT=file3.2dlut
2D_INPUT_X=SETTING_2   ;这是 TC2 设置，并非必须使用
2D_INPUT_Y=LONG
COMBINATOR_2D=MULT
LUT=file4.lut          ;指定控制器使用的一维查找表
INPUT=GEAR
COMBINATOR=ADD
```

setup.ini

```ini
[TRACTION_CONTROL_2]
SHOW_CLICKS=0
TAB=ELECTRONICS
NAME=Traction Control 2
MIN=0 ;最小设置编号
MAX=10 ;最大设置编号
STEP=1
POS_X=0.5
POS_Y=1
HELP=NULL
```

