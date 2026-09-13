---
title: 着色器替换
---


> 汉化标题：通用 – 着色器替换  
> 原文页面：General-–-Shader-replacements  
> 原文锚点：74219cb  
> 汉化时间：2026-09-12T19:00:00+08:00  

最初，着色器替换顾名思义是用来替换现有模型的着色器的，但后来它发展得远不止于此，还可以修改材质参数与属性、纹理、对象参数，有时甚至能改变一些行为。

与赛道的 `[MATERIAL_ADJUSTMENT_...]` 或车辆的 `[EMISSIVE_...]` 之类的东西的主要区别在于：着色器替换是完全静态的，只在加载时或配置更改后应用一次。因此，它们本身不会影响性能，也不浪费任何内存（例如，动态的 `[MATERIAL_ADJUSTMENT_...]` 每帧都会更新）。所以对于静态修改，我强烈建议使用着色器替换。

不过，这一区别带来的一个后果是：如果你更改配置并删除了某个 `[SHADER_REPLACEMENT_...]` 节，原始值不会被恢复。

### 语法

```ini
[SHADER_REPLACEMENT_...]
ACTIVE = 1    ; 设为 0 可禁用整个节（默认值为 1）
SKINS = red?  ; 使用替换的涂装列表（仅适用于车辆）

; 首先是目标，材质或网格（需要注意一点：
; 修改材质属性时，MESHES 中的每个网格都会获得自己的一份材质，
; 从而增加 GPU 调用次数，因此尽可能使用 MATERIALS）：
MATERIALS = tree?, texture:grass?.dds
MESHES = mesh_bush_?

; 可选地，指定新着色器：
SHADER = ksTree_ppshadows

; 可以针对不同的原始着色器分别设置着色器：
SHADER_OVERRIDE_0 = ksTree, ksGrass  ; 如果原始着色器是 ksTree，则改用 ksGrass
SHADER_OVERRIDE_... = ksPerPixelAT?, ksTree ; 如果原始着色器以 "ksPerPixelAT" 开头，则使用 ksTree

LEAVE_FUNCTIONAL_SHADERS = 1  ; 为其余所有内容替换着色器时，
                              ; 保持 CSP 特定的功能性着色器不变

; 材质属性：
PROP_0 = ksAmbient, 0.4
PROP_1 = ksDiffuse, 0.5
PROP_... = ksEmissive, 1, 0, 0 ; 与往常一样，可以使用 "..." 自动填充索引

; 设置材质属性的另一种 KEY/VALUE 方式：
KEY_0 = ksAmbient
VALUE_0 = 0.4
KEY_... = ksDiffuse   ; 最多支持到 KEY_99/VALUE_99
VALUE_... = 0.5

; 纹理，用以下方式之一设置（此处最好不要用 "..."，
; 以确保键与值正确配对）：
RESOURCE_0 = txDiffuse
RESOURCE_TEXTURE_0 = name_of_texture_in_kn5.dds ; TEXTURE 指原始模型中的纹理

RESOURCE_1 = txNormal
RESOURCE_REF_1 = txDetailNM  ; REF 指特定槽位中的原始纹理

RESOURCE_2 = txMaps
RESOURCE_COLOR_2 = 1, 1, 1 ; COLOR 创建新的 1×1 纯色纹理

RESOURCE_3 = txDetail
RESOURCE_FILE_3 = custom.dds ; FILE 指磁盘上、配置文件旁边的纹理

FILL_MISSING_TEXTURES = 1 ; 该选项会自动创建缺失的纹理，例如
                          ; txNormal（平坦法线）或 txMaps（白色），以确保外观不破损
FORCE_POINT_SAMPLER = 1       ; 强制使用点采样纹理采样器，如果你有很小的纹理，
                              ; 想让它锐利、像素化而不是模糊，请使用此项
FORCE_MINUS_TWO_LOD_BIAS = 1  ; 强制纹理采样器使用 -2 的 LOD 偏置，使纹理更锐利

; 材质参数（详情请查看「不同模式」一节）：
BLEND_MODE = ALPHA_BLEND   ; OPAQUE、ALPHA_TEST、ALPHA_BLEND、TRANSPARENT_AS_BLACK、ADD 或 ALPHA_ADD、MULTIPLY 或 ALPHA_MULTIPLY
CULL_MODE = OFF            ; DOUBLESIDED、FRONT_NO_MS、WIREFRAME、WIREFRAME_AA、FRONT_BIASED、SHADOWS_DOUBLE、SHADOWS_FRONT
DEPTH_MODE = NORMAL_FORCED ; NOWRITE、OFF、LESSEQUAL、LESSEQUAL_NOWRITE、NORMAL_FORCED
LINEAR_ALPHA_FIX = 1       ; 修复线性色彩空间中的 Alpha 混合，取值 0–3（仅在情况糟糕时使用）

; 阴影参数：
CAST_SHADOWS = 1  ;* 设置网格是否投射阴影，取值 0、1 或 TERRAIN：
                  ; 1 表示始终投射，TERRAIN 表示仅在太阳角度较低时投射，以加快速度

CAST_DYNAMIC_SHADOWS = 1  ;* 设置网格是否投射动态阴影

DISTANT_SHADOWS = 1       ;* 设置网格是否投射远处（第四级联）阴影，
                          ; 取值 0、1 或 TERRAIN

SEMITRANSPARENT_SHADOWS = 1  ; 半透明阴影，取值 0、1、TEXTURE 或 NORMALS：
                             ; 1 为均匀的半透明，TEXTURE 会将纹理考虑在内，
                             ; NORMALS 使用基于法线的半透明（可附加
                             ; 额外参数，如 "NORMALS, 1, 0"）

; 双面阴影（虽然可能会让阴影渲染稍微变慢，
; 但我建议尝试一下，它似乎能消除大量阴影孔洞或彼得潘效应，
; 尤其是对仪表板或远距离阴影，改善相当明显）：
DOUBLE_FACE_SHADOW = 1         ; 这一项可能会导致——而且很可能导致——大量自阴影
DOUBLE_FACE_SHADOW_BIASED = 1  ; 但这一项带有偏置，效果会很好

; 遮罩通道（启用后，网格会被渲染两次：第一次使用乘法混合模式
; 和一种特殊着色器来提取纯色纹理颜色，从而为其后方的内容着色，
; 以获得正确的彩色玻璃外观）。与其直接设置这些值，请考虑使用「materials_glass.ini」：
EXTRA_MASK_PASS = 1              ;* 启用遮罩通道
EXTRA_MASK_PASS_COLOR = 0, 0, 0  ;* 可选的颜色偏移，RGB，可正可负
EXTRA_MASK_PASS_OPACITY = 2      ;* 该彩色玻璃通道的可选不透明度调整
EXTRA_MASK_PASS_COLOR_MULT = 1, 1, 1  ;* 遮罩通道的可选颜色乘数
EXTRA_MASK_PASS_OPACITY_CLIP = 0      ;* 遮罩通道的可选不透明度裁剪阈值

; 彩色阴影（为半透明表面（如彩色玻璃）生成彩色阴影）。适用于车辆
; 内部几何体。与其直接设置这些值，请考虑使用「materials_glass.ini」中的 banner 材质：
COLORFUL_SHADOWING = 1                   ;* 启用彩色阴影，数值设置强度
COLORFUL_SHADOWING_COLOR = 0, 0, 0       ;* 可选的颜色偏移
COLORFUL_SHADOWING_COLOR_MULT = 1, 1, 1  ;* 可选的颜色乘数
COLORFUL_SHADOWING_OPACITY_CLIP = 0      ;* 可选的不透明度裁剪阈值

; 其他参数：
FIXED_EMISSIVE = 1  ; Weather FX 会改变自发光强度以更好地模拟人眼适应；
                    ; 使用此标志可为指定网格禁用该行为（仅在非常特殊的情况下使用，
                    ; 例如 BLEND_MODE=MULTIPLY 或镜面；不过镜面会自动获得此标志）
IS_TRANSPARENT = 1  ;* 即 IsTransparent 标志，确保网格最后渲染
IS_VISIBLE = 1      ;* 设置网格可见性，设为 0 可隐藏网格
IS_EXTRA_PASS_TRANSPARENT = 1  ;* 在额外渲染通道中将网格标记为透明
RENDER_LAST = 1     ;* 在同组的其他网格之后渲染该网格
LAYER = 0           ;* 网格层级，同时也是渲染该网格所需的最低细节级别
LOD_IN = 0          ;* LOD 进入距离（距离更近时网格会被隐藏），单位为米
LOD_OUT = 500       ;* LOD 退出距离（距离更远时网格会被隐藏），单位为米

DISABLE_FAR_PLANE_CLIPPING = 1  ;* 在针对相机视锥体检查可见性时跳过远平面，远处
                                ; 几何体（及其自定义着色器）需要此项才能正常工作
INCLUDE_IN_CUBEMAP = 0          ;* 设为 0 可将网格排除在立方体贴图渲染之外
INCLUDE_IN_SECONDARY_VIEWS = 0  ;* 设为 0 可将网格排除在辅助视图（后视镜等）之外
FUR_LAYERS = 4      ;* 毛皮层数，取值 0 到 32

; Extra FX 参数（用于 Extra FX 后期处理，需要 v0.3.0-preview356 或更新版本）：
EFX_SKIP_GBUFFER = 0    ;* 控制 G 缓冲区渲染通道
EFX_MASK_GBUFFER = 0    ;* 控制 G 缓冲区遮罩
EFX_BLEND_GBUFFER = 0   ;* 控制 G 缓冲区混合
EFX_DELAYED_RENDER = 0  ;* 控制延迟渲染

; 在渲染顺序中相对于其他网格移动网格：
MOVE_MESH_IN_FRONT_OF = some_mesh  ;* 将网格置于渲染顺序中指定目标之前
MOVE_MESH_BEHIND = other_mesh      ;* 将网格置于渲染顺序中指定目标之后

; 材质共享行为：
SHARED_MATERIALS = 0  ; 设为 1 可应用于共享同一材质的所有网格，
                      ; 或设为 FORCE 以强制应用于非唯一材质

; 材质标志：
MATERIAL_FLAG_0 = 1          ; 自定义材质着色器标志 0
MATERIAL_FLAG_1 = 1          ; 自定义材质着色器标志 1
MATERIAL_FLAG_2 = 1          ; 自定义材质着色器标志 2
VRS_FIX = 1                  ; 应用可变速率着色（Variable Rate Shading）修复
DIM_EMISSIVE_IN_CUBEMAP = 1  ; 在立方体贴图渲染中调暗自发光
LINK_KS_VALUES = 1           ; 关联 ks 值

; Z 缓冲区调整：
DISTANT_FIX = 1    ; 减少远处几何体的 Z 闪烁（Z-fighting）
STICKERS_FIX = 1   ; 将几何体向相机稍微移近，非常适合贴纸之类的东西

; 替代自发光模式（一次只能使用一种）：
ADAPTIVE_EMISSIVE = 1              ; 自适应自发光模式（赛道用远处模式，车辆用近处模式）
ADAPTIVE_DISTANT_EMISSIVE = 1      ; 自适应远处自发光模式
ADAPTIVE_NEARBY_EMISSIVE = 1       ; 自适应近处自发光模式
WHITE_REFERENCE_POINT_EMISSIVE = 1 ; 基于白色参考点的自发光

; * — 逐对象调整项；如果你只使用 MESHES 而不使用其他目标，这些选项不会创建新材质。
```

