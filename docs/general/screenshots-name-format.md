---
title: 截图名称格式
---


> 汉化标题：通用 – 截图名称格式  
> 原文页面：General-–-Screenshots-name-format  
> 原文锚点：9d7370e  
> 汉化时间：2026-09-12T19:00:00+08:00  

自 v0.1.60 起，可以更改截图名称的格式。以下是支持的替换项：

- `{CarID}`：车辆 ID（即文件夹名）；
- `{SkinID}`：涂装 ID；
- `{TrackID}`：赛道 ID；
- `{LayoutID}`：布局 ID；
- `{Car}`：车辆名称；
- `{Track}`：赛道名称；
- `{PPFilter}`：PP 滤镜名称，若已禁用则为 “unknown”；
- `{Year}`：年份，如 2020；
- `{Month}`：两位数月份（01…12）；
- `{Day}`：两位数日期（01…31）；
- `{Hour}`：两位数小时（00…23）；
- `{Min}`：两位数分钟（00…59）；
- `{Sec}`：两位数秒（00…59）；
- `{YearRaw}`：Kunos 格式的年份（减去 1900，即 2020 写作 120）；
- `{MonthNum}`：Kunos 格式的月份（0…11）；
- `{DayNum}`：日期（1…31）；
- `{HourNum}`：小时（0…23）；
- `{MinNum}`：分钟（0…59）；
- `{SecNum}`：秒（0…59）。

示例：

- `Screenshot_{CarID}_{TrackID}_{DayNum}-{MonthNum}-{YearRaw}-{HourNum}-{MinNum}-{SecNum}`

  Kunos 格式，结果类似 “Screenshot_ks_toyota_gt86_ks_brands_hatch_4-5-120-19-46-32”。

- `{Year}{Month}{Day}-{Hour}{Min}{Sec}-{Track}-{Car}`

  按日期整齐排序，结果类似 “20200505-194632-Brands Hatch-Toyota GT86”。

- `{Year}-{Month}/{Year}{Month}{Day}-{Hour}{Min}{Sec}-{TrackID}-{CarID}`

  按月份分组，结果类似 “2020-05\20200505-194632-ks_brands_hatch-ks_toyota_gt86”。

