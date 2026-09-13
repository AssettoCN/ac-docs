---
title: 灯光
---


> 汉化标题：赛道 – 灯光  
> 原文页面：Tracks-–-Lights  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

为赛道添加光源有两种方式：直接指定带位置和方向的 `[LIGHT_...]` 来创建单个光源，或者使用 `[LIGHT_SERIES_...]` 基于几何体自动生成一批光源（例如为每根灯柱生成一个）。

### 单个光源的语法

设置单个光源有三种方式。第一种是使用位置和方向（你可以用 Object Inspector 快速获取位置，只需在任意位置点击并复制坐标）：

```ini
[LIGHT_...]
POSITION = X, Y, Z
```

第二种方式是使用网格，并可选地指定以米为单位的偏移。网格会被拆分成若干组，最大的一组将作为光源的位置：

```ini
[LIGHT_...]
MESH = mesh_name
OFFSET = X, Y, Z  ; 可选偏移，单位米
```

第三种方式是设置线性光（line light）。它需要起点和终点。此外还可以设置两种颜色以形成渐变：

```ini
[LIGHT_...]
LINE_FROM = X, Y, Z
LINE_TO = X, Y, Z 
COLOR_FROM = '#ff0000', 2
COLOR_TO = '#00ff00', 3
```

需要说明的是，这些线性光（尤其是多色的）与真实面光源（area light）的行为关系不大，请合理设置。

三种方式的默认方向都是向下：

```ini
DIRECTION = 0, -1, 0
```

### 光源序列的语法

使用光源序列时，光源可以从网格生成，也可以一次性列出一组位置。下面是后一种方式。在此示例中，所有光源都将指向下方：

```ini
[LIGHT_SERIES_...]
POSITION_0 = X, Y, Z
POSITION_1 = X, Y, Z
POSITION_2 = X, Y, Z
; 以此类推
```

下面是带自定义方向的版本：

```ini
[LIGHT_SERIES_...]
POSITION_0 = X, Y, Z
DIRECTION_0 = 1, 0, 0
POSITION_1 = X, Y, Z
DIRECTION_1 = 1, 0, 0
POSITION_2 = X, Y, Z
DIRECTION_2 = 1, 0, 0
; 以此类推
```

要从网格生成光源，列出网格名称或材质即可。所有网格会被拆分成若干组，每组都会创建一个光源。这里同样支持可选偏移。和往常一样，此示例中所有光源都指向下方：

```ini
[LIGHT_SERIES_...]
MESHES = lamppost?, glowing_window?
MATERIALS = glowing_material?  ; 或者，你也可以使用 "MESHES = material:glowing_material?"
OFFSET = X, Y, Z  ; 可选偏移，单位米
```

另外，照常可以用 `DIRECTION` 设置自定义值。不过，`[LIGHT_SERIES_...]` 与网格的组合还有一种替代方案：让光源沿着所关联网格块法线之和的方向指向：

```ini
DIRECTION = NORMAL
```

例如，假设你有一批泛光灯，用一个包含所有明亮发光区域（也就是一些平面方块）的单一网格来表示。使用 `DIRECTION = NORMAL`，从该网格生成的所有光源都会自动与每个方块朝向的方向对齐。Brands Hatch 的那些泛光灯就是这样设置的：

<a href="https://i.imgur.com/21aE7zP.jpg"><img src="https://i.imgur.com/21aE7zP.jpg" width="400" ></a>

还有两个参数可以微调这种对齐（以下为默认值）：

```ini
DIRECTION_ALTER = 0, 0, 1
DIRECTION_OFFSET = 0, -0.4, 0
```

`DIRECTION_OFFSET` 的值会直接加到最终方向上，使其略微偏斜。`DIRECTION_ALTER` 则相当于对整体重新定向：`DIRECTION_ALTER = 0, 0, -1` 会让光源旋转 180° 反向工作；`DIRECTION_ALTER = 1, 0, 0` 会让光源沿垂直轴转 90°；`DIRECTION_ALTER = 0, 1, 0` 则沿水平轴转 90°。

### 光源序列与普通光源通用的语法及默认值

