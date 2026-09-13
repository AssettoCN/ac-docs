---
title: 多通道发光
---


> 汉化标题：车辆 – 多通道发光  
> 原文页面：Cars-–-Multichannel-emissives  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：mask 译作「蒙版」；mixin 译作「混入」（INIpp 机制，参数名中的 `@ = ...` 写法保留原文）  

这可能是一篇特别长的说明，抱歉。我不擅长写这类东西，所以会一步一步地解释，希望能多少有些帮助。

# 第一部分，这是什么？

首先，它是用来干什么的？最初，如果想为车灯、仪表板指示灯、刹车信号等制作发光网格，就得把每一块需要发光的部分做成单独的网格。在只有大灯、刹车灯和寥寥几个仪表板灯的时代这还说得过去，但现在有了 Custom Shaders Patch，还有转向灯、倒车灯、几十个新的仪表板指示灯等等。把所有这些网格都拆分开越来越无聊，而且渲染开销也大，因为每个新网格都是一次新的绘制调用。

多通道发光正是为此而生的。现在不必再拆分，单个网格最多可以拥有四个不同的发光区域，对称情况下最多可达七个（例如可以把尾灯、刹车灯、倒车灯和左右转向灯全部绑定到一个网格上）。而在仪表板网格这一特殊场景下，最多可达 25 个不同的区域，正好用来安放那些图标。

<img src="https://i.imgur.com/J06vRnH.jpg" width="240" />
<img src="https://i.imgur.com/NaoctH4.jpg" width="240" />
<img src="https://i.imgur.com/HRcDvEp.jpg" width="240" />
<img src="https://i.imgur.com/tEjn7lA.jpg" width="240" />

*这些灯全部无需拆分网格，仅凭简单的配置和这套多通道发光机制就设置完成了。*

# 第二部分，新的 `…_emissive` 着色器：

一切都始于这里：Stereo 提出了添加新着色器 `ksPerPixelMultiMap_emissive` 的想法，它类似 `ksPerPixelMultiMap`，但多了一个单独的 `txEmissive` 纹理槽位，用作发光颜色的彩色蒙版。原本，发光颜色是发光参数 `ksEmissive` 的颜色乘以给定点处的漫反射颜色。现在又多了一层来自 `txEmissive` 的额外颜色层，由此可以做出些妙东西，比如让建筑只有窗户发光而无需拆分网格。

# 第三部分，该着色器的新 `emChannelsMode` 参数：

这个新参数是整套多通道发光机制的核心。现在，着色器 `ksPerPixelMultiMap_emissive`（以及其他一些着色器）拥有了额外的 `ksEmissive1`、`ksEmissive2` 和 `ksEmissive3` 通道。默认情况下它们不会改变任何东西，但把 `emChannelsMode` 设为 1 之后：

- `txEmissive` 的红色通道将用作 `ksEmissive` 的蒙版；
- 绿色通道将用作 `ksEmissive1` 的蒙版；
- 蓝色通道将用作 `ksEmissive2` 的蒙版；
- Alpha 通道将用作 `ksEmissive3` 的蒙版。

所以，假设你正在制作一辆新车：不必再把网格拆成碎块，只需绘制一张自定义 `txEmissive`，把刹车灯蒙版画在红色通道、尾灯在绿色通道、倒车灯在蓝色通道、转向灯在 alpha 通道，就大功告成了！当然，你也可以把它画得模糊一些，给边界加上漂亮的衰减过渡。

### 如何使用

总体上有两种使用方式。

