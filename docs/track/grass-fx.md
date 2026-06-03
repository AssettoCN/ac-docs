---
title: 草地效果（Grass FX）
---

# 草地效果（Grass FX）

Grass FX 替换了 AC 原始草地，使用围绕摄像机程序化生成的高密度草地，并附带形变等其他功能。要使其正常工作，需要列出应该生成草地的网格。

## 生成语法

对于任何 `…_MATERIALS`，也有对应的 `…_MESHES`（如 `GRASS_MESHES`），两者可以同时使用。

```ini
[GRASS_FX]
; 生成区域
GRASS_MATERIALS =            ; 在其上方生成草地的材质列表
GRASS_MESHES =               ; 同上，网格版
OCCLUDING_MATERIALS =        ; 遮挡材质列表：例如覆盖草地网格的道路网格，将道路材质添加到此处可阻止草地从路面穿出
OCCLUDING_MESHES =           ; 同上，网格版
OCCLUDING_MATERIALS_ALPHA =  ; 平滑遮挡材质列表：想象一块草地和一块沙地叠加，平滑过渡显示草地，将沙地材质添加到此处使过渡更自然
OCCLUDING_MESHES_ALPHA =     ; 同上，网格版
ORIGINAL_GRASS_MATERIALS =   ; 隐藏原始草地材质列表（当 Grass FX 激活时隐藏原始草地）
; 注意：如果要保留原始 3D 草地（使用 ksGrass 着色器），请在上方使用空行，即 "=" 后不加任何名称！
```

默认情况下，草地仅在表面颜色合适时生成。它期望偏绿色、不太亮也不太暗的颜色。如果需要，可以重新调整。提高阈值使草地更稀疏、更不均匀；降低阈值使各种颜色的草地都能生成。

```ini
[GRASS_FX]
; 生成遮罩设置
MASK_MAIN_THRESHOLD = 0.5  ; 表面饱和度（绿色程度，不是真正的饱和度，可以大于 1）
MASK_RED_THRESHOLD = 0.05  ; 将目标颜色从绿色偏移到黄色和红色，设置足够高时
MASK_MIN_LUMINANCE = 0.02  ; 生成草地的最小亮度
MASK_MAX_LUMINANCE = 0.35  ; 生成草地的最大亮度
```

以下是在所有地方生成草地的设置示例：

```ini
[GRASS_FX]
MASK_MAIN_THRESHOLD = -1
MASK_RED_THRESHOLD = 0
MASK_MIN_LUMINANCE = -1
MASK_MAX_LUMINANCE = 1
```

## 形状设置和修剪

基本形状设置简单易用：

```ini
[GRASS_FX]
SHAPE_SIZE = 1.0   ; 总体大小
SHAPE_TIDY = 0.0   ; 草地整洁度（不整洁的草地不均匀、倾斜更多）
SHAPE_CUT = 0.0    ; 草地修剪程度
SHAPE_WIDTH = 1.0  ; 草地宽度相对于高度的比例
```

较高的 SIZE 值会降低密度。默认值 1.0 对应相当矮的赛道草地。

要使草地随时间变化，可以设置修剪周期和双值。第一个值是修剪周期开始时的值，第二个值是结束时的值。修剪周期可以是星期几（在那天修剪），或以天为单位的持续时间（可选偏移量）。

示例——草地被修剪后逐渐变乱：

```ini
[GRASS_FX]
TRIM_PERIOD = THURSDAY  ; 每周四修剪草地
SHAPE_SIZE = 0.5, 1.0   ; 周四为 0.5，周三为 1
SHAPE_CUT = 1.0, 0.5    ; 周四修剪得很短，然后逐渐变长
SHAPE_TIDY = 1.0, 0.5   ; 周四很整洁
```

另一个示例——草地全年逐渐生长：

```ini
[GRASS_FX]
TRIM_PERIOD = 365
SHAPE_SIZE = 4, 8
SHAPE_TIDY = 0
```

此外，每个 `SHAPE_…` 的数值都可以使用赛道条件（Condition）代替，因此可以将草地高度绑定到一天中的时间等。更合理的例子可能是使用自定义 LUT 将其绑定到年度进度。

## 局部调整

要改变不同区域草地的外观，可以定义最多四个额外配置，然后将这些配置分配给不同的网格。如果你好奇为什么只有四个——这样四个配置可以完美映射到局部调整纹理（四个通道），以便更优化的处理。这也允许你手工绘制调整贴图。另一种方法是将参数分配给通道，但这要么需要至少三个大型纹理，要么我们只有四个参数。

草地配置与 `[GRASS_FX]` 具有相同的参数：形状和颜色遮罩。以下是 Brands Hatch 的草地设置示例：

