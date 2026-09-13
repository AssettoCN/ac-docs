---
title: 数字仪表
---


> 汉化标题：车辆 – 数字仪表  
> 原文页面：Cars-–-Digital-instruments  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

这是一种临时且略显取巧的做法：无法定义新的数字仪表，只能替换 “data/digital_instruments.ini” 中定义的原版 Kunos 仪表上的文本。

### 语法

```ini
[DI_DRIVEN_TOTAL_...]
DIGITAL_ITEM = 0
DIGITAL_ITEM_NUMBER_FORMAT = 06.0
UPPER_BOUND = 999999

[DI_DRIVEN_SESSION_...]
DIGITAL_ITEM = 1
DIGITAL_ITEM_NUMBER_FORMAT = 05.1
UPPER_BOUND = 999999

[DI_GEAR_...]
DIGITAL_ITEM = 2
DIGITAL_ITEM_NUMBER_FORMAT = GEAR  ; 仅 v0.1.61 起支持
```

首先，[输入类型](/car/instruments/inputs)是在节名中设定的（出于向后兼容等原因）。之后即可照常在该节中设置其他输入选项，例如 `INPUT_LAG`。

另一个关键值 `DIGITAL_ITEM` 指向 “data/digital_instruments.ini” 中数字仪表的索引。直接使用其节名中 “_” 之后的数字即可。

其他值（按应用顺序）：
- `VALUE_OFFSET`：对数值进行偏移（不过现在直接用 `INPUT_ADD` 即可）；
- `UPPER_BOUND`：可选，限制最大值以避免溢出；
- `OUTPUT_MULTIPLIER`：数值乘数（同样，`INPUT_MULT` 可能是更好的选择）；

### 格式

使用 `DIGITAL_ITEM_NUMBER_FORMAT` 可以设置数值的格式。它可以是特制格式的关键字之一，也可以是基本的 C 风格格式字符串。或者更简单一些：若缺少 “%” 符号，则按以下规则解析：

- 小数点前的数字设置小数点前显示的位数；
- 如果该数字以 0 开头，多出的位数将补零；否则补空格。
- 小数点后的数字设置小数点后的位数。

特殊格式：

- `GEAR`：用于 `[DI_GEAR_...]`，默认 -1 显示 `R`、0 显示 `N`、更大的值显示数字。可以像这样替换 `R` 和 `N`：
  ```ini
  [DI_GEAR_...]
  DIGITAL_ITEM_NUMBER_FORMAT = GEAR, Rev, Neut
  ```

- `GEAR_AUTO`：同上，但大于 0 的值使用 `D` 显示。同样，可以像这样替换这些词：
  ```ini
  [DI_GEAR_...]
  DIGITAL_ITEM_NUMBER_FORMAT = GEAR_AUTO, reverse, neutral, drive
  ```

- `COMPASS`：将角度转换为罗盘方位缩写，如 `N`、`SE` 或 `NNE`。默认最多两个字母，要允许第三个字母，可使用：
  ```ini
  [DI_WIND_DIR_...]
  DIGITAL_ITEM_NUMBER_FORMAT = COMPASS, LARGE
  ```

- `TIME`：适用于 `[DI_TIME_...]` 显示一天中的时间。第二个参数是 [C 的时间格式字符串](https://www.geeksforgeeks.org/strftime-function-in-c/)：
  ```ini
  [DI_TIME_...]
  DIGITAL_ITEM_NUMBER_FORMAT = TIME, '%I:%M %p'  ; 12 小时制
    ; 顺便提醒一下引号的用法。如果字符串不止一个简单的单词，
    ; 最好加上引号，以免与逗号之类的内容混淆
  ```

- `LAP_TIME`：将比赛时间漂亮地格式化为分、秒和毫秒。需要时也会在最前面加上小时。可以用第二个参数替换尚未开始计时时的占位文本，默认为 “-:--:--”：
  ```ini
  [DI_LAP_TIME_...]
  DIGITAL_ITEM_NUMBER_FORMAT = LAP_TIME, none
  ```


### 待添加的功能

- 添加不依赖原版实现的新数字仪表。

