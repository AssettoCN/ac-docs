---
title: 截图命名格式
---

# 截图命名格式

自 v0.1.60 起，现在可以更改截图名称的格式。以下是支持的替换变量：

- `{CarID}`：车辆 ID（即文件夹名称）
- `{SkinID}`：皮肤 ID
- `{TrackID}`：赛道 ID
- `{LayoutID}`：布局 ID
- `{Car}`：车辆名称
- `{Track}`：赛道名称
- `{PPFilter}`：PP 滤镜名称，如果禁用则为 "unknown"
- `{Year}`：年份，如 2020
- `{Month}`：两位数的月份（01…12）
- `{Day}`：两位数的日期（01…31）
- `{Hour}`：两位数的小时（00…23）
- `{Min}`：两位数的分钟（00…59）
- `{Sec}`：两位数的秒数（00…59）
- `{YearRaw}`：Kunos 格式的年份（减去 1900，所以 120 而不是 2020）
- `{MonthNum}`：Kunos 格式的月份（0…11）
- `{DayNum}`：日期（1…31）
- `{HourNum}`：小时（0…23）
- `{MinNum}`：分钟（0…59）
- `{SecNum}`：秒数（0…59）

## 示例

- `Screenshot_{CarID}_{TrackID}_{DayNum}-{MonthNum}-{YearRaw}-{HourNum}-{MinNum}-{SecNum}`

  Kunos 格式，结果类似于 `Screenshot_ks_toyota_gt86_ks_brands_hatch_4-5-120-19-46-32`。

- `{Year}{Month}{Day}-{Hour}{Min}{Sec}-{Track}-{Car}`

  按日期排序，结果类似于 `20200505-194632-Brands Hatch-Toyota GT86`。

- `{Year}-{Month}/{Year}{Month}{Day}-{Hour}{Min}{Sec}-{TrackID}-{CarID}`

  按月份分组，结果类似于 `2020-05\20200505-194632-ks_brands_hatch-ks_toyota_gt86`。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-Screenshots-name-format) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
