---
title: 空气动力学
---


> 汉化标题：车辆 – 空气动力学  
> 原文页面：Cars-–-Aerodynamics  
> 原文锚点：6577c01  
> 汉化时间：2026-09-11T23:30:00+08:00  
> 译注：ride height 译作「离地间隙」；balance 译作「配比」（指前后下压力分配）  

### 空气动力学控制器新增 `HEADLIGHTS` 输入

示例：

```ini
[DYNAMIC_CONTROLLER_0]
WING=1
COMBINATOR=ADD ; 或 MULT，与其他控制器相同
INPUT=HEADLIGHTS
LUT=controller.lut ; 0 为关，1 为开
FILTER=0.5
UP_LIMIT=90
DOWN_LIMIT=0
```

**在 aero.ini 中使用内联 LUT 的新选项**

### 完整空气动力学图谱实现（2D 查找表及众多功能）

实现示例：

_aero.ini_

- **注意：AC 加载时仍至少需要一个 [WING] 元素**

```ini
[MAP_0]
NAME = name    
MAP_CL_RH = filename.2Dlut    ;cl*面积 vs 米（各轴的离地间隙）    
MAP_CD_RH = filename.2Dlut    ;cd*面积 vs 米（各轴的离地间隙）    
MAP_BALANCE_RH = filename.2Dlut    ;前:后 cl*面积之比 vs 米（各轴的离地间隙）
MAP_YAW_CL = filename.lut    ;度|乘数
MAP_YAW_CD = filename.lut    ;度|乘数
MAP_YAW_BALANCE = filename.lut    ;度|加法
MAP_ROLL_CL = filename.lut    ;度|乘数
MAP_ROLL_CD = filename.lut    ;度|乘数
MAP_ROLL_BALANCE = filename.lut    ;度|加法
MAP_STEER_CL = filename.lut    ;度（车轮处平均值）|乘数
MAP_STEER_CD = filename.lut    ;度（车轮处平均值）|乘数
MAP_STEER_BALANCE = filename.lut    ;度（车轮处平均值）|加法
MAP_SPEED_CL = filename.lut    ;kph|乘数
MAP_SPEED_CD = filename.lut    ;kph|乘数
MAP_SPEED_BALANCE = filename.lut    ;kph|加法
FRONT_RH_OFFSET = 0.00 ;米（静态离地间隙偏移——会叠加到送入 2D-LUT 查找的离地间隙输入值）    
REAR_RH_OFFSET = 0.00 ;同上    
CL_MULT = 1.00
CD_MULT = 1.00
BALANCE_OFFSET = 0.00    ;%/100    
INTERPOLATION = LINEAR          ; LINEAR, CUBIC
DRAG_OFFSET = 0.00, 0.00    ;米，米——左/右、上/下
FRONT_FORCE_DELAY=0.05    ;车辆前部受力的延迟——数值越大意味着延迟越小
REAR_FORCE_DELAY=0.04    ;车辆后部受力的延迟——数值越大意味着延迟越小
DRAG_FORCE_DELAY=0.045    ;阻力的延迟——数值越大意味着延迟越小
```

2D LUT 示例（x 轴为前部离地间隙，y 轴为后部——轴向右、向下移动时数值必须递增）：

```
    0.015    0.020    0.025    
0.020    1    1    1    
0.025    1    1    1    
0.030    1    1    1    
0.035    1    1    1    
0.040    1    1    1
```

以制表符/空格分隔，便于从电子表格软件（如 MS Excel）导入。建议先在 Excel 中构建表格，再复制粘贴到你的 2DLUT 文件中。

### 空气动力学风扇实现（例如 Chaparral 2J）

实现示例：

_aero.ini_

```ini
[FAN_0]    
NAME=Name    
MAP_FORCE_RH=filename.2Dlut          ; 米（各轴的离地间隙）vs. 产生的力    
MAP_BALANCE_RH=filename.2Dlut         ; 米（各轴的离地间隙）vs. 前部配比（%/100）    
MAP_SPEED_FORCE=filename.lut         ; kph|力乘数    
MAP_SPEED_BALANCE=filename.lut          ; kph|配比偏移    
FRONT_RH_OFFSET=0.000          ; 米（静态离地间隙偏移）    
REAR_RH_OFFSET=0.000        ; 米（静态离地间隙偏移）    
FORCE_MULT=1.00
BALANCE_OFFSET=0.00         ; %/100    
INTERPOLATION=LINEAR          ; LINEAR, CUBIC
```

### 空气动力学图谱设置调整

实现示例：

_setup.ini_

```ini
[AEROMAP]
SHOW_CLICKS=0
TAB=AERO
NAME=Aero Configuration ; 该设置选项的标题
LUT=aero_map_setup.lut ; 格式：显示名称|空气动力学图谱索引
DEFAULT=0 ; 默认图谱索引（LUT 中包含的其他图谱将被关闭，除非在设置窗口中选中）
POS_X=0.5
POS_Y=9
HELP=NULL ; 目前仅支持原版 AC 选项。
```

