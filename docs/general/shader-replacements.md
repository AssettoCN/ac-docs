---
title: 着色器替换
---

# 着色器替换

着色器替换最初是为了替换现有模型的着色器而设计的，但后来发展成了更强大的功能，允许更改材质参数和属性、纹理、对象参数，有时甚至可以改变一些行为。

与 `[MATERIAL_ADJUSTMENT_...]`（用于赛道）或 `[EMISSIVE_...]`（用于车辆）不同，着色器替换是完全静态的，只在加载期间或配置更改时应用一次。因此，它们本身不会影响性能或浪费任何 RAM（而动态的 `[MATERIAL_ADJUSTMENT_...]` 每帧都在更新）。因此，对于静态更改，强烈建议使用着色器替换。

这种差异的一个后果是，如果你更改配置并移除了 `[SHADER_REPLACEMENT_...]` 节，它不会恢复原始值。

## 语法

```ini
[SHADER_REPLACEMENT_...]
ACTIVE = 1    ; 设为 0 以禁用整个节（默认值为 1）
SKINS = red?  ; 使用替换的皮肤列表（仅适用于车辆）

; 首先，目标：材质或网格（需要注意的是：
; 对于更改材质属性，MESHES 中的每个网格都会获得自己的材质，
; 因此会增加 GPU 调用次数，所以在可能的情况下最好使用 MATERIALS）：
MATERIALS = tree?, texture:grass?.dds
MESHES = mesh_bush_?

; 可选的新着色器：
SHADER = ksTree_ppshadows

; 可以根据不同的原始着色器设置不同的着色器：
SHADER_OVERRIDE_0 = ksTree, ksGrass  ; 如果原始着色器是 ksTree，使用 ksGrass
SHADER_OVERRIDE_... = ksPerPixelAT?, ksTree ; 如果原始着色器以"ksPerPixelAT"开头，使用 ksTree

LEAVE_FUNCTIONAL_SHADERS = 1  ; 替换其他所有着色器时保持 CSP 功能性着色器不变

; 材质属性：
PROP_0 = ksAmbient, 0.4
PROP_1 = ksDiffuse, 0.5
PROP_... = ksEmissive, 1, 0, 0 ; 和往常一样，可以使用"..."自动填充索引

; 替代的 KEY/VALUE 方式设置材质属性：
KEY_0 = ksAmbient
VALUE_0 = 0.4
KEY_... = ksDiffuse   ; 支持最多 KEY_99/VALUE_99
VALUE_... = 0.5

; 纹理，用以下方式之一设置（这里最好不要用"..."以确保键与其值配对）：
RESOURCE_0 = txDiffuse
RESOURCE_TEXTURE_0 = name_of_texture_in_kn5.dds ; TEXTURE 引用原始模型中的纹理

RESOURCE_1 = txNormal
RESOURCE_REF_1 = txDetailNM  ; REF 引用特定槽位中的原始纹理

RESOURCE_2 = txMaps
RESOURCE_COLOR_2 = 1, 1, 1 ; COLOR 创建新的 1×1 纯色纹理

RESOURCE_3 = txDetail
RESOURCE_FILE_3 = custom.dds ; FILE 引用磁盘上的纹理，位于配置文件旁边

FILL_MISSING_TEXTURES = 1 ; 此选项会自动创建缺失的纹理，如
                          ; txNormal（平面）或 txMaps（白色），确保外观完整
FORCE_POINT_SAMPLER = 1       ; 强制像素纹理采样器，如果你有小纹理并
                              ; 想让它清晰像素化而非模糊
FORCE_MINUS_TWO_LOD_BIAS = 1  ; 强制使用 -2 LOD 偏移的纹理采样器以获得更清晰的纹理

; 材质参数（详情请参阅"不同模式"部分）：
BLEND_MODE = ALPHA_BLEND   ; OPAQUE, ALPHA_TEST, ALPHA_BLEND, TRANSPARENT_AS_BLACK, ADD 或 ALPHA_ADD, MULTIPLY 或 ALPHA_MULTIPLY
CULL_MODE = OFF            ; DOUBLESIDED, FRONT_NO_MS, WIREFRAME, WIREFRAME_AA, FRONT_BIASED, SHADOWS_DOUBLE, SHADOWS_FRONT
DEPTH_MODE = NORMAL_FORCED ; NOWRITE, OFF, LESSEQUAL, LESSEQUAL_NOWRITE, NORMAL_FORCED
LINEAR_ALPHA_FIX = 1       ; 修复线性色彩空间中的 Alpha 混合，值 0–3（仅在出现问题时使用）

; 阴影参数：
CAST_SHADOWS = 1  ;* 设置网格是否投射阴影，值为 0、1 或 TERRAIN：
                   ; 1 持续启用，TERRAIN 仅在太阳低时启用以加速

CAST_DYNAMIC_SHADOWS = 1  ;* 设置网格是否投射动态阴影

DISTANT_SHADOWS = 1       ;* 设置网格是否投射远距离（第四级联）阴影，
                           ; 值为 0、1 或 TERRAIN

SEMITRANSPARENT_SHADOWS = 1  ; 半透明阴影，值为 0、1、TEXTURE 或 NORMALS：
                              ; 1 为实体半透明，TEXTURE 会考虑纹理，
                              ; NORMALS 使用基于法线的半透明（带可选
                              ; 额外参数，例如 "NORMALS, 1, 0"）

; 双面阴影（虽然可能使阴影渲染稍慢，
; 我建议尝试，它通过消除大量孔洞或彼得潘效应显著改善阴影，
; 特别是对仪表板或远距离）：
DOUBLE_FACE_SHADOW = 1         ; 这个可能——而且很可能会——导致大量自阴影
DOUBLE_FACE_SHADOW_BIASED = 1  ; 但这个有偏移，所以效果会更好

; 遮罩通道（启用后，网格会被渲染两次，首先使用乘法混合模式和
; 特殊着色器提取实体纹理颜色，从而为后面的内容上色
; 以获得正确的有色玻璃外观）。建议使用 "materials_glass.ini"：
EXTRA_MASK_PASS = 1              ;* 启用遮罩通道
EXTRA_MASK_PASS_COLOR = 0, 0, 0  ;* 可选颜色偏移，RGB，可为正或负值
EXTRA_MASK_PASS_OPACITY = 2      ;* 该有色玻璃通道的可选不透明度调整
EXTRA_MASK_PASS_COLOR_MULT = 1, 1, 1  ;* 遮罩通道的可选颜色乘数
EXTRA_MASK_PASS_OPACITY_CLIP = 0      ;* 遮罩通道的可选不透明度裁剪阈值

; 彩色阴影（为半透明表面创建彩色阴影，如彩色玻璃）。适用于车辆
; 内部几何体。建议使用 "materials_glass.ini" 中的 banner 材质：
COLORFUL_SHADOWING = 1                   ;* 启用彩色阴影，值设置强度
COLORFUL_SHADOWING_COLOR = 0, 0, 0       ;* 可选颜色偏移
COLORFUL_SHADOWING_COLOR_MULT = 1, 1, 1  ;* 可选颜色乘数
COLORFUL_SHADOWING_OPACITY_CLIP = 0      ;* 可选不透明度裁剪阈值

; 其他参数：
FIXED_EMISSIVE = 1  ; Weather FX 可以更改自发光以更好地模拟眼睛适应；使用此
                     ; 标志禁用给定网格的该行为（仅在非常特殊的情况下使用，
                     ; 如 BLEND_MODE=MULTIPLY 或后视镜；后视镜会自动获得此标志）
IS_TRANSPARENT = 1  ;* IsTransparent 标志，确保网格最后渲染
IS_VISIBLE = 1      ;* 设置网格可见性，设为 0 隐藏网格
IS_EXTRA_PASS_TRANSPARENT = 1  ;* 在额外渲染通道中将网格标记为透明
RENDER_LAST = 1     ;* 在同一组中最后渲染网格
LAYER = 0           ;* 网格层，也是网格渲染的最低细节级别
LOD_IN = 0          ;* LOD 进入距离（距离低于此值时隐藏网格），单位：米
LOD_OUT = 500       ;* LOD 退出距离（距离超过此值时隐藏网格），单位：米

DISABLE_FAR_PLANE_CLIPPING = 1  ;* 检查相机视锥体可见性时跳过远平面，
                                 ; 远距离几何体（使用自定义着色器）需要此项
INCLUDE_IN_CUBEMAP = 0          ;* 设为 0 从立方体贴图渲染中排除网格
INCLUDE_IN_SECONDARY_VIEWS = 0  ;* 设为 0 从次要视图（后视镜等）中排除网格
FUR_LAYERS = 4      ;* 毛皮层数，从 0 到 32

; Extra FX 参数（用于 Extra FX 后处理，需要 v0.3.0-preview356 或更高版本）：
EFX_SKIP_GBUFFER = 0    ;* 控制 gbuffer 渲染通道
EFX_MASK_GBUFFER = 0    ;* 控制 gbuffer 遮罩
EFX_BLEND_GBUFFER = 0   ;* 控制 gbuffer 混合
EFX_DELAYED_RENDER = 0  ;* 控制延迟渲染

; 在渲染顺序中相对于其他网格移动网格：
MOVE_MESH_IN_FRONT_OF = some_mesh  ;* 将网格放置在渲染顺序中指定目标之前
MOVE_MESH_BEHIND = other_mesh      ;* 将网格放置在渲染顺序中指定目标之后

; 材质共享行为：
SHARED_MATERIALS = 0  ; 设为 1 应用于共享相同材质的所有网格，
                       ; 或 FORCE 甚至应用于非唯一材质

; 材质标志：
MATERIAL_FLAG_0 = 1          ; 自定义材质着色器标志 0
MATERIAL_FLAG_1 = 1          ; 自定义材质着色器标志 1
MATERIAL_FLAG_2 = 1          ; 自定义材质着色器标志 2
VRS_FIX = 1                  ; 应用可变速率着色修复
DIM_EMISSIVE_IN_CUBEMAP = 1  ; 在立方体贴图渲染中降低自发光
LINK_KS_VALUES = 1           ; 链接 ks 值

; Z-buffer 调整：
DISTANT_FIX = 1    ; 减少远距离几何体的 Z-fighting
STICKERS_FIX = 1   ; 将几何体稍微向相机移动，适合贴纸等

; 替代自发光模式（一次只能使用一种）：
ADAPTIVE_EMISSIVE = 1              ; 自适应自发光模式（赛道为远距离，车辆为近处）
ADAPTIVE_DISTANT_EMISSIVE = 1      ; 自适应远距离自发光模式
ADAPTIVE_NEARBY_EMISSIVE = 1       ; 自适应近处自发光模式
WHITE_REFERENCE_POINT_EMISSIVE = 1 ; 基于白色参考点的自发光

; * — 每对象调整，如果你使用 MESHES 且仅使用它们，则不会创建新材质。
```

