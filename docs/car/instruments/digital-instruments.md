---
title: 数字仪表
---

# 数字仪表（Digital Instruments）

这是一种临时的、有些取巧的方法，不允许定义新的数字仪表，而是仅替换 "data/digital_instruments.ini" 中定义的原始 Kunos 仪表上的文本。

## 语法

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
DIGITAL_ITEM_NUMBER_FORMAT = GEAR  ; 仅从 v0.1.61 起支持
```

首先，[输入类型](./inputs)在章节名称中设置（为了向后兼容等）。之后，你可以像往常一样在该章节中设置其他输入选项，如 `INPUT_LAG`。

另一个关键值 `DIGITAL_ITEM`，引用 "data/digital_instruments.ini" 中数字仪表的索引。只需使用其章节名称中 "_" 后面的数字。

其他值（按应用顺序）：
- `VALUE_OFFSET`：偏移值（不过现在你可以直接使用 `INPUT_ADD`）；
- `UPPER_BOUND`：可选地限制最大值以避免溢出；
- `OUTPUT_MULTIPLIER`：值的乘数（同样，`INPUT_MULT` 可能是更好的选择）；

## 格式

使用 `DIGITAL_ITEM_NUMBER_FORMAT` 你可以设置值的格式。它可以是特殊准备格式的关键字，或基本的 C 风格格式字符串。或者更基本的，如果缺少 "%" 符号，则按以下方式解析：

- 点之前的数字设置小数点前显示的位数；
- 如果该数字以 0 开头，额外的位数将是零。否则，将是空格。
- 点后的数字设置小数点后的位数。

### 特殊格式

- `GEAR`：默认 `-1` 为 `R`，`0` 为 `N`，大于 0 的值为数字，用于 `[DI_GEAR_...]`。你可以替换 `R` 和 `N`：
  ```ini
  [DI_GEAR_...]
  DIGITAL_ITEM_NUMBER_FORMAT = GEAR, Rev, Neut
  ```

- `GEAR_AUTO`：相同，但大于 0 的值使用 `D`。同样，你可以替换单词：
  ```ini
  [DI_GEAR_...]
  DIGITAL_ITEM_NUMBER_FORMAT = GEAR_AUTO, reverse, neutral, drive
  ```

- `COMPASS`：将度数转为罗盘缩写，如 `N`、`SE` 或 `NNE`。默认限制为两个字母，要允许第三个字母，使用：
  ```ini
  [DI_WIND_DIR_...]
  DIGITAL_ITEM_NUMBER_FORMAT = COMPASS, LARGE
  ```

- `TIME`：适用于 `[DI_TIME_...]` 显示一天中的时间。第二个参数是 [C 时间格式字符串](https://www.geeksforgeeks.org/strftime-function-in-c/)：
  ```ini
  [DI_TIME_...]
  DIGITAL_ITEM_NUMBER_FORMAT = TIME, '%I:%M %p'  ; 12 小时制
    ; 顺便说一句，注意引号。如果字符串不仅仅是一个简单的单词，
    ; 最好使用引号以避免与逗号等混淆
  ```

- `LAP_TIME`：很好地格式化比赛时间，包括分钟、秒和毫秒。如果需要，小时也会添加到前面。你可以使用第二个参数替换未设置时间的文本，默认为 "-:--:--"：
  ```ini
  [DI_LAP_TIME_...]
  DIGITAL_ITEM_NUMBER_FORMAT = LAP_TIME, none
  ```

## 后续功能

- 添加不依赖原始实现的新数字仪表实现。

更多输入类型请参考[仪表输入](./inputs)，模拟仪表请参考[模拟仪表](./analog-instruments)。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-Digital-instruments) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
