---
title: 折射大灯
---


> 汉化标题：车辆 – 折射大灯  
> 原文页面：Cars-–-Refracting-headlights  
> 原文锚点：cbdfc27  
> 汉化时间：2026-09-12T00:00:00+08:00  
> 译注：reflector 译作「反光碗」；bezel 译作「饰圈」；ray-marching 译作「光线步进」  

折射大灯用自定义着色器替换常规的透明罩盖材质，模拟光线穿过透镜时的折射；大灯的内部体积（反光碗、饰圈和灯泡）被烘焙成一组小纹理，并在运行时以光线步进方式渲染。与普通透明着色器相比，这能带来可信得多的深度、视差和点亮的灯泡效果，且每帧不增加任何额外的几何体或绘制调用。[展示实际效果的 YouTube 视频](https://www.youtube.com/watch?v=UlPzYAlPEy4)。

每个大灯由一组外罩网格（透明透镜）和隐藏在其后的一组内部网格定义。首次加载时，CSP 会渲染这些网格的几张正交快照（表面法线、内部颜色、深度、法线遮罩以及灯泡用的自发光贴图），并在运行时用它们模拟折射、内部反射和辉光。这些贴图通常在同一车辆的左右大灯之间共享，并且可以跨游戏会话缓存到磁盘。

### 要求

- 外罩网格原本必须使用透明着色器。其材质会被替换为 `smRefractingCover`（或在正向 TAA 可用时使用 `smRefractingCover_taa`）。
- 必须至少指定一个内部网格，否则该大灯会被跳过并给出警告。
- 一个网格只能属于一个折射大灯；如果它已被另一个 `[REFRACTING_HEADLIGHT_…]` 小节使用，则会被忽略。
- 请考虑保持较低的分辨率和小节数量，并尽可能使用镜像。每个条目会占用几 MB 的内存和显存；配合多通道自发光时，大多数情况下前灯一个条目、后灯一个条目就足够了。

### 语法

每个大灯定义一个小节。大多数数值参数可以在游戏内的 Reflections FX 调试 App（Refraction 选项卡）中实时调节，再用「Copy settings to clipboard」按钮复制回配置。

```ini
[REFRACTING_HEADLIGHT_0]
ACTIVE = 1                       ;设为 0 禁用该大灯
SURFACE = headlight_glass_L      ;外部透明罩盖网格（必填）
INSIDE = headlight_inner_L       ;罩盖之后用于烘焙内部贴图的网格（必填）
INSIDE_BULBS = bulb_L            ;可选，视为灯泡的网格（一张更亮、单独模糊的贴图）
OVERLAY = headlight_decals_L     ;可选，烘焙在罩盖顶部的额外图层（例如类似遮住部分玻璃的电工胶带）
SURFACE_LODS = headlight_glass_L? ;可选，来自较低 LOD 的额外罩盖网格，同样应用该着色器
BLEND_MODE = OPAQUE              ;折射材质的混合模式；当 REFRACTION_MASKING = 1 时使用 ALPHA

; 参考空间（origin/direction/mirror 在该空间中解释）
RELATIVE_TO = CAR                ;CAR、SURFACE、PARENT、PARENTS_PARENT 之一，或节点名；SURFACE/PARENT
                                 ;适用于可动画/可开合的大灯罩盖

; 放置（若五个值未全部给出，则从 SURFACE 网格自动猜测）
ORIGIN = 0.7, 0.7, 1.8           ;所选参考空间中的大灯中心
RADIUS = 0.12                    ;透镜覆盖区域的半尺寸（米）
DIRECTION = 0, 0, 1              ;透镜的朝外方向（会被归一化）
MIRROR_POS = 0, 0, 0             ;左右大灯之间对称平面上的一个点
MIRROR_DIR = 1, 0, 0             ;该对称平面的法线

; 玻璃/折射
IOR = 1.5                        ;罩盖的折射率
F0 = 0.8                         ;罩盖的基础菲涅尔反射率
ABSORPTION = 0.02                ;体积内吸收的光线量（雾状玻璃）
NM_SHARE_EXT = 0                 ;罩盖原始法线贴图影响外部折射的程度（0–1）
NM_SHARE_INT = 0.6               ;其影响内部反射的程度（0–1）
NORMALS_BIAS = 0, 0, 0           ;加到烘焙内部法线上的偏置
LOD_BIAS = -0.5                  ;采样烘焙内部贴图的 mip LOD 偏置
SIDE_FALLOFF = 0                 ;柔化罩盖边缘附近的外观
EXTRA_SIDE_THICKNESS = 0         ;靠近边缘处额外模拟的玻璃厚度
GLASS_EXTRA_THICKNESS = 0.005    ;额外的均匀玻璃厚度（米）
IOR_FLYOUT_FLAT = 0              ;将 IOR 向 1 插值（平透镜），0 保持物理效果，1 禁用折射；
                                 ;并非物理正确，仅用于风格化的平透镜
RAYTRACE_STEP_START = 0.072      ;初始光线步进步长（相对于 RADIUS）
RAYTRACE_STEP_INCREASE = 1.05    ;后续光线步进步长的几何增长系数

; 体积内的反射
REFLECTIVENESS_MULT = 10         ;烘焙内部几何体锐利反射的增强
REFLECTIVENESS_DIFFUSE_MULT = 60 ;这些反射中漫反射部分的增强
REFLECTIVE_GAMMA = 1             ;作用于反射响应曲线的伽马
BOUNCED_BACK_MULT = 0.4          ;光线从内部经罩盖弹回的强度
INNER_SPECULAR = 10              ;内部表面的高光强度
INNER_SPECULAR_EXP = 800         ;内部表面的高光锐度（相当于 ksSpecularEXP）
AMBIENT_MULT = 0.25              ;到达内部体积的环境光量

; 颜色
GLASS_COLOR = 0.5, 0.5, 0.5      ;罩盖施加的色调，RGB
DIFFUSE_MAP_MULT = 1             ;烘焙内部漫反射贴图的乘数
DIFFUSE_MAP_FILTER_MULT = 1      ;将漫反射贴图用作自发光颜色滤镜的乘数
EXTRA_GLASS_COLORIZATION = 1     ;额外的玻璃着色处理；仅当 DIFFUSE_MAP_FILTER_MULT 未设置时默认为 1

; 自发光（灯泡在大灯内部发光）
BASE_EMISSIVE_K = 0.05           ;恒定的基础自发光
EMISSIVE_MULT = 1                ;内部自发光贡献的乘数
GLASS_EMISSIVE_MULT = 0.25       ;罩盖自身因内部自发光而发光的程度

; 灯泡（从内部自发光贴图中提取的小亮点）
BULB_COLOR = 1, 1, 1             ;施加到检测到的灯泡上的色调
BULB_REFLECTION_K = 0.2          ;灯泡的反射调整（负值减弱）
BULB_BLUR_K = 2                  ;灯泡贴图的模糊乘数

; 表面遮罩（使用外罩自身的纹理）
USE_NORMAL_ALPHA = 0             ;从罩盖的 txNormal 获取折射形状的 alpha；若任一罩盖材质
                                 ;使用从法线取 alpha 的着色器，则默认为 1
REFRACTION_MASKING = 0           ;将漫反射 alpha 用作折射遮罩（透明部分跳过折射）；
                                 ;仅在 USE_NORMAL_ALPHA = 1 时有效，运行时还会强制使用 ALPHA 混合模式

; 共享与缓存
SHARED = 1                       ;在同一车辆设置完全相同的小节之间共享计算出的贴图；
                                 ;若 DYNAMIC_EMISSIVE_MAP = 1 则默认为 0
DYNAMIC_EMISSIVE_MAP = 0         ;设为 1 可在内部自发光于运行时变化时重新烘焙内部自发光贴图
                                 ;（开销更大，默认禁用共享）
RESOLUTION_MULT = 1              ;烘焙贴图分辨率的乘数，限制在 0.25–4（默认基准为 256 px）
```

### 自定义灯泡

默认情况下，灯泡从烘焙的内部自发光贴图自动检测。若要改为手动定义，请使用：

```ini
USE_CUSTOM_BULBS = 1             ;切换到手动定义的灯泡
USE_COLORED_BULBS = 0            ;设为 1 为不同颜色的灯泡保留独立通道
MIRROR_3_AS_4 = 1                ;对于多通道灯泡，右侧使用通道 4 而非通道 3（类似于
                                 ;多通道自发光中的 emMirrorChannel3As4）
MIRROR_2_AS_5 = 0                ;同理，右侧通道 2 → 通道 5
CUSTOM_BULB_0 = 0.5, 0.5, 0, 0   ;(x, y, size, aspect)：归一化 0–1 烘焙贴图坐标中的中心，
                                 ;以及灯泡形状的尺寸和长宽比；最多支持四个灯泡
CUSTOM_BULB_1 = …
CUSTOM_BULB_2 = …
CUSTOM_BULB_3 = …
```

### 将内部自发光关联到罩盖

罩盖材质拥有自己的 ksEmissive 风格通道，着色器用它们驱动大灯辉光和灯泡强度。若要将内部网格自发光的值复制到这些通道（例如让内部点亮远光时罩盖也亮起），请定义一个或多个 `SYNC_EMISSIVE_…` 块：

```ini
SYNC_EMISSIVE_0 = bulb_L                ;自发光用于驱动罩盖的内部网格
SYNC_EMISSIVE_0_CHANNEL_IN = 0          ;在内部网格上读取的通道（默认 0 = ksEmissive）
SYNC_EMISSIVE_0_CHANNEL_OUT = 0         ;写入罩盖网格的通道（默认 0）
SYNC_EMISSIVE_0_MULT = 1                ;复制时施加的乘数
```

`CHANNEL_IN` 和 `CHANNEL_OUT` 接受单个值或等长列表，以便同时重映射多个通道。如果既未设置 `SYNC_EMISSIVE_…` 也未设置 `SYNC_EMISSIVE_AUTO`，则不会进行复制。

```ini
SYNC_EMISSIVE_AUTO = 1           ;捷径：自动将所有 INSIDE 网格的 ksEmissive 以乘数 1 复制到
                                 ;罩盖网格（仅当未设置任何 SYNC_EMISSIVE_… 块时使用）
```

当被同步的内部网格在其 extra-FX 标志中被标记为 `light_brakes` 或 `light_headlights` 时，相同的标志会自动传播到罩盖网格，使其辉光对相应的灯光状态作出反应。

### 多个大灯

每个灯定义一个小节（`[REFRACTING_HEADLIGHT_0]`、`[REFRACTING_HEADLIGHT_1]`……）。当同一车辆上的两个小节设置完全相同（哈希一致）时，它们共享同一组烘焙贴图以节省内存；该行为默认启用，可通过 `SHARED = 0` 关闭。

### 缓存

首次加载时烘焙贴图需要几帧时间。若在 CSP 设置中启用缓存（Reflections FX → 折射大灯缓存），生成的贴图会按车辆存储到磁盘，并在后续加载时复用。小节设置改变时，缓存自动失效。

### 调节

Reflections FX 调试 App 提供一个 Refraction 选项卡，其中包含上述每个参数的滑块、ORIGIN / DIRECTION / MIRROR_POS / MIRROR_DIR 的操作手柄（gizmo），以及每张烘焙贴图的预览。可以先用它调好一个大灯，然后按下「Copy settings to clipboard」，得到可直接粘贴的 `[REFRACTING_HEADLIGHT_0]` 块。

