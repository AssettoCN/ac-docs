---
title: 自定义悬挂关节
---


> 汉化标题：车辆 – 自定义悬挂关节  
> 原文页面：Cars-–-Custom-suspension-joints  
> 原文锚点：a0e3c11  
> 汉化时间：2026-09-12T00:00:00+08:00  

### **已弃用；请参阅 COSMIC 悬挂系统以获取更好的方案**

用于修改悬挂几何的高度实验性选项，或许能应付某些特殊情况。配置时请务必小心，并考虑先禁用 FFB 以防万一。

所有修改都在 “suspensions.ini” 中完成，该文件支持实时编辑（这会使情况更加不稳定：操作前务必禁用 FFB）。

### 添加新连杆

```ini
[_EXTRA_LINK_...]
TYPE = DISTANCE     ; 可选值：FIXED, BALL, SLIDER, DISTANCE
FROM = BODY         ; 可选值：BODY, HUB_LF, HUB_RF, HUB_LR, HUB_RR
TO = HUB_LF         ; 可选值：BODY, HUB_LF, HUB_RF, HUB_LR, HUB_RR
CFM = 0.0000001     ; 约束力混合
ERP = 0.3           ; 误差修正参数
DEBUG_COLOR = R, G, B ; 可选的调试渲染颜色

; 以及连接点（刚体 ID 及相对于它的坐标）：
ANCHOR = BODY, X, Y, Z    ; BALL 关节的位置
AXIS = BODY, X, Y, Z      ; SLIDER 关节的方向
FROM_POS = BODY, X, Y, Z  ; DISTANCE 关节的第一点
TO_POS = HUB_LF, X, Y, Z  ; DISTANCE 关节的第二点
```

#### 关节类型

- `FIXED`：简单的固定关节，保证相对位置和朝向恒定（特殊的 CFM 和 ERP 值可使其变软）；

- `BALL`：通过可自由旋转的球窝连接，保证物体间距离恒定，绕 `ANCHOR` 点旋转：

  <img src="https://files.acstuff.ru/shared/hcP7/20221025-145018.png" width="200">

- `SLIDER`：基础的滑块连接，沿 `AXIS` 方向滑动：

  <img src="https://files.acstuff.ru/shared/zZBk/20221025-145332.png" width="200">

- `DISTANCE`：保证两点之间距离的连接，使用 `FROM_POS` 和 `TO_POS` 值：

  <img src="https://files.acstuff.ru/shared/PbU1/20221025-145918.png" width="200">

#### 关于 CFM 和 ERP

这两个值调节关节的刚度与阻尼。详情请参阅 [ODE 指南](http://ode.org/ode-latest-userguide.html#sec_3_8_0)。

### 修改 AC 原有关节

通常，直接在现有关节之上添加新关节只会把几何固定在某个特定位置，使整体几乎不可用。但借助本功能，您还可以修改现有关节，甚至将其完全禁用。再次提醒，操作时请务必小心处理 FFB 相关的问题。

首先，您需要获取原有关节的描述。只需将以下内容添加到 “suspensions.ini”：

```ini
[_AC_LINK_ALTERATION]
PRINT_OUT = 1
```

随后 CSP 会将现有关节的列表打印到 “Documents/Assetto Corsa/logs/custom_shaders_patch.log”（搜索 “Printing out original AC links” 标题）。了解各关节及其类型和索引后，即可按如下方式修改其参数：

```ini
[_AC_LINK_ALTERATION_...]
WHEELS = …      ; 要影响的车轮列表
LINKS = …       ; 要影响的关节索引列表（从 0 开始）
DEACTIVATE = 0  ; 设为 1 可完全停用关节
CFM = …         ; 若设置，则修改关节的约束力混合值
ERP = …         ; 若设置，则修改关节的误差修正参数
```

`WHEELS` 的可用关键字：

- `LF`, `RF`, `LR`, `RR`；
- `LEFT_FRONT`, `RIGHT_FRONT`, `LEFT_REAR`, `RIGHT_REAR`；
- `LEFT`, `RIGHT`, `FRONT`, `REAR`（同时影响两个车轮）；
- `ALL`（影响全部车轮）。

