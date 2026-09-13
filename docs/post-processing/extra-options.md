---
title: 额外选项
---


> 汉化标题：后期处理 – 额外选项  
> 原文页面：Post-processing-–-Extra-options  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T19:00:00+08:00  

Assetto Corsa 使用 YEBIS 进行后期处理。虽然后期处理滤镜可以访问其大量选项，但仍有一些选项未曾触及。也许你能为它们找到不错的用途？

*注意：新的后期处理选择器应用内置了编辑器，可以通过上下文菜单像这样访问：*

<a href="https://gfycat.com/MerryGrandGuineafowl"><img src="https://thumbs.gfycat.com/MerryGrandGuineafowl-size_restricted.gif" width="400" ></a>

### 调整自动曝光测光区域的大小

```ini
[EXT_AUTO_EXPOSURE]
METERING_AREA_SIZE = 0.2, 0.2    ; 测光区域的大小（X 和 Y），1 表示整个宽度或高度
METERING_AREA_OFFSET = 0.0, 0.1  ; 相对中心的偏移，单位同上
METERING_AREA_DEBUG = 0          ; 设为 1 可看到该区域以高亮显示
```

### 色彩分级（即色彩查找表）

```ini
[EXT_COLOR_GRADING]
ENABLED = 1
STRENGTH = 1.0  ; 从 0 到 1
FILE = 'data:image/png;base64,iVBORw0KGgoAAAAN…'
```

对于 `FILE`，既可以使用位于 “system/cfg/ppfilters” 中的 PNG 图片的文件名，也可以将其用 [base64](http://b64.io/) 编码后使用该 base64 PNG URL。图片可以是常见的 CM 兼容格式（[例如这样](http://api.unrealengine.com/udk/Three/rsrc/Three/ColorGrading/RGBTable16x1.png)），也可以是 HaldCLUT 图片。如果无法加载，请尝试用更常规的 PNG 格式保存，例如 24 bpp（48 bpp 自 0.1.41 起支持）。

### 额外色彩变换

与作用于 LDR 图像（色调映射之后，此时最亮的区域就是普通的白色）的色彩分级不同，这些变换在色调映射之前作用于 HDR 图像。顺序很重要，由节的索引决定。

```ini
[EXT_COLOR_CORRECTION_0]
TYPE = BIAS_RGB
RGB = -0.05

[EXT_COLOR_CORRECTION_1]
TYPE = MODULATION_RGB
RGB = 1.2

[EXT_COLOR_CORRECTION_2]
TYPE = FADE_RGB
RGB = 0.2, 0.1, 0.2
EFFECT_RATIO = 0.2

[EXT_COLOR_CORRECTION_3]
TYPE = MONOTONE_RGB_SAT_MOD
RGB = 1.2, 1, 1
SATURATION = 1.2
MODULATION = 0.2
```

支持的色彩变换类型：

- 无参数：`GRAYSCALE`、`NEGATIVE`；
- 单个数值参数 `VALUE`：`SATURATION`、`BRIGHTNESS`、`CONTRAST`、`BIAS`、`SEPIA_TONE`；
- 三个数值参数 `RGB`：`SATURATION_RGB`、`MODULATION_RGB`、`CONTRAST_RGB`、`BIAS_RGB`；
- 各式参数：
  - `TEMPERATURE`（参数：`TEMPERATURE_K`，数值；`LUMINANCE`，数值）；
  - `WHITE_BALANCE`（参数：`TEMPERATURE_K`，数值；`LUMINANCE`，数值）；
  - `MONOTONE_RGB`（参数：`RGB`；`EFFECT_RATIO`，数值）；
  - `MONOTONE_RGB_SAT_MOD`（参数：`RGB`；`SATURATION`，数值；`MODULATION`，数值）；
  - `FADE_RGB`（参数：`RGB`；`EFFECT_RATIO`，数值）；
  - `HUE`（参数：`HUE`，数值；`KEEP_LUMINANCE`，标志）；
  - `HSB`（参数：`HUE`，数值；`SATURATION`，数值；`BRIGHTNESS`，数值；`KEEP_LUMINANCE`，标志）。