### 不同模式

#### 混合模式（`BLEND_MODE = …`）

- `OPAQUE`：普通不透明模式；
- `ALPHA_TEST`：普通 Alpha 测试；
- `ALPHA_BLEND`：普通 Alpha 混合；
- `ADD`：加法混合模式，可能很适合发光区域（只需确保将 `ksDiffuse` 和 `ksAmbient` 设为零，仅依赖 `ksEmissive`）；
- `MULTIPLY`：乘法混合模式，以备不时之需（同样，只使用 `ksEmissive`，并且别忘了将 `FIXED_EMISSIVE` 设为 1，以确保表面颜色恒定不变）；
- `TRANSPARENT_AS_BLACK`：效果类似 Alpha 混合，但透明表面不再是透明的，而是黑色（扩展配置在 Ruf Yellowbird 上使用了它，用来修复其尾部格栅后方没有建模内容的问题，也许在其他地方也有用）；

请记住，不透明和 Alpha 测试是最快的，其余的都会拖慢速度。除 `OPAQUE`、`ALPHA_TEST` 和 `TRANSPARENT_AS_BLACK` 之外的模式都可能需要为网格设置透明标志（但仅当你无法将可能位于其身后的所有网格在渲染队列中移到它前面时才需要；否则，请照常避免使用透明标志，以同时节省性能并提高视觉质量）。