## 不同模式

### 混合模式（`BLEND_MODE = …`）

- `OPAQUE`：常规不透明模式
- `ALPHA_TEST`：常规 Alpha 测试
- `ALPHA_BLEND`：常规 Alpha 混合
- `ADD`：加法模式，可能适合发光区域（确保将 `ksDiffuse` 和 `ksAmbient` 设为零，仅依赖 `ksEmissive`）
- `MULTIPLY`：乘法模式（同样仅使用 `ksEmissive`，也不要忘记将 `FIXED_EMISSIVE` 设为 1 以确保表面颜色恒定）
- `TRANSPARENT_AS_BLACK`：与 Alpha 混合类似，但透明表面不是透明的而是黑色（由 Ruf Yellowbird 的扩展配置用于修复其背部网格，后面没有建模内容，其他地方也可能有用）

::: tip 提示
不透明和 Alpha 测试是最快的，其他会减慢速度。除了 `OPAQUE`、`ALPHA_TEST` 和 `TRANSPARENT_AS_BLACK` 之外的所有模式可能需要为网格设置透明标志（但仅当无法将可能在其后面的所有网格移动到渲染队列中其上方时，否则请避免使用透明标志以节省性能并提高视觉质量）。
:::

### 剔除模式（`CULL_MODE = …`）