- 如果你在制作新车并为其创建新的 `txEmissive`，最简单的方法可能就是为 ksEditor（甚至原版 AC）安装这些新着色器。可以[在这里](https://github.com/ac-custom-shaders-patch/sdk-shaders)获取（点顶部的 `X releases` 链接下载）；
- 或者，也可以用配置以程序化方式定义区域。无需额外纹理，而且引入 `common/custom_emissive.ini` 模板能让这项工作轻松许多。不过我认为，如果是做新车，画一张小小的 `txEmissive` 纹理可能更容易、更灵活，效果也可能更好。

### 镜像

左右转向灯应当各自独立，可这些怎么塞进四个通道里呢？好在这些网格通常是对称的，所以我们可以这样：在纹理的 alpha 通道（供 `ksEmissive3` 使用）里把左右转向灯都画上，然后启用一个特殊参数 `emMirrorChannel3As4` 并设为 1。这样，着色器就会对位于车身右侧的那些网格部分改用 `ksEmissive4` 而不是 `ksEmissive3`。

不过还有一点要考虑：它判断「车身右侧」时可能出问题。它使用的是网格的相对坐标，所以如果你的网格对齐良好、X 轴朝向正确、枢轴位于正中，就不会有任何问题。否则就得调整镜像参数。这样的参数有两个：

- `emMirrorDir`：镜像的方向。设为 `(1, 0, 0)` 即默认的左右镜像。但同样，该方向是相对于网格朝向的（第一个值对应 X，第二个对应 Y，第三个对应 Z）；
- `emMirrorOffset`：镜像的偏移量。例如，那块带左右转向指示灯的仪表板部分，在这里可能需要一个像 0.5 这样的值，让镜像平面正好从两个指示灯之间穿过。

### 其他参数

- `emSkipDiffuseMap`：设为 1 可在计算发光颜色时不计入漫反射颜色。有了它，黑色表面也能发光！当然，`emChannelsMode` 为 0 时它也能用，此时颜色就由 `txEmissive` 决定。
- `emAlphaFromDiffuse`：默认情况下，着色器会像 `ksPerPixelNM` 那样从 `txNormal` 取 alpha。将该参数设为 1 后，改为从 `txDiffuse` 取 alpha。

### 在配置中使用这些通道

对赛道来说，正如你可能想象的那样，再直白不过了。只需在 `MATERIAL_ADJUSTMENT` 节里使用不同的变量名：

```ini
[MATERIAL_ADJUSTMENT_...]
MESHES = windows
CONDITION = WINDOWS_GLOW_1
KEY_0 = ksEmissive1
VALUE_0 = 10, 10, 5, 1

[MATERIAL_ADJUSTMENT_...]
MESHES = windows
CONDITION = WINDOWS_GLOW_2
KEY_0 = ksEmissive2
VALUE_0 = 10, 10, 5, 1

; 如果条件不同，各扇窗户会在不同时间点亮
```

车辆通常使用 `[EMISSIVE_...]` 节，这些节现在为此新增了一个参数：

```ini
[EMISSIVE_HIGHBEAM_...]
NAME = GEO_Frontlight_Inner_Glass
COLOR = 400, 330, 280, 0.2
CHANNEL = 1  ; ksEmissive 的默认值为 0；这里 1 用于 ksEmissive1
LAG = 0.8
LOCATION = FRONT
```

至于车辆上把灯光关联到发光物体的 `BOUND_TO` 值，可以像这样绑定到特定通道：

```ini
[LIGHT_EXTRA_...]
BOUND_TO = GEO_Frontlight_Inner_Glass:1
```

### 间奏

到此为止！如果你是在做自己的车，读到这里就可以停下了：只要画出带各通道蒙版的 `txEmissive` 并在 ksEditor 中设置好，一切就会正常工作。简单又轻松。

不过还有更多内容，这也是我把它分成几部分的原因——写给像我们这样不想画纹理、只想用几行配置搞定一切的人（比如我）。额外的好处还有：设置转向灯之类的东西会快得多，而且能用上那个单网格最多 25 个发光区域的特性。

# 第四部分，用于蒙版的 `custom_emissive.ini`：

有时候，画 `txEmissive` 并不真的合适，比如给已有的车做配置时。为此，着色器提供了一堆无需该纹理即可工作的选项，改用各种类型的区域作为蒙版。但为了运行更快，着色器期望这些选项以某种预先算好的形式传入，而手工预计算又太浪费。这正是 [INIpp](https://github.com/ac-custom-shaders-patch/inipp) 大显身手的地方——它带有一堆现成模板，能完成大部分工作。

要使用这些模板，先从包含它们的文件开始：

```ini
[INCLUDE: common/custom_emissive.ini]
```

*该文件对车辆和赛道均可用，不过接下来我主要以车辆为例进行描述。赛道是一样的，只是更简单。*

然后，就可以这样使用：

```ini
[CustomEmissive]
Meshes = turning_lights
Resolution = 1024, 1024
@ = CustomEmissive_Rect, Channel = 3, Mirror, Start = "10, 865", Size = "480, 165"
@ = TurningLightsFront, Channel = 3
```

这一个节就是为标致 504 设置前转向灯所需的全部（并不尽然，这里为举例做了简化），涵盖发光部分和光源两部分。下面逐行说明：

- `[CustomEmissive]`：这就是 INIpp 使用模板的方式。该节会自行展开为一个新的 `[SHADER_REPLACEMENT_...]` 节，替换着色器、填充缺失的纹理，并设置所有基本参数，例如将 `emMirrorDir` 设为默认值 `(1, 0, 0)`。

- `Meshes = turning_lights`：设置要替换着色器的网格列表。需要的话可以使用多个网格。这里有个技巧：可以为不同 LOD 中名称不同的网格设置：
  ```ini
  Meshes = '{ lod:A & turning_lights_lodA, lod:B & turning_lights_lodB }
  ```

- `Resolution = 1024, 1024`：纹理分辨率，单位为像素，宽和高。可选参数。若不设置，任何尺寸、坐标和大小都应以 0 到 1 的相对坐标表示。

- `@ = CustomEmissive_Rect, …`：默认情况下，`[CustomEmissive]` 什么都不会发光，就像 `txEmissive` 全黑一样。这一行为第三通道定义了一个新区域，起点为 (10, 865) 像素，尺寸为 480×165 像素。该区域还设置为镜像，因此其中位于车身右侧的一切实际上属于第四通道。

  如果你好奇这奇怪的语法：这就是 INIpp 中使用混入（mixin）的方式（`@` 是 `@MIXIN` 的简写）。混入只是一组附加到节里的额外值，可以声明一次，然后反复使用。这里的混入名为 “CustomEmissive_Rect”：打开 “custom_emissive.ini” 就能在其中找到它。

- `@ = TurningLightsFront, …`：这是转向灯相关的所有 `[EMISSIVE_...]` 和 `[LIGHT_...]` 的简写形式！这样写省去了大量时间。它会自动设置颜色、光源及其他一切。而 `Channel = 3` 告诉它将这些转向灯绑定到第三和第四通道（转向灯混入清楚自己只在带镜像的通道下才有意义，因此默认同时占用主通道和镜像通道）。这类行为在第 5 部分中有更详细的描述。

在深入之前，再补充两点：

- 你可以[在仓库中搜索现成的配置](https://github.com/ac-custom-shaders-patch/acc-extension-config/search?q=custom_emissive&unscoped_q=custom_emissive)，并把它们用作参考。当然，也欢迎把它们加载进 AC 里随便调调参数玩玩。

- 我建议使用比普通记事本更高级的工具来编辑配置。我个人目前最喜欢的是 [Visual Studio Code](https://code.visualstudio.com/)，免费且扩展丰富。安装[这个扩展](https://marketplace.visualstudio.com/items?itemName=acarreiro.calculate)并绑定到某个快捷键，就能直接对选中的文本进行计算，无需再复制到某个计算器里。虽然不常用，但真需要的时候能省不少时间。

### `[CustomEmissive]` 基本参数

- `Debug`（默认值为 0.0）：调高该值可为不同通道添加不同颜色的发光，便于分辨各自是什么；
- `MirrorDir`（默认值为 `(1, 0, 0)`）：设置镜像方向；
- `MirrorOffset`（默认值为 0.0）：设置镜像偏移；
- `CompatibleWithPBRGlass`（默认值为 0）：设为 1 可使整套机制与 `[Material_Glass]` 兼容；

### `[CustomEmissive]` 的实用混入

- `@ = CustomEmissive_SkipDiffuseMap`：跳过漫反射贴图，即将 `SkipDiffuseMap` 设为 1。

- `@ = CustomEmissive_UseDiffuseLuminocity`：特别实用的混入，可以把漫反射纹理不是当作颜色蒙版、而是当作黑白蒙版来应用，并采用另一套更接近阈值的逻辑。例如，它可以让亮度低于 10% 的纹理区域完全不发光。

  参数：
  - `SkipDiffuseMap`（默认值为 1）：为 1 时，禁用漫反射贴图的常规染色贡献；
  - `From`（默认值为 0.0）：最低漫反射亮度，低于该值的区域完全不发光，从 0 到 1；
  - `To`（默认值为 1.0）：最高亮度，高于该值的区域 100% 发光，从 0 到 1；
  - `Exponent`（默认值为 1.0）：调整 `From` 与 `To` 之间渐变方式的伽马值，从 0 到 ∞；
  - `Opacity`（默认值为 1.0）：该阶段的贡献度，为 0 时相当于混入不存在，从 0 到 1；
  - `Mask`（默认值为 `(1, 1, 1, 1)`）：影响哪些通道；

  需要的话，`From` 当然也可以大于 `To`，效果就如同漫反射纹理被反转。另外，`From`、`To`、`Exponent` 和 `Opacity` 可以不只使用一个数值，而是四个，为不同通道设置不同的参数。

  几乎到处都在用。帕加尼 Huayra 配置中用于仪表板指示灯的示例：
  
  ```ini
  @ = CustomEmissive_UseDiffuseLuminocity, Mask = "0, 1, 1, 1", Exponent = 4, From = 0.1, To = 0.3
  ```

- `@ = CustomEmissive_UseDiffuseAlpha`：与 `CustomEmissive_UseDiffuseLuminocity` 完全相同，只是改用漫反射的 alpha 而非亮度。

- `@ = CustomEmissive_MirrorUV`：镜像 UV，当对称线位于错误一侧时将其翻转过来（在某些非常棘手的情况下可能有用）。

  参数：
  - `Direction`（默认值为 `(1, 0)`）：镜像方向，与对称线正交；
  - `Offset`：偏移量，单位为像素或坐标，取决于是否设置了 `Resolution`。

  帕加尼 Huayra 配置中的用法：
  
  ```ini
  @ = CustomEmissive_MirrorUV, Offset = 612, Direction = "-1, 0" ; 这个技巧可以设置六个仪表板指示灯
  ```

- `@ = AlphaFromTxDiffuse`：将 `emAlphaFromDiffuse` 设为 1，改用 txDiffuse 的 alpha 通道。
  

### 程序化蒙版

蒙版有三种主要类型。每个通道都可以定义每种类型的一个区域。通道编号从 0 到 3，除 0 以外的所有通道都可以标记为镜像。

类型如下：

- 颜色蒙版。

  如果纹理允许，这类蒙版最容易使用。例如，大多数转向灯蒙版都可以这样设置：

  ```ini
  @ = CustomEmissive_Color, Channel = 3, Mirror, Color = "1, 0.5, 0"
  ```

  其中 `(1, 0.5, 0)` 当然表示橙色：100% 红、50% 绿、0% 蓝。可以想见，`Color` 参数是必需的。其他可用参数：

  - `ThresholdLevel`（默认值为 0.95）：该参数越高，纹理颜色就必须越接近该蒙版中设置的 `Color`。从 0 到 1。

  - `ThresholdSharpness`（默认值为 20.0）：调低使蒙版更平滑，调高使其更锐利。从 0 到 ∞，不过我认为合理值大概在 1 到 50 之间。

  - `Threshold`：`ThresholdLevel` 和 `ThresholdSharpness` 二者的简单别名，接受两个值，第一个是 `ThresholdLevel`。

  - `Normalization`（默认值为 1.0）：该值为 1 时不考虑亮度，只比较色相和饱和度。为 0 时则相反，颜色必须完全匹配——色相、饱和度和亮度全都一致。也可以设为介于两者之间的值。对转向灯来说这很好用——橙色有时会偏暗，但它仍是转向灯的橙色——而对倒车灯之类最好调低该值，这样就只有白色能匹配，深灰色的区域不会误中。

    下面是标致 504 倒车灯用它设置的示例：

    ```ini
    @ = CustomEmissive_Color, Channel = 0, Color = "1, 1, 1", Normalization = 0.5, Threshold = "0.8, 1"
    ```

  - `Opacity`：该值从 0 到 1，调整生成区域的强度乘数。

  此外，`[CustomEmissive]` 还有全局参数 `ColorInputBlur`（默认值为 0.0），用于在将漫反射纹理送入颜色蒙版之前对其加以模糊。它不会影响其他任何东西。

- 可带圆角和模糊边缘的矩形区域。

  Custom Shaders Patch 在 AC 中新增了一个名为 Object Inspector 的 App。在其纹理选项卡中，纹理列表右侧有一些小复选框。点选一个即可查看纹理，然后用鼠标框选，快速高亮出一块区域。这是获取坐标和尺寸最简单的办法。或者，也可以用 Photoshop 或 [XnView（免费看图软件）](https://www.xnview.com/en/xnviewmp/)之类的工具获取坐标。还有一些别的情况，当 UV 展开实在糟糕时，直接对半分、再对半分地试出合适的坐标反而更容易，找不到区域就换到另一半试试。这个技巧能大大加快定位速度。

  **请注意：** 如果使用像素坐标，请设置 `Resolution`。如果使用 0…1 坐标，则不要设置 `Resolution`。也可以把 `Resolution` 作为 `CustomEmissive_Rect` 的参数来用，以限定其作用范围。

  下面是 Abarth 595 的后转向灯：

  ```ini
  @ = CustomEmissive_Rect, Channel = 1, Mirror, Start = "0, 264", Size = "206, 142", CornerRadius = "0.25, 0.5"
  ```

  `Start` 和 `Size` 是必需的，不过可以用 `Center` 代替 `Start` 来指定中心点的坐标而非左上角（这样调整尺寸更容易）。其他可用参数：

  - `CornerRadius`（默认值为 0.0）：一个或两个参数，若为两个，第一个用于水平部分，第二个用于垂直部分。设为 1.0 时矩形会变成圆形。如果矩形的尺寸是 `(400, 100)` 这样的，为了让圆角保持正圆而不被拉伸，水平方向的值要小上四倍，例如 `CornerRadius = "0.1, 0.4"`。该值还可用于设置模糊边缘：在这里获得模糊边缘的唯一途径就是使用圆角。

  - `Exponent`（默认值为 1.0）：调整模糊边缘和圆角锐利程度/模糊程度的简单方法。从 0 到 ∞，合理值大概在 0.1 到 10 之间。值越小，边缘越锐利。

  - `Opacity`：该值从 0 到 1，调整生成区域的强度乘数。

  另有一些预定义了参数的别名：

  - `CustomEmissive_Area`：完全相同的东西，为向后兼容而保留；
  - `CustomEmissive_Circle`：圆形，相同，但默认值为 `CornerRadius = 1` 和 `Exponent = 0.1`，`Exponent` 可重新定义；
  - `CustomEmissive_CoverAll`：覆盖整个纹理的区域，用于某些特殊情况。

- 由四个角点定义的四边形区域。

  与矩形区域类似，可以借助 Object Inspector 快速设置：按住 Ctrl 点击四次即可标记出一块区域。关于分辨率的说明在这里同样适用。

  这类区域的计算开销更高，所以我认为最好是在别无他法时再使用。

  下面是标致 504 的后转向灯：

  ```ini
  @ = CustomEmissive_Poly, Channel = 3, P1 = "390, 500", P2 = "350, 840", P3 = "-20, 840", P4 = "-20, 500", Exponent = 3, Sharpness = 50
  ```

  四个点 `P1`…`P4` 全都是必需的。其他可用参数：

  - `Sharpness`（默认值为 1000.0）：边缘的锐利程度，从 0 到 ∞。

  - `Exponent`（默认值为 1.0）：调整非锐利边缘渐变的简单方法。从 0 到 ∞，合理值大概在 0.1 到 10 之间。值越小，边缘越锐利。

  - `Offset`（默认值为 0.0）：让区域略微扩大（或收缩），可用于添加圆角。不过要让圆角正常生效，需要先把尺寸缩小。从 -1.0 到 1.0。

  - `Opacity`：该值从 0 到 1，调整生成区域的强度乘数。

### 附加顶点蒙版

对于一些更加烧脑的情况，还有第四种选择：顶点蒙版。偶尔可能会遇到特别难缠、没有唯一 UV 映射的网格。这种网格实在没什么好办法，但借助 `CustomEmissive_VertexMask`，可以定义最多四个点，每个通道一个。其工作方式是：着色器会找到当前这块网格距离最近的点，并在那里使用对应的通道。在此之前，你还需要在上面配合使用 `StartWithWhite = 1` 或 `@ = CustomEmissive_CoverAll` 之类来覆盖两个通道，让它先覆盖所有内容，再由 `CustomEmissive_VertexMask` 加以限制。如果某个通道的点没有在 `CustomEmissive_VertexMask` 参数中定义，该通道将不受影响。以下是 2015 款 Mustang 后转向灯的示例：

```ini
@ = CustomEmissive_VertexMask, Point2 = "0.52, 0, 0", Point3 = "0.8, 0, 0"
```

点以网格坐标设置，我发现最快的办法就是直接试猜这些值。

### 蒙版的逐步应用流程及其修改方式

不就是画张纹理嘛，搞出这么多名堂，呵。而且还没完：不同类型的蒙版能以不同的方式组合。为了便于想象，请记住整套东西是按以下步骤计算的：

- 首先，着色器取基础值，默认为 0：什么都不发光。

  - 可以用 `StartWithWhite = 1` 将其改为 1：这样所有东西都发光。

- 然后，计算那些矩形区域。默认情况下它们会被累加到结果中，也就是说 `StartWithWhite = 1` 会让颜色蒙版失效。

  - 添加 `AreasSubtractive = 1`，它就会改为从基础值中减去区域。我用这个技巧处理过 BMW E30 的表盘，做出那种向中心渐渐消散的漂亮光晕：其实就是四个模糊的圆圈，再用该选项反转：

    <a href="https://i.imgur.com/I6QzTGZ.jpg" target="_blank"><img src="https://i.imgur.com/I6QzTGZ.jpg" width="240" /></a>
    <a href="https://i.imgur.com/K978ZQK.jpg" target="_blank"><img src="https://i.imgur.com/K978ZQK.jpg" width="240" /></a>

- 之后，计算颜色蒙版。同样，默认是累加。

  - 添加 `ColorMasksSubtractive = 1` 可将颜色蒙版改为相减；
  - 或者添加 `ColorMasksAsMultiplier = 1`，颜色蒙版将作为乘数应用——这一招我常用：先用矩形区域定出大形，再在上面叠颜色蒙版，让颜色不那么死板：

    <a href="https://i.imgur.com/eqGnTaT.jpg" target="_blank"><img src="https://i.imgur.com/eqGnTaT.jpg" width="240" /></a>
    <a href="https://i.imgur.com/LJIP2gk.jpg" target="_blank"><img src="https://i.imgur.com/LJIP2gk.jpg" width="240" /></a>

- 下一步，计算四边形蒙版。与此类似。

  - 添加 `PolysSubtractive = 1` 改为相减；
  - 或添加 `PolysMasksAsMultiplier = 1` 让其作为乘数。这一部分就是这么设置的，它同时用到了颜色、矩形和四边形蒙版，因为这些灯不属于常见的「倒车灯就是纹理上的一块区域」那种类型（左侧为原版 AC 的效果）：

    <a href="https://i.imgur.com/FpMZ4uc.jpg" target="_blank"><img src="https://i.imgur.com/FpMZ4uc.jpg" width="240" /></a>
    <a href="https://i.imgur.com/J06vRnH.jpg" target="_blank"><img src="https://i.imgur.com/J06vRnH.jpg" width="240" /></a>

- 再之后是顶点蒙版。它们默认为乘法模式，也有其他选项可用：

  - 添加 `VertexMaskAdditive = 1` 设为累加模式；
  - 或添加 `VertexMaskSubtractive = 1` 设为相减模式；

- 最后一步，应用基于漫反射亮度或 alpha 的蒙版，由 `@ = CustomEmissive_UseDiffuseLuminocity` 或 `@ = CustomEmissive_UseDiffuseAlpha` 设置。

### 蒙版的重叠与否

还有一点：蒙版之间的相互作用方式也可以修改。默认情况下，所有蒙版各自独立生效，也就是说它们可以重叠，同一块区域既可以充当转向灯、又可以充当倒车灯。不过在有些特殊场景下，能改变这一行为会很方便，相关设置如下：

- `AreasSubtractNext = 1`；
- `ColorSubtractNext = 1`；
- `PolySubtractNext = 1`。

它们的作用与名字基本一致：例如设置了 `AreasSubtractNext = 1` 后，第二通道矩形蒙版所覆盖的区域将不再受第一通道矩形蒙版的影响，哪怕后者覆盖了整张纹理。例如，我在标致 504 的后转向灯上就用了这个：

```ini
[CustomEmissive]
PolySubtractNext = 1
@ = CustomEmissive_Poly, Channel = 0, P1 = "0, 0", P2 = "1024, 0", P3 = "1024, 1024", P4 = "0, 1024" ; 覆盖全部的倒车灯
@ = CustomEmissive_Poly, Channel = 1, P1 = "133, -10", P2 = "178, 328", P3 = "600, 328", P4 = "600, -10" ; 转向灯所在区域除外
```

### 将矩形区域用作整体蒙版

你见过那个 E30 仪表板了吧？就是[几段之前](https://i.imgur.com/I6QzTGZ.jpg)那个带柔和圆形背光的？按上面的方式其实是行不通的：那些区域若设为相减模式，只会从特定通道中减去。嗯，还有一个选项可以改变这一点：`UseAreasAsMask = 1`。设置之后，矩形区域将作为一个简单的蒙版作用于整个发光体。还有一个混入能让它用起来更省事：`@ = CustomEmissive_AreaMask`。用它时甚至不需要设置通道，最多使用四次即可为整个发光体造型，而且它会自动设置 `StartWithWhite` 和 `UseAreasAsMask`。下面就是 E30 的实际配置：

```ini
[CustomEmissive]
Meshes = INT_DIALS_SUB0
AreasSubtractive = 1
@ = CustomEmissive_AreaMask, Center = "0.723, 0.273", Size = 0.55, CornerRadius = 1, Exponent = 0.3
@ = CustomEmissive_AreaMask, Center = "0.275, 0.6", Size = 0.55, CornerRadius = 1, Exponent = 0.3
@ = CustomEmissive_AreaMask, Center = "0.116, 0.117", Size = 0.23, CornerRadius = 1, Exponent = 0.3
@ = CustomEmissive_AreaMask, Center = "0.361, 0.117", Size = 0.23, CornerRadius = 1, Exponent = 0.3
```

为了不开图像编辑器、不画一张简单的纹理，我居然愿意走到这一步……😅

# 第五部分，用于行为定义的 `custom_emissive.ini`：

首先想说的是：我真正希望看到更多是标准化。让各家保持相似——这里指的是诸如转向灯光源的参数，或倒车灯发光强度之类的东西。如果你觉得它们看起来不对，请告诉我，我们一起讨论并修改 Custom Shaders Patch 所使用的默认设置。又或者，可能是你的后期处理滤镜泛光不足（比如 Sol 滤镜）——我想这种情况时有发生，而若没有标准化，你可能会不小心把发光调得过亮。

这正是 `custom_emissive.ini` 在这方面发挥作用的地方。它基本上提供了一堆让这些设置更轻松的快捷方式，并带有现成的数值。当然你仍然可以调整，包括强度在内，但我希望你能考虑尽量保持默认。

所有行为都以混入的形式定义。可以将其附加到 `[CustomEmissive]`，也可以不附加，这一点稍后再谈。它们都有这些参数，而且正如前面所说，我希望其中大部分你都不需要改动：

- `Color`：发光颜色，最亮值外部灯约 25、内部灯约 20；
- `Channel`（默认值为 0）：行为附加到的通道；
- `Intensity`（默认值为 1.0）：亮度乘数；
- `Lag`：平滑地开启和关闭；
- `Location`：用于损坏计算的灯光位置，几乎在所有情况下都能被正确猜出；

对于能投射光源的行为，例如转向灯、倒车灯或开门照明灯：
- `NotCastingLight`（默认值为 0）：设为 1 用于不应投射光源的发光体（主要针对诸如车前还有第二组转向灯之类的情况）；
- `Direction`：光照方向，三个数值构成一个矢量；
- `Offset`：光源猜测位置的偏移量，单位为米；

### 转向灯

作为最棘手的一类，设置方式有好几种：

- `@ = TurningLightsFront`：前转向灯；
- `@ = TurningLightsFrontCorner`：位于边角、更多向侧方照射的前转向灯；
- `@ = TurningLightsRear`：后转向灯；
- `@ = TurningLightsRearCorner`：位于边角、更多向侧方照射的后转向灯；
- `@ = TurningLightsRearCombined`：前后转向灯全部合在单个网格时使用（不推荐，因为损坏计算无法正常工作；大多数情况下反正还是能用不同通道拆分开）；
- `@ = TurningLightsRearCornerCombined`：位于边角、更多向侧方照射的前后转向灯；
- `@ = DashTurningLights`：转向灯的仪表板指示灯，当然不投射光源。

转向灯还有一些特殊参数：

- `ChannelAlt`：右侧使用的通道，默认从 `Channel` 推断，但也可手动设置；
- `AnimatedDoors`：用于车门后视镜上的转向灯，在此填入左右车门的名称；
- `HeadlightsIntensity`：转向灯关闭但大灯开启时的发光强度；
- `BrakingLightsIntensity`：转向灯关闭但刹车灯点亮时的发光强度。

### 其他灯光

- `@ = Headlights`；
- `@ = ParkingLights`：大灯开启时点亮的、位于尾部的那几颗；
- `@ = BrakingLights`；
- `@ = ReverseLights`；
- `@ = FogLights`：绑定到 Extra A 按钮的前灯；
- `@ = OpenDoorLight`：车门打开时的照明灯；
- `@ = LicensePlateLights`：不产生任何光源，用于车牌旁边的那些发光部分（车牌照明本来就是单独工作的）；

更多类型和选项将很快加入。

### 仪表板灯

所有仪表板灯混入都基于 `@ = DashIndicator` 混入，参数如下：

- `Input`：来自[该列表](https://github.com/car/instruments/inputs)的输入；
- `InputThreshold`：若输入为数值，此为指示灯点亮的阈值；
- `InputInverse`：设为 1 反转阈值逻辑；
- `InputSelector`：`INPUT_SELECTOR` 的别名；
- `OffColor`：指示灯熄灭时的颜色；
- `Invert`：交换点亮与熄灭状态；
- `DashHighlight`：对处于非激活状态的指示灯使用 `DashHighlightColor`（在主 `[INCLUDE]` 中作为参数定义），但灯光仍然点亮。

使用方法如下：

```ini
[CustomEmissive]
Meshes = polymsh118_SUB17
Resolution = 1024, 512
@ = CustomEmissive_Circle, Channel = 2, Mirror, Center = "811, 446.5", Size = 30, Exponent = 0.3
@ = DashIndicator, Input = HANDBRAKE, Channel = 2
```

默认情况下，颜色会根据输入自动猜出。其他用于加速设置的仪表板灯混入：

- `@ = DashHighlight`：简单的仪表板高亮；
- `@ = DashWarningABS`：ABS 已停用的警告灯；
- `@ = DashWarningTC`：牵引力控制已停用的警告灯；
- `@ = DashWarningCollision`：车辆受损的警告灯；
- `@ = DashWarningAirbag`：安全气囊已弹出的警告灯（由重大碰撞触发）；
- `@ = DashWarningEngine`：发动机受损的警告灯；
- `@ = DashWarningTemperature`：温度警告灯；
- `@ = DashWarningTyrePressure`：胎压警告灯（用 `Pressure` 参数设置阈值，默认为 20）；
- `@ = DashWarningSeatbelt`：安全带警告灯（由车门打开且驾驶员不可见触发）；
- `@ = DashInteriorLight`：车内照明指示灯（由车门打开触发）；
- `@ = DashEmissiveDisplay`：无论何时都常亮；
- `@ = DashFogLights`：雾灯指示灯，由 Extra A 按钮触发；
- `@ = DashWarningSteering`：转向受损警告灯，目前不起任何作用，未来会更改。

# 第六部分，用 `custom_emissive.ini` 在单个网格中实现 25 个仪表板指示灯：

`[CustomEmissive]` 的替代方案：`[CustomEmissiveMulti]`。它使用另一款着色器，选项更少。在所有功能中，它只有矩形区域——但足有 25 个！对仪表板来说非常好用。

下面是一个使用示例：

```ini
[CustomEmissiveMulti]
Meshes = LIGHT_DASH         ; 目标网格
Resolution = 1024, 512      ; 坐标所基于的纹理分辨率
UseEmissive0AsFallback = 1  ; 将 ksEmissive（即发光通道 #0）用于其他区域未覆盖处的发光
@ = DashHighlight           ; 将仪表板高亮绑定到发光通道 #0
@ = MultiItem, Role = TURNSIGNAL_LEFT, Center = "508, 246", Size = 30
@ = MultiItem, Role = TURNSIGNAL_RIGHT, Center = "1004, 246", Size = 30
@ = MultiItem, Role = LIGHT, Center = "504, 279", Size = 30
@ = MultiItem, Role = HIGHBEAM, Center = "508, 310", Size = 30
@ = MultiItem, Role = HANDBRAKE, Center = "1002, 313", Size = 30
@ = MultiItem, Role = ABS_INACTION, Center = "1006, 281", Size = 30
@ = MultiItem, Role = STALLED, Center = "582, 97", Size = 30
@ = MultiItem, Role = DashWarningABS, Center = "983, 377", Size = 30
@ = MultiItem, Role = DashWarningSeatbelt, Center = "559, 120", Size = 30
@ = MultiItem, Role = DashWarningTemperature, Center = "997, 208", Size = 30
@ = MultiItem, Role = DashWarningEngine, Center = "970, 150", Size = 32
@ = MultiItem, Role = DashWarningCollision, Center = "524, 178", Size = 32
```

注意，现在不必先定义区域、再为其附加行为，一切都在一行内完成。另外注意 `Role`：它既可以是[该列表](https://github.com/car/instruments/inputs)中的输入，也可以是第 5 部分中的某个仪表板灯混入。

此外，也无需自己追踪发光通道：「MultiItem」混入会自动计数并设置好一切。这样的「MultiItem」混入最多可使用 24 个，然后如有需要，可以为通道 #0 设置形状，而不使用 `UseEmissive0AsFallback`。

再次提醒，可以用 Object Inspector 快速查到这些区域的坐标，能省下大量时间。

### 其他选项

- `UseEmissive0AsFallback`（默认为 0）：设为 1 时，将其他条目未触及的所有区域用作通道 #0 的蒙版；或设为 `COVER_ALL`，让通道 #0 影响所有内容；
- `SkipEmissiveMap`（默认为 1）：完全跳过发光贴图；
- `Debug`：用不同颜色高亮不同的区域。

最后一条提示：`@ = CustomEmissive_UseDiffuseLuminocity` 和 `@ = CustomEmissive_UseDiffuseAlpha` 在这里同样可用，但与 `[CustomEmissive]`（最多可为不同通道使用四个值）不同，这里最多只能用两个值。第一个值应用于供指示灯使用的那 24 个通道，第二个值应用于通道 #0（通常用作背光）。例如，下面是 Abarth 500 的仪表板：

```ini
[CustomEmissiveMulti]
Meshes = LIGHT_DASH
UseEmissive0AsFallback = 1
Resolution = 1024, 512
@ = CustomEmissive_UseDiffuseLuminocity, From = "0.0, 0.2", To = "0.1, 0.3", SkipDiffuseMap = 0
@ = DashHighlight
@ = MultiItem, Role = TURNSIGNAL_LEFT, Center = "508, 246", Size = 30
@ = MultiItem, Role = TURNSIGNAL_RIGHT, Center = "1004, 246", Size = 30
@ = MultiItem, Role = LIGHT, Center = "504, 279", Size = 30
@ = MultiItem, Role = HIGHBEAM, Center = "508, 310", Size = 30
@ = MultiItem, Role = HANDBRAKE, Center = "1002, 313", Size = 30
@ = MultiItem, Role = ABS_INACTION, Center = "1006, 281", Size = 30
@ = MultiItem, Role = STALLED, Center = "582, 97", Size = 30
@ = MultiItem, Role = DashWarningABS, Center = "983, 377", Size = 30
@ = MultiItem, Role = DashWarningSeatbelt, Center = "559, 120", Size = 30
@ = MultiItem, Role = DashWarningTemperature, Center = "997, 208", Size = 30
@ = MultiItem, Role = DashWarningEngine, Center = "970, 150", Size = 32
@ = MultiItem, Role = DashWarningCollision, Center = "524, 178", Size = 32
```

之前有个问题：纹理上有些指示灯并没有被用到（有些我不知道含义，有些暂不支持），它们会莫名其妙地凭空发光，很烦人。通过给仪表板高亮设置 0.2/0.3 的阈值，我让它们在熄灭状态下不再自己发光：

  <a href="https://i.imgur.com/Gi7wOIa.png" target="_blank"><img src="https://i.imgur.com/Gi7wOIa.png" width="240" /></a>
  <a href="https://i.imgur.com/kNvWvbI.png" target="_blank"><img src="https://i.imgur.com/kNvWvbI.png" width="240" /></a>

### 结语

如果你一路读到了这里，我既惊讶又佩服；如果没有，我也完全理解。考虑到我的英语写作有多糟糕（写这篇东西至少花了我四个小时），我希望其中至少有 1/3 能讲清楚……如果你对如何改写让它更易懂有任何建议，请告诉我。

