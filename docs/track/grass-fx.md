---
title: 草地 FX
---


> 汉化标题：赛道 – 草地 FX  
> 原文页面：Tracks-–-Grass-FX  
> 原文锚点：1043006  
> 汉化时间：2026-09-12T00:00:00+08:00  

Grass FX 会用摄像机周围程序化生成的草替换原始 AC 草地，密度更高，并带有形变等其他一些特性。为使其正常工作，需要列出应当生成草的网格。

### 生成语法

对于任意 `…_MATERIALS`，也存在对应的 `…MESHES`，例如 `GRASS_MESHES`；两者可以同时使用。

```ini
[GRASS_FX]
; 生成区域
GRASS_MATERIALS =            ; 在其上生成草的材质列表
GRASS_MESHES =               ; 网格同理
OCCLUDING_MATERIALS =        ; 遮挡材质列表：例如道路网格覆盖在草地网格上方时，把道路材质加在这里可防止草从道路中透出
OCCLUDING_MESHES =           ; 网格同理
OCCLUDING_MATERIALS_ALPHA =  ; 平滑遮挡材质列表：设想一块草地，上面覆着一小块沙地，要让草的显示平滑淡出，把沙地材质加在这里可使过渡更自然
OCCLUDING_MESHES_ALPHA =     ; 网格同理
ORIGINAL_GRASS_MATERIALS =   ; 原始草地材质列表，Grass FX 激活时将其隐藏
; 注意：如果想保留原始 3D 草（使用 ksGrass 着色器），请在上面使用
; "=" 后面不带名称的空行！！！
```

默认情况下，只有表面颜色合适时才会生成草。它期望的是偏绿的颜色，不要太亮，也不要太暗。如有需要，你可以重新调整。提高阈值会让草更加成斑块、更不均匀，降低阈值则让各种颜色的草都能生成。

```ini
[GRASS_FX]
; 生成遮罩设置
MASK_MAIN_THRESHOLD = 0.5  ; 表面应有多「绿」（并非真实饱和度，可以大于 1）
MASK_RED_THRESHOLD = 0.05  ; 设得足够高时，会把目标颜色从绿色偏向黄色和红色
MASK_MIN_LUMINANCE = 0.02  ; 生成草所需的最小亮度
MASK_MAX_LUMINANCE = 0.35  ; 最大亮度
```

下面是一个让草在任何地方都能生成的设置示例：

```ini
[GRASS_FX]
MASK_MAIN_THRESHOLD = -1
MASK_RED_THRESHOLD = 0
MASK_MIN_LUMINANCE = -1
MASK_MAX_LUMINANCE = 1
```

### 形状设置与修剪

基本的形状设置使用起来很简单：

```ini
[GRASS_FX]
SHAPE_SIZE = 1.0   ; 总体尺寸
SHAPE_TIDY = 0.0   ; 草的整齐程度（不整齐的草更不均匀、更倾斜）
SHAPE_CUT = 0.0    ; 草的修剪程度
SHAPE_WIDTH = 1.0  ; 草的宽度相对其高度的比例
```

尺寸值越高，密度越低。默认值 1.0 相当于相当低矮的赛道草。

要让草随时间变化，可以设置修剪周期并使用成对的数值。第一个值是修剪周期开始时的取值，第二个值是周期结束时的取值。修剪周期既可以是一周中进行修剪的那一天，也可以是以天为单位的时长（可带偏移）。

下面是一个示例，草被修剪，然后逐渐变得不整齐：

```ini
[GRASS_FX]
TRIM_PERIOD = THURSDAY  ; 草会在每个星期四被修剪
SHAPE_SIZE = 0.5, 1.0   ; 星期四为 0.5，星期三为 1
SHAPE_CUT = 1.0, 0.5    ; 星期四修剪得很短，随后修剪程度降低
SHAPE_TIDY = 1.0, 0.5   ; 星期四非常整齐
```

或者，另一个例子，草在一年中逐渐生长：