#### 剔除模式（`CULL_MODE = …`）

- `FRONT`：常规模式，剔除背面；
- `BACK`：显示背面、隐藏正面；
- `WIREFRAME`：显示线框；
- `WIREFRAME_AA`：显示抗锯齿线框（非常慢）；
- `DOUBLESIDED`、`NONE` 或 `OFF`：显示双面。

双面模式会增加需要着色的表面，从而对性能产生负面影响。

#### 深度模式（`DEPTH_MODE = …`）

- `NORMAL_FORCED`：默认情况下，任何透明网格（带透明标志的）都会忽略深度模式，这在某些情况下可能导致伪影，此值或许能有所帮助，但请谨慎使用，它并非完美的解决方案，也有自身的问题（不过对 Brands Hatch 的车窗确实有效）；
- `OFF`：或 'DEPTH_OFF'——网格不会被遮挡，也不会遮挡任何东西；如果它最后渲染，就会显示在最上面，如果它最先渲染，所有东西都会画在它上面；
- `NOWRITE`：或 'DEPTH_NOWRITE'、'READONLY'、'READ_ONLY'——网格会被其他网格遮挡，但它本身不会遮挡任何东西；
- `LESSEQUAL`：或 'DEPTH_LESSEQUAL'——如果网格与其他网格处于完全相同的位置，它可以遮挡它们（将「到相机的新距离 < 到相机的旧距离」中常规的 `<` 替换为 `≤`）；
- `LESSEQUAL_NOWRITE`：或 'DEPTH_LESSEQUAL_NOWRITE'、'LESSEQUAL_READONLY'、'LESSEQUAL_READ_ONLY'；
- `NORMAL`：默认值；基于到相机距离的常规遮挡模式。

