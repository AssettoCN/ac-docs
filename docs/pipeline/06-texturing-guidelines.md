---
title: 6. 贴图准则
---

# 6. 贴图准则

支持的纹理格式为：directX DDS。
这种格式可以（例如）用 Photoshop 通过专用的 nVidia 插件输出，插件可在
此处获取：https://developer.nvidia.com/legacy-texture-tools
作为一般规则，我们建议高分辨率纹理（带或不带 Alpha）使用 DXT5 格式，对含有敏感
渐变信息的纹理（RGB 贴图、精细法线贴图）或小尺寸细节纹理使用 8.8.8.8 格式，包含
Alpha 信息时也使用 8.8.8.8。
每张纹理我们都需要一份带图层的 PSD 源文件。这些图层必须放置在命名一致且易于理解
的图层文件夹内。

![p047_X0](/images/pipeline/p047_X0.png)

在每个文件夹内，我们需要一个基础图层，让我们能够
修改纹理的重要特征。请遵循以下规则：
a) 如果纹理带有 ALPHA 通道，不要
合并透明元素，把透明元素
保留在单独的图层中。
b) 如果有法线贴图，还要在该图层中提供
灰度纹理，以便用 nVidia 工具重新生成它
c) 始终以目标图像两倍（不多不少）的分辨率工作，只有在导出
DDS 时才把它缩小到正确的尺寸。测试你的结果，确保缩小
不会过度损坏图像（极小的文字或符号可能出现这种情况）。
d) 所有 PSD 文件的通道模式必须为 RGB 颜色 8 位。
e) 按照我们的命名规范正确命名。

## PSD 源文件的纹理命名规范

Skin.PSD 包含车身主体纹理
环境光遮蔽
线框（UV）
RGB 贴图（材质 specular-gloss-ref 贴图）
材质 ID 与分区
Alpha 通道
Ext_Details.PSD 包含外部的铆钉、螺栓、标志和贴花
漫反射贴图
法线贴图
环境光遮蔽
RGB 贴图（材质 specular-gloss-ref 贴图）
Alpha 通道
Rims.PSD 包含轮毂基础纹理和轮毂模糊纹理以及模糊的辐条
漫反射贴图
法线贴图
环境光遮蔽
RGB 贴图（材质 specular-gloss-ref 贴图）
Alpha 通道
Calipers.psd 包含制动卡钳纹理
漫反射贴图
法线贴图
环境光遮蔽
RGB 贴图（材质 specular-gloss-ref 贴图）
Alpha 通道
Lights.psd 包含车灯纹理
漫反射贴图
法线贴图
环境光遮蔽
RGB 贴图（材质 specular-gloss-ref 贴图）
Alpha 通道
Mechanics.psd 包含底盘、发动机以及所有未包含在车身蒙皮内的部件
线框（UV）
漫反射贴图
法线贴图
环境光遮蔽
RGB 贴图（材质 specular-gloss-ref 贴图）
Alpha 通道
Glass.psd 包含玻璃纹理以及所有类似的部件，比如黑色边框
漫反射贴图
法线贴图
Alpha 通道
Grids.psd 包含可平铺的格栅和类似纹理（如有需要可以使用多张）
漫反射贴图
法线贴图
环境光遮蔽
RGB 贴图（材质 specular-gloss-ref 贴图）
Alpha 通道
Tyre.psd 包含带模糊和污垢的轮胎纹理
线框（UV）
漫反射贴图
法线贴图
环境光遮蔽
Alpha 通道
Disc.psd 包含制动盘纹理和发光纹理
线框（UV）
漫反射贴图
RGB 法线贴图
发光贴图
Windscreen.psd 包含伪造的玻璃内部反射
漫反射贴图
Alpha 通道
INT_Decals.psd 包含仪表刻度盘、仪表板符号、座舱细节和标志、铭牌以及
内饰螺栓和贴纸
漫反射贴图
法线贴图
环境光遮蔽
RGB 贴图（材质 specular-gloss-ref 贴图）
Alpha 通道
INT_Details.psd 包含彩色渐变和其他用于较小物件的细节
漫反射贴图
法线贴图
环境光遮蔽
Alpha 通道
INT_Occlusion.psd 包含座舱环境光遮蔽纹理
线框图章
漫反射贴图
法线贴图
环境光遮蔽
RGB 贴图（材质 specular-gloss-ref 贴图）
Alpha 通道
Belts.PSD 包含座舱安全带
漫反射贴图
法线贴图
Seams.psd 包含缝线、接缝及类似纹理的可平铺版本
漫反射贴图
法线贴图
INT_cockpit_LR.psd 包含座舱低分辨率纹理
环境光遮蔽
线框图章
RGB 贴图（材质 specular-gloss-ref 贴图）
材质 ID 与分区
Alpha 通道
所有可能出现的、此处未提及的额外纹理，都可以使用一个简明说明其内容的名称。
要了解如何管理纹理，你可以查看 SDK 中 example 文件夹里的示例。