```ini
[GRASS_FX]
TRIM_PERIOD = 365
SHAPE_SIZE = 4, 8
SHAPE_TIDY = 0
```

此外，其中的每个 `SHAPE_…` 数值也可以换成一个赛道条件（track condition），因此你可以把草的高度绑定到一天中的时间之类的参数上。不过更合理的例子可能是用某个自定义 LUT 把它绑定到年度进度上。

### 局部调整

要改变草在不同区域的外观，你可以定义最多四个额外配置，然后把这些配置分配给不同的网格。如果你想知道为什么只有四个：这样一来，四个配置可以完美映射到局部调整纹理（四个通道）上，以便更优化地处理，同时也允许手工绘制调整贴图。另一种做法是把参数分配给通道，但那样要么需要至少三张巨型纹理，要么就只能有四个参数。

草地配置拥有与 `[GRASS_FX]` 相同的参数：形状和颜色遮罩。以下是我在 Brands Hatch 上设置草地的方式：

```ini
; 配置 A：每周修剪的整齐草
[GRASS_FX_CONFIGURATION_A]
TRIM_PERIOD = THURSDAY ; 草会在每个星期四被修剪
SHAPE_SIZE = 0.5, 1
SHAPE_CUT = 1, 0.5
SHAPE_TIDY = 1, 0.5

; 配置 B：观众踩踏的草
[GRASS_FX_CONFIGURATION_B]
MASK_MAIN_THRESHOLD = 1.1 ; 阈值更高意味着草生成得更稀疏、呈斑块状
SHAPE_SIZE = 2
SHAPE_TIDY = 0

; 配置 C：野草
[GRASS_FX_CONFIGURATION_C]
MASK_MAIN_THRESHOLD = 0.3 ; 阈值略低，让草长得更多
TRIM_PERIOD = 365 ; 草在一年中缓慢生长
SHAPE_SIZE = 4, 8
SHAPE_TIDY = 0

; 目前最多只能到 D 配置
[GRASS_FX_CONFIGURATION_D]
...
```

然后，可以这样把它们分配给不同的网格：

```ini
[GRASS_FX_ADJUSTMENT_...]
MATERIALS =  ; 应用该配置的材质列表
MESHES =     ; 应用该配置的网格列表
MAP = A, 1   ; 配置名称及其强度。强度为 0 时使用基本 [GRASS_FX] 配置，介于两者之间的值会对数值进行混合

; 调整也可以同时使用多个配置，并采用自定义混合
MAP = 0.8, 0.5, 0.2, 0.0  ; 80% 的配置 A，然后 50% 的 B，再 20% 的 C
```

利用自定义混合值还有一种玩法：如果出于某种原因你需要 10 种不同的草高，只需创建一个草非常高的配置，然后对一个网格应用它的 10%，对另一个网格应用 20%，以此类推。

调整效果会根据此参数进行模糊：

```ini
[GRASS_FX]
MASK_BLUR = 1  ; 有效值为 0 到 3，0 表示禁用模糊
```

`GRASS_FX_ADJUSTMENT` 小节还可以拥有最多 8 个圆形或椭圆形的局部区域，用于在更局部的范围内微调草地，或创建渐变。请使用 Grass FX 调试应用查看调整效果，它对完成设置帮助极大。

```ini
[GRASS_FX_ADJUSTMENT_...]
MESHES = …
MAP = A ; 权重未设置时默认为 1

EXTRA_0 = B, 0.5          ; 规则与调整的 MAP 值相同
EXTRA_0_CENTER = X, Z     ; X 和 Z 是世界坐标（单位米）；也可以写 X、Y 和 Z，此时 Y 会被跳过
EXTRA_0_RANGE = FROM, TO  ; FROM 和 TO 是距离，单位米；FROM 为内圈（强度最高）半径，TO 为外圈（完全没有强度）半径。如果 FROM 大于 TO，区域会反转，覆盖该圆以外的一切
EXTRA_0_ASPECT_RATIO = 1  ; 从 1 改起，可把圆变成椭圆
EXTRA_0_ANGLE = 0         ; 旋转椭圆的角度（度）
EXTRA_0_OPACITY = 1       ; 局部区域的不透明度
```