我猜想 `LESSEQUAL` 可能非常适合以第二层方式添加到车辆上的贴纸，因为它们无需任何偏移即可正常工作。


### 填充缺失纹理的颜色

- `txDiffuse`：白色；
- `txMaps`：白色；
- `txDetail`：白色；
- `txNormal`：平坦法线（127, 127, 255）；
- `txNormalBlur`：平坦法线（127, 127, 255）；
- `txNormalDetail`：平坦法线（127, 127, 255）；
- `txNormalR`：平坦法线（127, 127, 255）；
- `txNormalG`：平坦法线（127, 127, 255）；
- `txNormalB`：平坦法线（127, 127, 255）；
- `txNormalA`：平坦法线（127, 127, 255）。

### 新参数

Custom Shaders Patch 为各种着色器添加了更多参数来调整其行为，而 `[SHADER_REPLACEMENT_...]` 正是设置这些参数的理想工具。

#### extExtraSharpLocalReflections

改变局部反射（SSLR）。在有些地方，把反射弄得模糊一些更可取，以掩盖它们其实只是简单立方体贴图反射的事实（通过降低 ksSpecularEXP），但没有任何理由让局部反射也那么模糊。要让它们更锐利，只需设一个非零值即可，相当于锐度增强，取值范围 0 到 1。