## 纹理导出与优化

官方车辆的 carname_lod_A.kn5 文件必须保持在 44MB 以下，包括所有纹理和网格。
纹理必须经过非常好的优化。当 PC 内存耗尽时，游戏引擎会开始
自动缩小纹理尺寸，然而这种方式无法保证高质量，因此
我们必须在所有情况下都避免这种情况，让 LOD A.kn5 文件保持在 44MB 限制以内。
注意：作为一般准则，高分辨率纹理可以使用 DXT5 压缩。带敏感渐变的灰度
纹理使用 AL（8.8，alpha luminance）模式。map 类纹理使用
RGB（8.8.8）模式，带精细细节的 NM 纹理使用 ARGB（8.8.8.8）。记得保留一套完整的、
未经压缩的所有纹理作为备份，这样即使需要重新输出，
也不会因追加的压缩而造成画质损失。
绝对不要使用 DXT1 压缩模式。保持 PSD 文件有条理且随时更新，以便在
模型交付之后需要修改时可以重新输出纹理。不要在
压缩后的 DDS 纹理上工作，始终在 PSD 中进行修改，并让它与
导出的纹理保持同步，使每个 PSD 文件的最新版本都与最新的 DDS 输出相对应。
下面是纹理尺寸的一些示例。在考虑保持高画质观感的
优先级的前提下，你可以使用更大的纹理，前提是你把其他纹理优化得更好，并且
不超出限制：
Skin_00.dds（车身主体）在带有赞助商和涂装时必须为 2048x2048。
如果是素色，可以为 1024x1024 并保存为 8.8。Skin_00_map.dss 512x512 ARGB
Rim.dds 512x512。它可以包含轮毂模糊不透明部分的基础材质。Rim_map.dds
为轮毂尺寸的一半并保存为 ARGB。Rim_Spokes.dds 256x256
INT_Occlusion.dds 512x512，INT_Occlusion_map .dds 512x512 保存为 8.8。
INT_Cockpit_LR.dds 512x512 或 1024x1024，取决于车顶是敞开还是封闭。DXT5
就足够了。
INT_Decals.dds 1024x512 DXT5 - INT_Decals_NM.dds 1024x512 用 DXT5 或 ARGB。
Lights.dds 512x512 ARGB - Lights_NM.dds 512x512 ARGB - Lights_Map.dds 256x256 ARGB
格栅（Grids）可平铺及各种类似纹理 256x256 或再减半，取决于图像细节，导出为
ARGB。
Tyre_D.dds 和 Tyre_NM.dds 1024x1024 DXT5
Tyre_blur_D.dds 和 Tyre_blur_NM.dds 可以为 512x512 或 256x256，NM 保存为 ARGB。
Disc_D.dds 和 Disc_NM.dds 在非常显眼时可以为 512x512，D 用 DXT5（D）、ARGB（NM）；当它
很小、不太显眼或没有细节时减半。Disc_Blur_NM.dds 和 Disc_Blur_NM.dds
为未模糊制动盘纹理的一半。Disc_warm.dds 始终为 128x128。
INT_Materials_D.dds 和 INT_Materials_NM.dds 512x512 或更小，取决于图像内容。
INT_Materials_map .dds 为基础纹理的一半，全部保存为 ARGB（尤其是 NM 和 RGB map），
以保持渐变的质量。
Damage.dds 2048x2048 - Damage_NM.dds 为 512x512 - Damage_Mask.dds 为 256x256 - Dust.dds
为 1024x1024 DXT5。
Stiching_D.dds 和 Stiching_NM.dds 可以为 256x128，垂直可平铺，保存为 ARGB。
Belt_D.dds 和 Belt_NM.dds 可以为 128x256 ARGB，且必须垂直可平铺。
Mechanics_D.dds 和 Mechanics_NM.dds 在包含可见发动机时可以为 1024x1024。否则可以
减半。Mechanics_map.dds 始终为漫反射贴图的一半。漫反射用 DXT5，NM 用 ARGB，map 用 RGB。
Calipers.dds 和 Calipers_NM.dds 可以为 256x256，或者如果你的车是'60 年代的开放式
座舱赛车，在某些情况下可以作为 Mechanics 纹理的一部分。Calipers_map.dds 始终为漫反射
贴图尺寸的一半。漫反射用 DXT5，NM 用 ARGB，map 纹理用 RGB。