更简单的用法是包含 “common/grass_fx.ini” 并使用其中的 `GrassFX_ExtraArea` mixin。主要优点是：不必操心索引（“_0” 部分），而且范围不再使用 FROM 和 TO，该 mixin 提供了一个好用的 Fade 变量。下面是来自 Brands Hatch 的示例，我用它把观众席下和停车场周围的草从野草切换为被踩踏的草：

```ini
[INCLUDE: common/grass_fx.ini] ; 用于 GrassFX_ExtraArea mixin

[GRASS_FX_ADJUSTMENT_...]
MATERIALS = grass_ext
MAP = C, 0.5 ; 一半野草

; 踩踏草区域，每个 GRASS_FX_ADJUSTMENT 小节最多 8 个
@ = GrassFX_ExtraArea, Map = B, Center = "-350, 0, -300", Range = 140, Fade = 20, Aspect = 3.5, Angle = 40 ; 发车位置旁的观众和停车区
@ = GrassFX_ExtraArea, Map = B, Center = "-459.04, 4.57, -192.12", Range = 30, Fade = 10 ; 直升机周围
@ = GrassFX_ExtraArea, Map = B, Center = "-76.31, 12.47, -441.7", Range = 100, Fade = 20, Aspect = 2.5, Angle = 20 ; 主看台
@ = GrassFX_ExtraArea, Map = B, Center = "-171.61, 1.86, -461.88", Range = 60, Fade = 20, Aspect = 2, Angle = 20 ; 后方停车场
```

`GRASS_FX_ADJUSTMENT` 也可以不带任何网格使用，绘制由中心、尺寸和角度（度）定义的矩形，像这样：

```ini
[GRASS_FX_ADJUSTMENT_...]
CENTER = X, Y, Z  ; 或只写 X 和 Z，世界坐标，单位米
SIZE = X, Y, Z    ; 或只写 X 和 Z，单位米
ANGLE = 0
MAP = A
```

例如，把它的 `MAP` 设为全零之类，再用额外区域覆盖它，也是合理的用法。或者，你也可以为它附加一张自定义调整纹理：

```ini
[GRASS_FX_ADJUSTMENT_...]
CENTER = X, Y, Z
SIZE = X, Y, Z
ANGLE = 0
TEXTURE = texture_name.dds  ; 位于配置文件旁
TEXTURE_OFFSET = 0, 0       ; 纹理偏移，以 UV 坐标表示
TEXTURE_SCALE = 1, 1        ; 纹理缩放
```

红色通道决定配置 A 的占比，绿色通道决定配置 B 的占比，依此类推。

### 多层局部调整（新）

对于带 txMask 纹理的多层着色器，你可以把不同的 Grass FX 调整绑定到该遮罩的不同通道上，像这样：

```ini
[GRASS_FX_ADJUSTMENT_...]
MATERIALS = grass, top2
USE_MULTILAYER_MASK = 1 ; 使用多层遮罩进行调整
MASK_R = A, 3  ; 红色通道对应更野的草
MASK_G = -10   ; 为绿色通道强制使用基础配置
MASK_B = B, 3  ; 蓝色通道对应最野的草
MASK_A = C     ; alpha 通道对应稀疏的草
```

