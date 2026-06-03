---
title: 后处理额外选项
---

Assetto Corsa 使用 YEBIS 进行后处理，虽然后处理滤镜可以访问其大部分选项，但仍有一些未被触及。也许你会为它们找到好的用途？

::: tip 提示
新的后处理选择器应用内置了编辑器，你可以通过上下文菜单访问它。
:::

<img src="https://thumbs.gfycat.com/MerryGrandGuineafowl-size_restricted.gif" width="400" />

## 调整自动曝光的测光区域大小

```ini
[EXT_AUTO_EXPOSURE]
METERING_AREA_SIZE = 0.2, 0.2    ; 测光区域大小（X 和 Y），1 表示完整宽度或高度
METERING_AREA_OFFSET = 0.0, 0.1  ; 相对中心的偏移，单位相同
METERING_AREA_DEBUG = 0          ; 设为 1 可高亮显示该区域
```

## 色彩分级（Color Look Up Tables）

```ini
[EXT_COLOR_GRADING]
ENABLED = 1
STRENGTH = 1.0  ; 从 0 到 1
FILE = 'data:image/png;base64,iVBORw0KGgoAAAAN…'
```

对于 `FILE`，你可以使用位于 "system/cfg/ppfilters" 中的 PNG 图片文件名，也可以将其编码为 [base64](http://b64.io/) 并使用 base64 PNG URL。图片可以是常见的 CM 兼容格式，[如图所示](http://api.unrealengine.com/udk/Three/rsrc/Three/ColorGrading/RGBTable16x1.png)，也可以是 HaldCLUT 图片。如果无法加载，请尝试以更常规的 PNG 格式（如 24 bpp）保存（48 bpp 从 0.1.41 版本开始支持）。

## 额外色彩变换

与应用于 LDR 图像（色调映射之后，最亮区域为普通白色）的色彩分级不同，这些变换应用于色调映射之前的 HDR 图像。顺序由节索引决定。

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

### 支持的色彩变换类型

- 无参数：`GRAYSCALE`、`NEGATIVE`；
- 单数值 `VALUE` 参数：`SATURATION`、`BRIGHTNESS`、`CONTRAST`、`BIAS`、`SEPIA_TONE`；
- 三数值 `RGB` 参数：`SATURATION_RGB`、`MODULATION_RGB`、`CONTRAST_RGB`、`BIAS_RGB`；
- 多参数：
  - `TEMPERATURE`（参数：`TEMPERATURE_K`，数值；`LUMINANCE`，数值）；
  - `WHITE_BALANCE`（参数：`TEMPERATURE_K`，数值；`LUMINANCE`，数值）；
  - `MONOTONE_RGB`（参数：`RGB`；`EFFECT_RATIO`，数值）；
  - `MONOTONE_RGB_SAT_MOD`（参数：`RGB`；`SATURATION`，数值；`MODULATION`，数值）；
  - `FADE_RGB`（参数：`RGB`；`EFFECT_RATIO`，数值）；
  - `HUE`（参数：`HUE`，数值；`KEEP_LUMINANCE`，标志）；
  - `HSB`（参数：`HUE`，数值；`SATURATION`，数值；`BRIGHTNESS`，数值；`KEEP_LUMINANCE`，标志）。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Post-processing-–-Extra-options) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
