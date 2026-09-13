---
title: 8. 材质与 AC 编辑器
---

# 8. 材质与 AC 编辑器

在以下章节中，你将找到关于如何使用 AC 编辑器的信息，以及设置材质的指南。

## 材质命名规范

请在你的 3D 软件中使用以下约定为材质命名。首先，务必标明材质用于内饰还是外饰（INT_ 或 EXT_），然后标明一个直观的名称（通常表明它所使用的纹理），最后标明它是否需要使用某种透明属性，例如 AT 表示 alpha test。尽可能使用以下名称：

| 名称 | 说明 |
| --- | --- |
| EXT_Tyre | |
| EXT_Rim | |
| EXT_Rim_blur | |
| EXT_Rim_blur_Alpha | 透明的模糊轮圈件（使用 alpha blend 模式并开启 transparency） |
| EXT_Carpaint | |
| EXT_Carbon | |
| EXT_Details_AT | 用于标签和 logo（使用 alpha test 模式并关闭 transparency） |
| EXT_Details_Plastic | Details=使用外饰细节纹理 |
| EXT_Details_Metal | |
| EXT_Details_Chrome | |
| EXT_Engine | |
| EXT_Disc | |
| EXT_Caliper | |
| EXT_Window | |
| EXT_Lights_Glass | |
| EXT_Lights_Chrome | |
| INT_Details_AT | 用于标签和 logo（alpha test 模式并关闭 transparency） |
| INT_Details_Plastic | Details=使用内饰细节纹理 |
| INT_Details_Chrome | |
| INT_Details_Metal_Black | |
| INT_Details_Metal_Flat | |
| INT_Details_Gauges | |
| INT_OCC_Carbon | OCC=使用环境光遮蔽（ambient occlusion）纹理 |
| INT_OCC_Leather | |
| INT_OCC_Alcantara | |
| INT_OCC_Plastic | |
| INT_OCC_Metal | |
| INT_BELT | |
| INT_LCD | 务必将数字显示屏保留在单独的纹理上（针对赛车） |
| INT_FUEL_INDICATOR | 用于燃油警告灯的自发光（emissive）材质 |

如有需要，你可以使用多个材质（用于多种碳纤维花纹），这种情况下，请用数字或名称加以区分（例如 INT_OCC_Carbon_Flat 和 INT_OCC_Carbon_Refl）。无论如何，请尽量区分外饰与内饰材质。
注意：关于使用编辑器的更全面指南和社区技巧，请参阅官方支持论坛的以下帖子：
http://www.assettocorsa.net/forum/index.php?threads/ac-editor.10964/
注意：要查找有用信息并就编辑器和着色器相关的常规问题寻求帮助，请参阅官方支持论坛的以下帖子：
http://www.assettocorsa.net/forum/index.php?threads/car-materials-shaders-modelling-stuff-add-your-knowledge-here.19704/
KS EDITOR 基础指南：
首次打开编辑器时，请确保保存布局并在 Utilities/Data Editor 下设置你的偏好。

![p067_X0](/images/pipeline/p067_X0.png)

![p067_X1](/images/pipeline/p067_X1.png)

![p067_X2](/images/pipeline/p067_X2.png)

你可以使用内置的 Project Manager 来保存和管理项目：

![p068_X1](/images/pipeline/p068_X1.png)

![p068_X0](/images/pipeline/p068_X0.png)

![p068_X2](/images/pipeline/p068_X2.png)

![p068_X3](/images/pipeline/p068_X3.png)

![p068_X4](/images/pipeline/p068_X4.png)

编辑器中的场景光照可以在 Illumination 选项卡下更改：

![p068_X5](/images/pipeline/p068_X5.png)

你可以在 Utilities/Texture Review 下的 Texture Review 工具中检查纹理（该选项仅在加载模型后可见）。

![p069_X0](/images/pipeline/p069_X0.png)