这段配置取自 [Silverstone](https://github.com/ac-custom-shaders-patch/acc-extension-config/blob/master/config/tracks/ks_silverstone.ini#L1345)。简而言之，不再使用单一的 `MASK` 值，你可以为遮罩全黑的区域设置 `MASK_BASE`，为红色通道设置 `MASK_R`，依此类推。

哦，另外还有一个 `USE_MULTIMAP_DETAIL_MASK` 选项，可以改为绑定到 txDiffuse 的 alpha 通道，供 ksMultiMap… 着色器使用。取值也相同，不过我认为你只会用到 `MASK_BASE` 和 `MASK_A`。

### 自定义纹理

Grass FX 为整条赛道使用一张纹理图集。其工作方式是：纹理被划分成网格，默认大小为 16 列 1 行。生成时，第一行用于常规的、随处生成的基础草。你可以用[这个工具](https://github.com/ac-custom-shaders-patch/ac-grass-gen)生成它的纹理。其余行可以映射到其他不同的草片段。

![img](https://i.imgur.com/vFkd1m8.png)

如你所见，一个草片段可以占用不止一个单元格。下面是配置加载新纹理的方法：

```ini
[GRASS_FX]
TEXTURE =  grass_fx/highlands.dds  ; 位于配置文件旁；若未找到，补丁会到自己的纹理文件夹中查找
TEXTURE_GRID = 8, 3      ; 列数和行数
```

注意有些草叶是亮绿色的。这就是纹理让 CSP 使用表面颜色的方式：把红色和蓝色通道设为黑色，草就会采用表面颜色，并把绿色通道用作亮度/AO 值。如果你不想让草的颜色取自表面，只需使用普通颜色，而不是亮绿色。另外，请确保颜色通道不会在完全透明处中断：把 alpha 分离到单独的通道，切换到 RGB 通道并确保颜色延续下去，否则 MIP 层会出问题。

加载自定义纹理后，你可以定义最多四个自定义纹理组。每组最多可包含八个自定义草片段，而前面提到的 A/B/C/D 草地配置以及基础 `[GRASS_FX]` 配置，都可以为不同的草组设置各自的生成几率。

下面是一个组的示例：

```ini
[GRASS_FX_TEXTURE_GROUP_0]
; 列索引从 1 开始，但行索引从 0 开始！
PIECE_0 = 1, 1 ; 第一个片段从 (1, 1) 处的单元格开始，就是那株带一朵黄花的

PIECE_1 = 2, 1 ; 第二个片段，同样只占一个单元格

PIECE_2 = 1, 2, 2, 1 ; 第三个片段，带黄花和白花，占 2×1 格
PIECE_2_CHANCE = 0.1 ; 出现几率比前两个片段低 10 倍

PIECE_3 = 3, 1, 1, 2 ; 占 1×2 格的片段，就是带紫花的那株
PIECE_3_CHANCE = 0.01 ; 出现几率低 100 倍
PIECE_3_SIZE_MULT = 1.2, 2 ; 默认尺寸乘数基于所占单元格数得出，此处为覆盖
PIECE_3_WIND = 0.5 ; 受风影响更小（默认值为 1）
```

要把纹理组分配给某个配置，使用以下写法：

```ini
[GRASS_FX_CONFIGURATION_A]
TEXTURE_BASE_CHANCE = 1       ; 常规草的生成几率
TEXTURE_GROUP_0_CHANCE = 0.2  ; 第一个组的生成几率
TEXTURE_GROUP_1_CHANCE = 0.1  ; 第二个组的生成几率

; 然后这样使用：
[GRASS_FX_ADJUSTMENT_...]
MATERIALS = grass, top2
MAP=A
```

重要提示：自定义类型的草只影响第三次生成过程及之后，因此用户在近处仍会看到大量常规草。这样一来，一些复杂的高草或灌木就不会在几米开外消失。

### 关于半透明草

默认情况下，Grass FX 的程序化草不会渲染到 G-buffer 中，从而将耗时几乎减半。在大多数草低矮、表面哑光的赛道上这完全没问题，但在一些草较高、或草后方是反射表面（如水面）的赛道上，草会显得有瑕疵且透明。要修复此问题，请使用：

```ini
[EXTRA_FX]
FORCE_GRASSFX_GBUFFER_PASS = 1
```

Extra FX 设置中也有一个选项，可为所有赛道启用该渲染通道。