```ini
[LIGHT_..., LIGHT_SERIES_...]
ACTIVE = 1
DESCRIPTION = my light

; 形状
SPOT = 120  ; 线性光默认为 0
SPOT_SHARPNESS = 0.3
RANGE = 40
RANGE_GRADIENT_OFFSET = 0.2

; 光源
COLOR = 1, 1, 1, 40
SPECULAR_MULT = 0
SINGLE_FREQUENCY = 0
DIFFUSE_CONCENTRATION = 0.88
CONDITION = NightLights
CONDITION_OFFSET =  ; 默认不设置

; 光源随距离淡出（出于性能原因）
FADE_AT = 400
FADE_SMOOTH = 50

; 额外选项
VOLUMETRIC_LIGHT = 0
LONG_SPECULAR = 0
SKIP_LIGHT_MAP = 0
DISABLE_WITH_BOUNCED_LIGHT = 0

; 阴影：
SHADOWS =  ; 默认不设置
SHADOWS_STATIC =
SHADOWS_HALF_RESOLUTION =
SHADOWS_SPOT =
SHADOWS_RANGE =
SHADOWS_DIR = 
SHADOWS_OFFSET =
SHADOWS_BOOST =
SHADOWS_CLIP_PLANE = 0.5
SHADOWS_CLIP_SPHERE = 0.5
SHADOWS_EXP_FACTOR = 20
SHADOWS_EXTRA_BLUR =
```

- 主要参数：
  - `ACTIVE`：设为 0 可禁用光源；
  - `DESCRIPTION`：光源名称，调试模式下随光源轮廓一同显示；
- 形状：
  - `SPOT`：聚光角度，点光源设为 0；
  - `SPOT_SHARPNESS`：聚光边缘的锐利程度，为 0 时最亮点在中心，为 1 时直到边缘都保持 100% 亮度；
  - `RANGE`：光源的照射距离，单位米；
  - `RANGE_GRADIENT_OFFSET`：光在传播途中开始衰减的位置（为了观感更好，建议保持较低值并转而提高光的亮度）；
