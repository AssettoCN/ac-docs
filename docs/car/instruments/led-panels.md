---
title: LED 面板
---


> 汉化标题：车辆 – LED 面板  
> 原文页面：Cars-–-LED-panels  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：mask 译作「蒙版」；原文 `TEXT` 角色的示例代码块缺少闭合围栏，译文已补全  

LED 面板可用于制作那些显示比赛名次和车手姓名、并不时闪烁的部件。

<a href="https://gfycat.com/colorfulfastivorybilledwoodpecker"><img src="https://thumbs.gfycat.com/ColorfulFastIvorybilledwoodpecker-size_restricted.gif" width="400" ></a>

与原版的 “digital_panels.ini” 不同，该选项在回放中也能工作（此外，它还支持[任何其他输入类型](https://github.com/car/instruments/inputs)）。但最主要的区别在于它使用动态纹理而非悬浮数字，因此能更好地贴合弯曲表面，也不需要为数字摆放设置专门的父级节点。

### 重要说明

在继续之前，我想先深入讲讲它的工作原理和用法。它的原理是动态纹理：背景透明，数字或字母使用指定的颜色。这意味着有两种实现方式：

- 可以复制底层网格，把新网格稍微移开一点，将动态纹理指定到它的 `txDiffuse` 槽位，设为自发光并将混合模式设为 alpha test。这是最简单的做法，但会增加一次绘制调用，需要修改模型，而且总体上显得相当凑合。不过还有另一种办法。

- 或者，可以使用 `ksPerPixelMultiMap_emissive` 着色器，并将动态纹理指定到 `txEmissive` 槽位！替换着色器不需要改动模型，一个简单的 `[SHADER_REPLACEMENT_...]` 调整就能很好地完成。这样就完全不用编辑任何模型了。你可能会疑惑：`txDiffuse` 叠加到最终自发光上、破坏 LED 的形状，这怎么行——好消息是，有一个参数可以禁用这种 `txDiffuse` 的干扰！

### 语法

```ini
[LED_PANEL_...]
MESHES = RSS_EXT_LED_Panel      ; 目标网格
TEXTURE_SLOT = txEmissive       ; 目标纹理槽位
RESOLUTION = 1024, 512          ; 新生成纹理的分辨率
MASKS_PACK = lumirank_font.zip  ; LED 蒙版包的名称
DIGIT_0 = 22, 47, 312, 455      ; 第一个数字的 X、Y、宽度和高度
DIGIT_1 = 353, 47, 312, 455     ; 第二个数字的 X、Y、宽度和高度
DIGIT_2 = 692, 47, 312, 455     ; 第三个数字的 X、Y、宽度和高度
                                ; 可以按需设置任意多个数字

BASE_COLOR = '#ffffff', 0.5    ; 基础颜色（未闪烁时）
FLASHING_COLOR = '#ffffff', 1  ; 闪烁时使用的颜色
FLASHING_APPLY_MASK = 1        ; 闪烁时是否应用蒙版

BLANCPAIN_FLASHING_PERIOD = 1       ; Blancpain 闪烁：周期，单位为秒
BLANCPAIN_FLASHING_DURATION = 0.2   ; 熄灭持续的时间，单位为秒
BLANCPAIN_FLASHING_RACE_CLASS = AM  ; 比赛组别（仅对该组别的领跑者闪烁）

N24_FLASHING_PERIOD = 3.5        ; N24 闪烁：周期，单位为秒
N24_FLASHING_TIME = 1.2          ; 闪烁持续的时间，单位为秒
N24_FLASHING_FREQUENCY = 6       ; 闪烁频率，单位为 Hz
N24_FLASHING_ACTIVE_SHARE = 0.7  ; 闪烁期间处于点亮阶段的时间占比

ROLE_0 = DRIVER_NAME  ; 第一个角色
ROLE_1 = POSITION     ; 第二个角色
                      ; 可以按需设置任意多个角色

ROLE_DURATION = 3     ; 每个角色持续的时间，单位为秒
```

### 关于 LED 蒙版与 `MASKS_PACK`

蒙版是黑白纹理，用白色区域标记需要发光的地方。它们与 `texture\display_panel` 中使用的纹理非常相似（只不过它们会被绘制到动态纹理上，而不是出现在 3D 空间中）。不过，由于现在还可以使用字母，它们多了一项额外的特性，以便在比赛期间节省磁盘空间和显存。你可以准备一张包含所有 LED 的高分辨率蒙版，然后为字母和数字制作分辨率低得多的蒙版，只需大致覆盖目标 LED 所在的区域即可。这能在不牺牲任何质量的情况下节省大量字节，甚至可能让蒙版的制作变得更简单。[这里有一个示例蒙版包](https://drive.google.com/uc?id=1q2o7dgODEJGCIlz9i_2YZdid3DDmbSgS)，来自 [RSS GT-M Bayro 6](https://racesimstudio.com/gtm-bayro-6)（感谢 Scott Shaw 允许将其用作示例）。

那么，换句话说，它的工作方式如下：

- 要渲染字母 “A”，CSP 会打开 `MASKS_PACK` 中指定的 ZIP 压缩包并查找 “base/a.dds”；
- 它还会查找 “mask.dds”；
- 若找到蒙版，则以正片叠底（multiply）模式渲染二者；
- 否则，只使用 “base/a.dds”。

闪烁阶段的做法类似：

- 要渲染字母 “A”，CSP 会查找 “flashing/a.dds”；
- 若该处不存在任何文件，则使用 “flashing_fallback.dds”；
- 若 `FLASHING_APPLY_MASK` 设为 1，则会像非闪烁阶段一样使用蒙版；
- 否则，直接使用纹理，如同蒙版不存在一般。

### 关于角色

目前有三种类型的角色：

- `DRIVER_NAME`：打印车手姓名（与名牌等处显示的相同），必要时缩写：

  ```ini
  ROLE_0 = DRIVER_NAME
  ```

- `TEXT`：打印在对应参数中设置的静态文本：

  ```ini
  ROLE_0 = TEXT
  ROLE_0_TEXT = HELLO WORLD
  ```

- 其他任何内容都会被当作[输入](https://github.com/car/instruments/inputs)处理，与 [CSP 数字仪表](https://github.com/car/instruments/digital-instruments)等类似：

  ```ini
  ROLE_0 = GAS
  ROLE_0_INPUT_MULT = 999
  ```

  注意，常规的 “INPUT_…” 参数在这里都带有对应的 “ROLE_N_” 前缀。除此之外，用法与平时完全一样，支持 LUT、延迟等。

  另一个重要细节：默认情况下，数字格式会带前导零，可以用下面这个来改变：

  ```ini
  ROLE_0_NUMBER_FORMAT = 3.0
  ```

### 关于 `ksPerPixelMultiMap_emissive` 与着色器替换

下面是用配置更换着色器并让其发光的一个示例：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = LED_Panel
SHADER = ksPerPixelMultiMap_emissive
FILL_MISSING_TEXTURES = 1
PROP_... = emSkipDiffuseMap, 1
PROP_... = ksEmissive, 100, 100, 100
```

有关这套机制的更多信息，请[看这里](https://github.com/general/shader-replacements)。

### 一些技巧

- 如果想让闪烁颜色更亮，只需降低基础颜色的亮度并提高自发光强度；
- 如果纹理槽位中原有旧纹理，数字会绘制在其上；
- 如果使用 `txEmissive` 方案，将分辨率设置得比 txDiffuse 的分辨率低一些也许是合理的，可以稍微节省显存和性能。

