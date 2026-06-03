---
title: LED 面板
---

# LED 面板（LED Panels）

LED 面板可以帮助设置那些显示比赛位置和车手名称并偶尔闪烁的东西。

与原始的 "digital_panels.ini" 不同，此选项在回放中也可以工作（另外，它支持[任何其他输入类型](./inputs)）。但主要区别在于它使用动态纹理而不是浮动数字，因此它可以更好地贴合弯曲表面，并且不需要特殊的父节点来放置数字。

## 重要说明

在我们进一步讨论之前，我想先深入了解一下它的工作原理和使用方法。它的工作方式是使用动态纹理，背景是透明的，数字或字母使用指定的颜色。这意味着有两种方法可以让它工作：

- 你可以复制底层网格，将新的网格稍微移开，将动态纹理分配给其 `txDiffuse` 槽位，使其发光并将混合模式设置为 alpha test。这是最简单的方法，但它增加了新的绘制调用，需要修改模型，通常看起来相当不稳定。不过还有另一种方法。

- 相反，你可以使用 `ksPerPixelMultiMap_emissive` 着色器，并将动态纹理分配给 `txEmissive` 槽位！你不需要更改模型来替换着色器，简单的 `[SHADER_REPLACEMENT_...]` 调整就可以很好地工作。这样，你不需要编辑任何模型。你可能会想，如果 `txDiffuse` 会应用于生成的发光从而破坏 LED 形状，它怎么可能工作——好消息是，有一个参数可以禁用 `txDiffuse` 的干扰！

## 语法

```ini
[LED_PANEL_...]
MESHES = RSS_EXT_LED_Panel      ; 目标网格
TEXTURE_SLOT = txEmissive       ; 目标纹理槽位
RESOLUTION = 1024, 512          ; 新生成的纹理的分辨率
MASKS_PACK = lumirank_font.zip  ; 包含 LED 遮罩的包的名称
DIGIT_0 = 22, 47, 312, 455      ; 第一个数字的 X, Y, 宽度和高度
DIGIT_1 = 353, 47, 312, 455     ; 第二个数字的 X, Y, 宽度和高度
DIGIT_2 = 692, 47, 312, 455     ; 第三个数字的 X, Y, 宽度和高度
                                ; 你可以设置任意数量的数字

BASE_COLOR = '#ffffff', 0.5    ; 基础颜色（不闪烁时）
FLASHING_COLOR = '#ffffff', 1  ; 闪烁时的颜色
FLASHING_APPLY_MASK = 1        ; 是否将遮罩应用于闪烁

BLANCPAIN_FLASHING_PERIOD = 1       ; Blancpain 闪烁：周期（秒）
BLANCPAIN_FLASHING_DURATION = 0.2   ; 关闭持续时间（秒）
BLANCPAIN_FLASHING_RACE_CLASS = AM  ; 比赛组别（仅在该组别的领先者闪烁）

N24_FLASHING_PERIOD = 3.5        ; N24 闪烁：周期（秒）
N24_FLASHING_TIME = 1.2          ; 闪烁持续时间（秒）
N24_FLASHING_FREQUENCY = 6       ; 闪烁频率，Hz
N24_FLASHING_ACTIVE_SHARE = 0.7  ; 闪烁期间处于活跃阶段的时间比例

ROLE_0 = DRIVER_NAME  ; 第一个角色
ROLE_1 = POSITION     ; 第二个角色
                       ; 你可以设置任意数量的角色

ROLE_DURATION = 3     ; 每个角色持续的时间（秒）
```

## 关于 LED 遮罩和 `MASKS_PACK`

遮罩是黑白纹理，用白色区域标记发光区域。它们与 `texture\display_panel` 中使用的纹理非常相似（虽然它们会绘制在动态纹理上而不是出现在 3D 空间中）。但是，因为现在也可以使用字母，它们增加了一个额外功能，可以节省磁盘空间和比赛期间的 VRAM。你可以准备一个包含所有 LED 的高分辨率遮罩，然后以更低的分辨率制作字母和数字的遮罩，只需粗略覆盖目标 LED 的区域。这可以在不牺牲任何质量的情况下节省大量字节，甚至可能使准备遮罩更容易。

换句话说，它是这样工作的：

- 要渲染字母 "A"，CSP 将打开 `MASKS_PACK` 中提到的 ZIP 存档并查找 "base/a.dds"；
- 它还会查找 "mask.dds"；
- 如果找到遮罩，它将以乘法模式渲染两者；
- 否则，仅使用 "base/a.dds"。

对于闪烁阶段，方法类似：

- 要渲染字母 "A"，CSP 将查找 "flashing/a.dds"；
- 如果那里没有任何内容，它将使用 "flashing_fallback.dds"；
- 如果 `FLASHING_APPLY_MASK` 设为 1，它将使用与非闪烁阶段类似的遮罩；
- 否则，它将直接使用纹理，就像遮罩不存在一样。

## 关于角色

目前，有三种类型的角色：

- `DRIVER_NAME`：打印驾驶员名称（与名称标签中显示的相同），必要时缩短：

  ```ini
  ROLE_0 = DRIVER_NAME
  ```

- `TEXT`：打印在相应参数中设置的静态文本：

  ```ini
  ROLE_0 = TEXT
  ROLE_0_TEXT = HELLO WORLD
  ```

- 其他任何内容将被作为[输入](./inputs)处理，类似于 CSP 数字仪表和其他仪表：

  ```ini
  ROLE_0 = GAS
  ROLE_0_INPUT_MULT = 999
  ```

  注意常规的 "INPUT_…" 参数在这里有对应的 "ROLE_N_" 前缀。除此之外，你可以像往常一样使用它，包括 LUT、延迟等。

  另一个重要细节：默认情况下，数字格式会有前导零，使用此选项更改：

  ```ini
  ROLE_0_NUMBER_FORMAT = 3.0
  ```

## 关于 `ksPerPixelMultiMap_emissive` 和着色器替换

以下是如何通过配置更改着色器并使其发光的示例：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = LED_Panel
SHADER = ksPerPixelMultiMap_emissive
FILL_MISSING_TEXTURES = 1
PROP_... = emSkipDiffuseMap, 1
PROP_... = ksEmissive, 100, 100, 100
```

## 一些技巧

- 如果你想让闪烁颜色更亮，只需降低基础颜色的亮度并提高发光；
- 如果纹理槽位中有一些旧纹理，数字将绘制在其上面；
- 如果你使用 `txEmissive` 方法，降低分辨率与 txDiffuse 分辨率相比可能是有意义的，以节省 VRAM 和性能。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Cars-–-LED-panels) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