```ini
; 配置 A：整洁的每周修剪草地
[GRASS_FX_CONFIGURATION_A]
TRIM_PERIOD = THURSDAY ; 每周四修剪草地
SHAPE_SIZE = 0.5, 1
SHAPE_CUT = 1, 0.5
SHAPE_TIDY = 1, 0.5

; 配置 B：观众区被踩踏的草地
[GRASS_FX_CONFIGURATION_B]
MASK_MAIN_THRESHOLD = 1.1 ; 较高的阈值意味着草地会更稀疏地生成，呈斑块状
SHAPE_SIZE = 2
SHAPE_TIDY = 0

; 配置 C：野生草地
[GRASS_FX_CONFIGURATION_C]
MASK_MAIN_THRESHOLD = 0.3 ; 稍低的阈值让草地生长更茂盛
TRIM_PERIOD = 365 ; 草地全年缓慢生长
SHAPE_SIZE = 4, 8
SHAPE_TIDY = 0

; 目前最多支持到 D 配置
[GRASS_FX_CONFIGURATION_D]
...
```

然后，可以这样将其分配给不同的网格：

```ini
[GRASS_FX_ADJUSTMENT_...]
MATERIALS =  ; 使用此配置的材质列表
MESHES =     ; 使用此配置的网格列表
MAP = A, 1   ; 配置名称及其强度。强度为 0 时使用基本 [GRASS_FX] 配置。中间值会混合数值

; 调整也可以同时使用多个配置，自定义混合
MAP = 0.8, 0.5, 0.2, 0.0  ; 80% 的配置 A，50% 的 B，20% 的 C
```

使用自定义混合值还有另一种可能：如果由于某种原因需要 10 种不同的草地高度，只需创建一个非常高草地的配置，然后将 10% 分配给一个网格，20% 分配给另一个，以此类推。

调整将根据此参数进行模糊处理：

```ini
[GRASS_FX]
MASK_BLUR = 1  ; 值范围 0 到 3，0 禁用模糊
```

`GRASS_FX_ADJUSTMENT` 部分还可以包含最多 8 个圆形或椭圆形的局部区域，允许在更局部的区域内微调草地或创建渐变。使用 Grass FX 调试应用查看调整贴图，对设置非常有帮助。

```ini
[GRASS_FX_ADJUSTMENT_...]
MESHES = …
MAP = A ; 如果未设置，权重默认为 1

EXTRA_0 = B, 0.5          ; 与调整的 MAP 值规则相同
EXTRA_0_CENTER = X, Z     ; X 和 Z 是世界坐标（米）；也可以使用 X, Y 和 Z，此时 Y 会被跳过
EXTRA_0_RANGE = FROM, TO  ; FROM 和 TO 是距离（米）；FROM 是内圈（最强烈）半径，TO 是外圈（无强度）半径。如果 FROM 大于 TO，区域将被反转，覆盖该圆之外的所有区域
EXTRA_0_ASPECT_RATIO = 1  ; 从 1 更改以将圆变为椭圆
EXTRA_0_ANGLE = 0         ; 旋转椭圆的角度（度）
EXTRA_0_OPACITY = 1       ; 局部区域的不透明度
```

更简单的使用方法是包含 "common/grass_fx.ini" 并使用其中的 `GrassFX_ExtraArea` 混入。主要优势：无需担心索引（"_0" 部分），而且不是使用 FROM 和 TO 作为范围，该混入提供了一个友好的 Fade 变量。以下是来自 Brands Hatch 的示例，用于在观众区和停车场周围将草地从野生切换为踩踏状态：

```ini
[INCLUDE: common/grass_fx.ini] ; 用于 GrassFX_ExtraArea 混入

[GRASS_FX_ADJUSTMENT_...]
MATERIALS = grass_ext
MAP = C, 0.5 ; 一半野生草地

; 踩踏草地区域，每个 GRASS_FX_ADJUSTMENT 部分最多 8 个
@ = GrassFX_ExtraArea, Map = B, Center = "-350, 0, -300", Range = 140, Fade = 20, Aspect = 3.5, Angle = 40 ; 起跑位置旁的观众和停车场
@ = GrassFX_ExtraArea, Map = B, Center = "-459.04, 4.57, -192.12", Range = 30, Fade = 10 ; 直升机周围
@ = GrassFX_ExtraArea, Map = B, Center = "-76.31, 12.47, -441.7", Range = 100, Fade = 20, Aspect = 2.5, Angle = 20 ; 主观众看台
@ = GrassFX_ExtraArea, Map = B, Center = "-171.61, 1.86, -461.88", Range = 60, Fade = 20, Aspect = 2, Angle = 20 ; 后方停车场
```

你也可以在没有网格的情况下使用 `GRASS_FX_ADJUSTMENT`，通过中心、大小和角度（度）定义矩形：

```ini
[GRASS_FX_ADJUSTMENT_...]
CENTER = X, Y, Z  ; 或仅 X 和 Z，世界坐标（米）
SIZE = X, Y, Z    ; 或仅 X 和 Z，单位米
ANGLE = 0
MAP = A
```

有意义的是将其 `MAP` 设置为全零，然后用额外区域覆盖。或者，你可以附加自定义调整纹理：

```ini
[GRASS_FX_ADJUSTMENT_...]
CENTER = X, Y, Z
SIZE = X, Y, Z
ANGLE = 0
TEXTURE = texture_name.dds  ; 位于配置文件旁边
TEXTURE_OFFSET = 0, 0       ; UV 坐标中的纹理偏移
TEXTURE_SCALE = 1, 1        ; 纹理缩放
```