- `FRONT`：常规模式，剔除背面
- `BACK`：显示背面，隐藏正面
- `WIREFRAME`：显示线框
- `WIREFRAME_AA`：显示抗锯齿线框（非常慢）
- `DOUBLESIDED`、`NONE` 或 `OFF`：显示双面

双面模式会增加需要着色的表面，对性能有负面影响。

### 深度模式（`DEPTH_MODE = …`）

- `NORMAL_FORCED`：默认情况下，任何透明网格（带透明标志）会忽略深度模式，这可能在某些情况下导致瑕疵，此值可能有帮助，但请谨慎使用，它不是完美的解决方案，也有自己的问题（对 Brands Hatch 的车窗有帮助）
- `OFF`（或 `DEPTH_OFF`）：网格不能被遮挡也不会遮挡任何东西，如果最后渲染则显示在最上面，如果最先渲染则所有东西会画在上面
- `NOWRITE`（或 `DEPTH_NOWRITE`、`READONLY`、`READ_ONLY`）：网格可以被其他网格遮挡，但它本身不会遮挡任何东西
- `LESSEQUAL`（或 `DEPTH_LESSEQUAL`）：如果网格恰好在同一位置，可以遮挡其他网格（将"到相机的新距离 < 到相机的旧距离"中的 `<` 替换为 `≤`）
- `LESSEQUAL_NOWRITE`（或 `DEPTH_LESSEQUAL_NOWRITE`、`LESSEQUAL_READONLY`、`LESSEQUAL_READ_ONLY`）
- `NORMAL`：默认；基于到相机距离的常规遮挡模式

`LESSEQUAL` 可能非常适合用第二层添加在车辆上的贴纸，因为它不需要任何偏移就能正常工作。

## 填充缺失纹理的颜色