- 光源：
  - `COLOR`：光的颜色（格式详见下文）；
  - `SPECULAR_MULT`：镜面反射强度；
  - `SINGLE_FREQUENCY`：普通光源设为 0，[钠灯](https://www.youtube.com/watch?v=O7mEBpJVJbA)之类的可设为 1；
  - `DIFFUSE_CONCENTRATION`：为 1 时，与光源方向垂直的表面会处于阴影中；为 0 时，即使背向光源的表面也会被完全照亮；
  - `CONDITION`：控制亮度和颜色的[条件](https://github.com/track/conditions)名称；
  - `CONDITION_OFFSET`：设置后会偏移条件的闪烁；
- 光源随距离淡出（出于性能原因）：
  - `FADE_AT`：光衰减到 50% 强度时的距离，单位米；
  - `FADE_SMOOTH`：光衰减所跨越的距离（增大可使衰减更平滑）；
- 额外选项：
  - `VOLUMETRIC_LIGHT`：设为 1 启用体积光效果（但请注意，开销相当大）；
  - `LONG_SPECULAR`：设为 1 可在 Rain FX 下启用长镜面高光以呈现湿润外观（需要 SSLR；请注意它不会使用动态阴影贴图，所以不要用于带阴影的光源）；
  - `SKIP_LIGHT_MAP`：设为 1 可让该光源不再参与 Extra FX 的反射光；
  - `DISABLE_WITH_BOUNCED_LIGHT`：如果你有一个光源是用来模拟光反弹的，可以用此选项确保在 Extra FX 的反射光激活时将其禁用；
- 阴影：
  - `SHADOWS`：是否启用阴影（默认情况下，任何照射赛道且范围超过 15 米的非线性光都会自动启用阴影）；
  - `SHADOWS_STATIC`：设为 1 可将阴影标记为静态（快得多）；
  - `SHADOWS_HALF_RESOLUTION`：设为 1 可使用降低分辨率的阴影，观感更平滑、性能更好；
  - `SHADOWS_SPOT`：可选，覆盖阴影的聚光角度；
  - `SHADOWS_RANGE`：可选，覆盖阴影范围；
  - `SHADOWS_DIR`：可选，覆盖阴影方向；
  - `SHADOWS_OFFSET`：可选的阴影原点偏移（小心使用，非低值会破坏阴影）；
  - `SHADOWS_BOOST`：阴影强度增益，未设置时自动计算；
  - `SHADOWS_CLIP_PLANE`：近处阴影裁剪平面（例如，光源位于灯泡内部时，你不会希望它把其他一切都挡住）；
  - `SHADOWS_CLIP_SPHERE`：同上，但用球体代替平面；
  - `SHADOWS_EXP_FACTOR`：阴影的指数因子；
  - `SHADOWS_EXTRA_BLUR `：设为 1 可为阴影应用额外模糊。

### 关于分组

带网格的 `[LIGHT_...]` 和带网格的 `[LIGHT_SERIES_...]` 都会将其网格拆分成组。基本原理很简单：从零个组开始，对每个顶点寻找最近的组。若距离小于某个阈值，就把它加入该组；否则创建一个新组。该阈值距离可以这样控制：

```ini
CLUSTER_THRESHOLD = 10  ; 距离，单位米
```

最小值为 1 米。请留意实际创建了多少光源：阈值过低可能生成过多光源，而每个光源都需要渲染时间。

还有一个选项，可以基于 UV 过滤参与计算的顶点：

```ini
UV_FILTER_0 = 0.2, 0.1, 0.4, 0.2
UV_FILTER_1 = 0.8, 0.81, 0.1, 0.1
```

前两个值定义区域左上角的坐标，后两个值定义区域的大小。只有位于该区域内的顶点才会被纳入。

### Light Maker

有一个名为 Light Maker 的小应用可以帮助你设置单个光源。它最初是为了展示[反射光能力](https://youtu.be/R9gsC5vB1Eg?t=44)而添加的，但对一般的灯光设置也很有用。你可以把生成的光源复制到剪贴板再粘贴到配置中，也可以从配置中复制光源并粘贴到 Light Maker（只需聚焦它的窗口并按 Ctrl+V）。

稍后我会添加一个更高级的编辑器。

### 关于性能

性能的关键在于：光源数量本身不是问题，主要问题来自屏幕上有多少像素被多少光源影响。10 个各自只影响屏幕面积几个百分点的光源，好过一个影响整个屏幕的光源。而且这里说的「影响」不只是「照亮」——请想想[一个包围光源、按世界坐标对齐的盒子](https://www.shadertoy.com/view/WdjSRK)：该盒子内的所有像素都会被这个光源影响。因此，请让光源保持较小的范围，尤其要避免大角度与长距离的组合，它们会让那个盒子迅速膨胀。

其他几点建议：

- 线性光中开销较大的部分是其镜面分量，将其设为 0 可以加快速度；
- 别忘了 `FADE_AT` 和 `FADE_SMOOTH`：即使远处光源影响的像素不多，计算它们并提交给着色器仍可能浪费时间；
- 体积光和长镜面高光开销很大；
- 阴影不仅开销大，数量也有限，因此最好在可能的地方禁用阴影，或将其改为静态和低分辨率。

### 关于阴影

阴影只适用于角度小于 180° 的聚光灯。如果光源角度大于 180°，你可以用 `SHADOWS_SPOT` 覆盖，只为阴影设置一个较小的角度来获得阴影，不过这只适用于少数情况，即 `SHADOWS_SPOT` 范围之外本就不需要阴影的场合。下面是一个这样的光源示例：

<a href="https://i.imgur.com/xIqgbwj.png"><img src="https://i.imgur.com/xIqgbwj.png" width="400" ></a>

另一点是，聚光灯位置越高，阴影质量越低：

<a href="https://gfycat.com/excellentwarmheartedarawana"><img src="https://thumbs.gfycat.com/ExcellentWarmheartedArawana-size_restricted.gif" width="400" ></a>

Custom Shaders Patch 使用的动态阴影采用指数阴影贴图（exponential shadow maps）方法以获得更好的过滤效果。该技术只需一次纹理采样即可获得平滑阴影，能以低廉代价通过 MSAA 提高阴影分辨率，并能更好地处理大角度光源（[与常见 PCF 方法的对比](https://youtu.be/zw67CyByt38?t=45)），但它也有一些缺陷，最主要的是光会向外泄露一段距离。为了抵消这一点，我们可以增大指数因子，但这会导致阴影失去平滑感，整体观感变差：

<a href="https://gfycat.com/HugePeskyEthiopianwolf"><img src="https://thumbs.gfycat.com/HugePeskyEthiopianwolf-size_restricted.gif" width="400" ></a>

所以，一如既往，这都是权衡取舍，要找到观感可以接受的中间点。  

请记住，高分辨率阴影只有 15 个槽位，低分辨率阴影有 16 个槽位，因此不妨将一些光源设为低分辨率阴影，以确保有空闲槽位。如果带阴影的光源太多，只有最靠近摄像机的那些才能获得阴影。

### 关于移动光源

你可以让光源跟随[动画对象](https://github.com/track/animated-objects)移动：

```ini
[LIGHT_...]
RELATIVE_TO = name of a moving node
```

请避免为持续移动的光源启用阴影，否则 Custom Shaders Patch 将不得不每帧重建它们的赛道阴影贴图，这是一项开销很大的操作。对于普通光源，这项工作只需进行一次。