另一个可能更重要的功能：如果值为负，局部反射会切换到强制模式，大幅放宽对检测到的反射的质量检查。默认情况下，这些检查相当严格：该算法最初是为车漆设计的，而对于车漆，在大多数情况下，反射出天空总好过出现错误的、重复的侧后视镜反射。然而在其他情况下，例如车辆轮圈，哪怕再杂乱，有一份局部反射可能也比反射出天空更好。

前一部分，即锐度增强，取 `extExtraSharpLocalReflections` 的绝对值，因此你可以将 `extExtraSharpLocalReflections` 设为 -0.001，在不改变锐度的情况下切换到强制 SSLR 反射，或者设为 -1，使其既强制又格外锐利（这种奇怪的组合可以节省从 CPU 传递到 GPU 的数据量）。

示例，为 Kunos 的 E30 的铬质部件强制启用反射：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = Chrome
PROP_... = extExtraSharpLocalReflections, -0.001
```

#### seasonAutumn、seasonWinter

几乎所有着色器都支持，用于调整漫反射颜色。秋季（Autumn）变量会使其偏黄，冬季（Winter）变量则会降低饱和度并提高亮度。两者都使用绿色程度作为遮罩。这整个功能只是一个获取季节效果的快速、廉价的取巧手段，希望将来会被更完善的方案取代。如果你想使用它，请在绑定了某种季节条件的 `[MATERIAL_ADJUSTMENT_...]` 中设置。

#### extColoredReflection、extColoredReflectionNorm、extColoredBaseReflection

适用于带反射的着色器，这些参数可以让高光和反射的颜色受到下方表面颜色的影响，无需 PBR 的全部开销即可获得正确的金属质感。它对于让车灯更具反射感而又不丢失颜色也非常有用。

- `extColoredReflection`：取值 0 到 1，着色的强度。

- `extColoredReflectionNorm`：取值 0 到 1，灰色被着色的程度。默认值 0 时，其行为类似于仅提取色相，因此深灰和白色对反射的影响相同。为 1 时，亮度也会被纳入考虑，深灰色表面会损失大量反射。

- `extColoredBaseReflection`：仅适用于同时具有常规高光和太阳高光的 MultiMap 着色器，反射和太阳高光使用 `extColoredReflection`，基础高光使用 `extColoredBaseReflection`。

#### extBounceBack

添加向光源方向反射回去的光，可能对使用特殊涂料的道路标志有用，或者用于车辆灯光旁那些被其他车辆照亮时会发亮的东西。不确定正确的术语是什么，就是这些东西：

<img src="https://img-webike-370429.c.cdn77.org/catalogue/webike_images/0000/0000/0121/1057006_2.jpg" width="400" />

[这里有一段介绍其原理的精彩视频](https://www.youtube.com/watch?v=z5cR6EA2jGY)。

支持的着色器：

- `ksPerPixelMultiMap_AT_NMDetail_ps`；
- `ksPerPixelMultiMap_AT_ps`；
- `ksPerPixelMultiMap_NMDetail_emissive_ps`；
- `ksPerPixelMultiMap_NMDetail_ps`；
- `ksPerPixelMultiMap_emissive_ps`；
- `ksPerPixelMultiMap_ps`；
- `ksPerPixelNM_ps`；
- `ksPerPixelReflection_ps`；
- `smLicensePlate_ps`。

该变量设置这种反射光的强度。额外提示：有一个光源制作器应用，它可以帮助你在相机位置快速创建一个朝向前方的聚光灯，只需增大范围，可能还有强度。非常适合在这里进行测试。

### 对比图

- [普通阴影 vs `DOUBLE_FACE_SHADOW_BIASED = 1`](https://acstuff.ru/u/comparison/Uab)；
- [普通树木阴影 vs `SEMITRANSPARENT_SHADOWS = 1`](https://acstuff.ru/u/comparison/i27)。