- `txDiffuse`：白色
- `txMaps`：白色
- `txDetail`：白色
- `txNormal`：平面法线 (127, 127, 255)
- `txNormalBlur`：平面法线 (127, 127, 255)
- `txNormalDetail`：平面法线 (127, 127, 255)
- `txNormalR`：平面法线 (127, 127, 255)
- `txNormalG`：平面法线 (127, 127, 255)
- `txNormalB`：平面法线 (127, 127, 255)
- `txNormalA`：平面法线 (127, 127, 255)

## 新参数

Custom Shaders Patch 为各种着色器添加了一些新参数来调整它们的行为，`[SHADER_REPLACEMENT_...]` 是设置这些参数的完美方式。

### extExtraSharpLocalReflections

更改局部反射（SSLR）。在某些地方，更倾向于让反射更模糊以隐藏它们只是简单立方体贴图反射的事实（通过降低 ksSpecularEXP），但没有理由让局部反射也那么模糊。要使它们更清晰，只需设置一个非零值，它像锐度提升，范围从 0 到 1。

另一个可能更重要的功能：如果值为负数，局部反射会切换到强制模式，大幅放宽检测到的反射的质量检查。默认情况下，这些检查相当严格：最初算法是为车漆设计的，对于车漆来说，在大多数情况下，天空的反射比侧后视镜的重复错误反射更好。然而，在其他情况下，比如车轮，拥有任何混乱但局部的反射可能比天空更好。

锐度提升部分取 `extExtraSharpLocalReflections` 的绝对值，所以你可以将 `extExtraSharpLocalReflections` 设为 -0.001 来切换到强制 SSLR 反射而不改变锐度，或设为 -1 使它们既强制又额外清晰（这种组合节省了从 CPU 传递到 GPU 的数据量）。

示例，为 Kunos E30 的镀铬设置强制反射：

```ini
[SHADER_REPLACEMENT_...]
MATERIALS = Chrome
PROP_... = extExtraSharpLocalReflections, -0.001
```

### seasonAutumn, seasonWinter

几乎所有着色器都可用，允许调整漫反射颜色。秋季变量将其向黄色偏移，冬季则去饱和并提高亮度。两者都使用绿色度作为遮罩。整个功能是快速廉价的季节效果 hack，希望将来会被更实质性的东西取代。如果你想使用它，请在绑定到某个季节条件的 `[MATERIAL_ADJUSTMENT_...]` 中设置。

### extColoredReflection, extColoredReflectionNorm, extColoredBaseReflection

适用于带反射的着色器，这些参数允许高光和反射的颜色受到下面表面颜色的影响，在没有 PBR 全部开销的情况下获得正确的金属外观。它对于让车灯更有反射性而不丢失颜色也很有帮助。

- `extColoredReflection`：从 0 到 1，着色强度
- `extColoredReflectionNorm`：从 0 到 1，灰色如何被着色。默认值 0 时，它类似于只获取色相，所以深灰色和白色对反射的影响相同。值为 1 时，亮度也会被考虑，所以深灰色表面会失去大量反射
- `extColoredBaseReflection`：仅适用于同时具有常规和太阳高光的 MultiMap 着色器，反射和太阳高光使用 `extColoredReflection`，基础高光使用 `extColoredBaseReflection`

### extBounceBack

添加光反射回光源的效果，可用于具有特殊涂料的车道标志或被其他车辆灯光照亮的物体旁边的东西。

<!-- Image: https://img-webike-370429.c.cdn77.org/catalogue/webike_images/0000/0000/0121/1057006_2.jpg — 反光道路标志照片 -->

这是一个很好的[解释其原理的视频](https://www.youtube.com/watch?v=z5R6EA2jGY)。

支持的着色器：

- `ksPerPixelMultiMap_AT_NMDetail_ps`
- `ksPerPixelMultiMap_AT_ps`
- `ksPerPixelMultiMap_NMDetail_emissive_ps`
- `ksPerPixelMultiMap_NMDetail_ps`
- `ksPerPixelMultiMap_emissive_ps`
- `ksPerPixelMultiMap_ps`
- `ksPerPixelNM_ps`
- `ksPerPixelReflection_ps`
- `smLicensePlate_ps`

该变量设置反弹光的强度。额外提示：有一个灯光制作器应用可以帮助快速在相机位置创建一个朝前的聚光灯，只需增加范围和可能的强度。非常适合在此处测试。

## 对比图片

- [常规阴影 vs `DOUBLE_FACE_SHADOW_BIASED = 1`](https://acstuff.ru/u/comparison/Uab)
- [常规树木阴影 vs `SEMITRANSPARENT_SHADOWS = 1`](https://acstuff.ru/u/comparison/i27)

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/General-–-Shader-replacements) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