红色通道设置 A 配置的份额，绿色设置 B 配置的份额，依此类推。

## 多层局部调整（新增）

对于具有 txMask 纹理的多层着色器，可以将不同的 Grass FX 调整绑定到该遮罩的不同通道：

```ini
[GRASS_FX_ADJUSTMENT_...]
MATERIALS = grass, top2
USE_MULTILAYER_MASK = 1 ; 使用多层遮罩进行调整
MASK_R = A, 3  ; 红色通道用于更野生的草地
MASK_G = -10   ; 强制绿色通道使用基本配置
MASK_B = B, 3  ; 蓝色通道用于最野生的草地
MASK_A = C     ; Alpha 通道用于稀疏草地
```

此代码取自 [Silverstone](https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/master/config/tracks/ks_silverstone.ini#L1345) 配置。简而言之，不是使用单个 `MASK` 值，而是可以为完全黑色的区域设置 `MASK_BASE`，为红色通道设置 `MASK_R`，依此类推。

此外，还有 `USE_MULTIMAP_DETAIL_MASK` 选项，将其绑定到 ksMultiMap… 着色器的 txDiffuse alpha 通道。值也相同，但可能只需要 `MASK_BASE` 和 `MASK_A`。

## 自定义纹理

Grass FX 使用单个纹理图集（texture atlas）用于整个赛道。其工作方式是将纹理分成网格，默认大小：16 列 1 行。然后在生成时，第一行用于常规基本的全区域生成草地。可以使用[此工具](https://github.com/ac-custom-shaders-patch/ac-grass-gen)生成纹理。其他行可以映射到其他不同的草地碎片。

![草地纹理图集](https://i.imgur.com/vFkd1m8.png)

如你所见，一个草地碎片可以占据多个单元格。以下是配置加载新纹理的方式：

```ini
[GRASS_FX]
TEXTURE =  grass_fx/highlands.dds  ; 位于配置文件旁边；如果在那里找不到，CSP 会在其纹理文件夹中查找
TEXTURE_GRID = 8, 3      ; 列数和行数
```

注意有些草地叶片是亮绿色的。这是你的纹理请求 CSP 使用表面颜色的方式：将红色和蓝色通道设为黑色，CSP 将使用表面颜色和绿色通道作为亮度/AO 值。如果你不希望草地从表面获取颜色，只需使用常规颜色而非亮绿色。此外，确保颜色通道在全透明处不会中断：将 alpha 分离到自己的通道，切换到 RGB 通道并确保颜色延续，否则 MIP 层会出问题。

加载自定义纹理后，可以定义最多四个自定义纹理组。每个组最多可包含八个自定义草地碎片，前面提到的 A/B/C/D 草地配置以及基本 `[GRASS_FX]` 配置都可以为不同草地组设置自己的生成概率。

以下是纹理组示例：

```ini
[GRASS_FX_TEXTURE_GROUP_0]
; 列索引从 1 开始，行索引从 0 开始！
PIECE_0 = 1, 1 ; 第一个碎片从单元格 (1, 1) 开始，带有一朵黄花

PIECE_1 = 2, 1 ; 第二个碎片，也占据单个单元格

PIECE_2 = 1, 2, 2, 1 ; 第三个碎片，带黄花和白花，占据 2×1 个槽位
PIECE_2_CHANCE = 0.1 ; 出现频率比前两个碎片低 10 倍

PIECE_3 = 3, 1, 1, 2 ; 占据 1×2 个槽位的碎片，带紫色花朵
PIECE_3_CHANCE = 0.01 ; 出现频率低 100 倍
PIECE_3_SIZE_MULT = 1.2, 2 ; 默认大小乘数基于单元格大小，此处覆盖
PIECE_3_WIND = 0.5 ; 受风影响较小（默认值为 1）
```

将纹理组分配给配置：

```ini
[GRASS_FX_CONFIGURATION_A]
TEXTURE_BASE_CHANCE = 1       ; 常规草地生成概率
TEXTURE_GROUP_0_CHANCE = 0.2  ; 第一组生成概率
TEXTURE_GROUP_1_CHANCE = 0.1  ; 第二组生成概率

; 使用方式：
[GRASS_FX_ADJUSTMENT_...]
MATERIALS = grass, top2
MAP=A
```

重要提示：自定义草地类型仅影响第三生成阶段及以后，因此用户仍然会在近处看到大量常规草地。这样，一些复杂的高草或灌木不会在几米外就消失。

## 关于半透明草地

默认情况下，Grass FX 的程序化草地不会渲染到 G-buffer 中，从而将渲染时间几乎减半。在大多数具有矮草地和哑光表面的赛道上，这完全没问题，但在一些具有高草或后面有反射表面（如水面）的赛道上，草地看起来会有故障或透明。要修复此问题：

```ini
[EXTRA_FX]
FORCE_GRASSFX_GBUFFER_PASS = 1
```

在 Extra FX 设置中也有一个选项可以为所有赛道启用该通道。

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Grass-FX) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