建议保持纹理文件夹整齐有序。你可以使用「Move Selected in backup folder」按钮备份未使用的纹理。
你可以使用 Copy&Paste 工具将现有着色器属性复制到另一个材质。
注意，你首先需要选择正确的着色器（如果源是 ksPerpixelMultimap，目标同样必须是 multimap 材质，依此类推），然后手动填充着色器插槽！完成这些步骤后，你可以在 Material Tools 下使用该工具复制和粘贴着色器数值，步骤如下：

![p069_X1](/images/pipeline/p069_X1.png)

透明和阴影投射（cast shadow）设置可以在 Materials 选项卡下全局应用到材质：

![p070_X0](/images/pipeline/p070_X0.png)

持久化文件（persistence 文件，包含着色器和对象设置）可以在 File 下保存。你还可以加载来自更高 LOD 的现有持久化文件。注意，在新的导出上加载持久化文件只会转移着色器设置，透明和阴影投射设置必须手动设置。不过，对于后续使用加载功能的持久化更新（一旦透明已设置好），就无需再次设置透明了。

![p070_X1](/images/pipeline/p070_X1.png)

使用不同 alpha 模式的一般指南：
在可能的情况下，尽量避免使用 Alpha Blend 模式。Blend 需要透明，这可能会引起绘制优先级问题，因为某些对象可以从两个方向被看到。
一个常见问题是内饰：内饰对象有时（例如前挡风玻璃内侧的透明横幅）需要将优先级设为 1，以避免从外部观看时，该对象在外部玻璃对象之前被绘制。
不过，从驾驶舱视角看，这可能会给对手车辆的模糊轮圈带来问题，因为优先级为 0 的模糊辐条对象会在内饰横幅之前绘制，例如当它绕过挡风玻璃时。
当然，对于玻璃对象和模糊轮圈辐条，仍然需要使用 Alpha Blend 模式。
使用优先级时，请确保优先级应用在对象级别，而不是子对象级别。
此外，如果透明对象链接到了某个 helper，你必须在层级中的最高一级指定优先级，也就是 helper 本身（参见关于 Damage Glass 的章节）。

![p071_X0](/images/pipeline/p071_X0.png)

建议在导出之前，在你的 3D 软件中将所有透明对象分离为独立对象。避免将透明对象包含在带有多个材质 ID 的组对象中。这一点非常重要，否则以后添加新的材质 ID 可能会导致透明和阴影投射设置「迁移」到另一个子对象，错误地将透明分配给原本不透明的网格部分。
当 alpha 没有渐变时，Alpha Test 模式通常能达到令人满意的效果。Alpha Test 不需要透明，这就是为什么即使有更多层彼此前后重叠也不会出现问题。在 Alpha Test 材质中，透明由 Normal Map 中的 Alpha 通道定义。
Alpha Test 模式还可以用于借助一张简单纹理隐藏某些对象（请确保对这些对象禁用阴影投射）。请记住，你是通过 Normal Map 的 alpha 通道来控制透明的。
非透明对象、或形状由网格定义的对象，需要使用 Opaque 模式。在这方面，请确保不要将属性不同的对象归入同一材质。如果你的对象需要 alpha 通道来定义其边界，请将它们归入一个新材质。作为一般规则，请将 alpha 对象与非 alpha 对象放在不同的材质中。
着色器类型指南
下面列出了几种用于车辆特定部件的着色器类型，展示了推荐的着色器和混合模式（注意：其他属性仅作示意）：

![p073_X1](/images/pipeline/p073_X1.png)

![p073_X0](/images/pipeline/p073_X0.png)

![p073_X2](/images/pipeline/p073_X2.png)

![p073_X4](/images/pipeline/p073_X4.png)

![p073_X3](/images/pipeline/p073_X3.png)

![p074_X0](/images/pipeline/p074_X0.png)

![p074_X1](/images/pipeline/p074_X1.png)

![p074_X2](/images/pipeline/p074_X2.png)