## 纹理空间的最佳利用

在使用纹理中的空间时，你必须确保尽最大努力优化一切。
最大化意味着所有可用空间都必须被利用。开始之前你必须做好规划，
确保以最高效的方式使用你的纹理空间。
下面是 Decals_D 纹理充分利用空间的一个示例：

![p051_X0](/images/pipeline/p051_X0.png)

在漫反射贴图和法线贴图（NORMAL MAP）中都包含 alpha 通道，
确保它适用于每一种着色器类型。
在下面的纹理中，你可以看到显示 alpha 通道的法线贴图纹理。
未压缩的 alpha 通道定义了细节的轮廓。

![p052_X0](/images/pipeline/p052_X0.png)

请看以下遮蔽贴图或车身蒙皮纹理的示例，了解如何优化
可用的纹理空间：

![p052_X1](/images/pipeline/p052_X1.png)

各个部件用满了可用的
最大空间，填充（扩展边界）
填满了剩余的空间。
这种排列方式让我们可以
把纹理一路缩小到
512x512（未压缩），同时
让遮蔽渐变保持在
可以接受的质量水平。
建议所有带 AO 贴图的
内饰物件都映射到
单张纹理上。
相同的材质组必须
使用相同的缩放比例，以
确保细节纹理正确
显示。
注意：你还要确保在 UV 贴图中，不同的 UV 部件使用相同的缩放比例，
确保任何细节纹理（金属闪粉或碳纤维）都能正确显示，不出现任何拉伸和
变形！
建议你对使用细节纹理的车身和内饰纹理，在映射时
使用带棋盘格的细节纹理。
此外——尤其是在外观上——纹理必须组织得当。看第二个示例：

![p053_X0](/images/pipeline/p053_X0.png)

## 烘焙环境光遮蔽

为了获得更真实的光照效果，我们需要为车身外观、轮毂、车灯以及座舱内部
烘焙环境光遮蔽贴图。

![p054_X1](/images/pipeline/p054_X1.png)

取外观模型，并移除所有 DECALS 物件。如果你有可活动的扰流翼，把它移得
离车身稍远一些。以双倍分辨率（4096x4096）烘焙环境光遮蔽（Ambient Occlusion）。
对于座舱：移除所有用于标志的 DECALS 和缝线。烘焙内饰时，像图中那样摆放
车门。烘焙方向盘时，移除其他所有物体，让它朝上（UP）烘焙。
注意：看那些粉色的部件，它们自身不接收遮蔽，但会对座舱产生影响。它们
将被归入另一个不同的材质。

![p054_X0](/images/pipeline/p054_X0.png)

让车门保持足够远的距离，以避免在

![p055_X0](/images/pipeline/p055_X0.png)

边缘和门槛上出现深色的遮蔽。
烘焙出来的纹理永远不是我们最终想要的样子。我们
建议在 Photoshop 中编辑它，让物体之间的交界更柔和。
随机像素出现在
可见位置时会造成糟糕的效果。
必要时用 Photoshop 让过渡
更平滑。AO 纹理整体上是一种柔和的
渐变。避免锐利、像素化和不干净的过渡。
重要：烘焙时务必确保使用
足够宽的填充，以避免低分辨率纹理
的边缘周围渗出黑色伪影。
注意：高质量的遮蔽贴图，比如用 V-Ray 烘焙
出来的那些，之后在 PS 中需要的修饰会更少，因此值得花更多时间研究
如何以尽可能好的质量烘焙纹理。
