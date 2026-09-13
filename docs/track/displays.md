---
title: 显示
---


> 汉化标题：赛道 – 显示  
> 原文页面：Tracks-–-Displays  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

显示屏可以让赛道纹理动起来。目前它们只支持摄像机画面，但之后会有更多选项（希望如此）。

<a href="https://gfycat.com/horribledimhermitcrab"><img src="https://giant.gfycat.com/HorribleDimHermitcrab.gif" width="400" ></a>

整个配置由两部分组成：第一部分是显示屏的常规设置（目标网格、在纹理上的位置与尺寸、颜色调整），第二部分是实际的显示模式，目前只有摄像机。

提示：要让显示屏在夜间亮起，请在单独的 MATERIALS_ADJUSTMENT 节中使用该材质并加一些自发光，在 DISPLAY 节中使用该网格

### 语法（常规）

```ini
[DISPLAY_...]
; 常规设置：
MESHES = tvstaff_HI_?    ; 用作显示屏的赛道网格列表
REGION_START = 20, 320   ; 显示屏在纹理上的位置，以像素计
REGION_SIZE = 508, 290   ; 显示屏在纹理上的尺寸，以像素计

; 更新与渲染选项
HIGH_REFRESH_RATE = 1    ; 高刷新率（默认启用；开启时 30 FPS，关闭时 15 FPS）
FLIP_X = 0               ; 改为 1 可沿 X 轴翻转输出（主要针对奇怪的 UV 映射）
FLIP_Y = 0               ; 改为 1 可沿 Y 轴翻转输出（主要针对奇怪的 UV 映射）

; 颜色校正：
OUTPUT_ALPHA = 1         ; 显示区域的 alpha 通道值
OUTPUT_GAMMA = 0.55      ; 伽马校正，减小可让暗部更暗
OUTPUT_SATURATION = 1.0  ; 饱和度校正
OUTPUT_BRIGHTNESS = 1.0  ; 亮度校正
OUTPUT_FISH_EYE = 0.0    ; 增大可添加镜头畸变效果
OUTPUT_VIGNETTE = 0.0    ; 增大可让四角变暗
OUTPUT_CHROMATIC_ABERRATION = 0.0 ; 增大可添加那种讨厌的色差

; 模式设置：
…
```

然后，要让整个功能工作，还需在同一节中添加模式设置。

### 语法（摄像机模式）

```ini
[DISPLAY_...]
; 常规设置：
… 

; 模式设置：
MODE = CAMERA

; 第一个摄像机
CAMERA_0 = 176.03, 211.67, -189.67         ; 摄像机位置
CAMERA_0_TARGET = 171.65, 209.59, -185.13  ; 摄像机注视的点
CAMERA_0_UP = 0, 1, 0                      ; 摄像机的向上方向，默认为 0, 1, 0
CAMERA_0_FOV = 50                          ; FOV 角度（度），默认为 50
CAMERA_0_ASPECT_RATIO = 1.752              ; 宽高比，默认为 REGION_SIZE.x/REGION_SIZE.y

; 第二个摄像机
CAMERA_1 = 451.95, 197.55, 103.46
CAMERA_1_TARGET = CLOSEST_CAR  ; 不用固定点，而是使用最近的车
CAMERA_1_TARGET_INERTIA = 0.9  ; 摄像机惯性，用于更平滑的移动
CAMERA_1_TARGET_TARGET_REFERENCE_POINT = 431, 197, 103
                               ; 选取最近车辆时相对的点，默认为摄像机位置

CAMERA_2 = -44.02, 195.05, 284.45
CAMERA_2_TARGET = FOCUSED_CAR  ; 另一种模式，焦点车辆（通常是摄像机所绑定的那辆车）
CAMERA_2_TARGET_INERTIA = 0.9
CAMERA_2_FOV = 35
```

目前，处于活动状态的是最近的那个摄像机。举个例子，假设赛道各处有一批电视屏。你可以用单个 `[DISPLAY_...]` 设置它们，然后在每台电视旁边放一个摄像机。激活最近的摄像机可以确保车手无论当前离哪台电视最近，都能看到合适的画面；而其本质上仍是单一实体、单一渲染通道、单一纹理合成，因此一切都干净且经过优化。

### 关于处理距离

摄像机和显示屏只有在离摄像机不太远时才会工作。你不能让摄像机显示 10 公里外的景物，这是一个相当重要的限制，而且完全是有意为之。即便是现在，AC 也已经有了 LOD 之类的种种优化，这些摄像机必须把这些考虑在内，不能简单地让所有东西都可见，否则性能会很糟糕。此外，CSP 最近加入了区块（chunk）优化，直接把远处的几何体从场景树中移除以节省处理时间，我希望以后还能在那里加入更多东西，理想情况下是把资源从 VRAM 乃至 RAM 中卸载。当然，如果摄像机能显示 10 公里外的东西，这一切就都白费了。

### 数字屏幕着色器

正如你在介绍 GIF 中所见，它不只是显示图像，还有那种像素纹样，并在掠射角下把颜色搞乱等等。这并非 `[DISPLAY_...]` 的功劳，而是来自 `common/materials_track.ini` 中自定义材质 `[Material_DigitalScreen]`。

它可以以两种不同的方式工作。如果你的屏幕是单独分离的网格，那就简单了，直接整体使用即可：

```ini
[Material_DigitalScreen]
Materials = tv_staff
UseTextureCoordinates = 1  ; 如果映射看起来不对，改为 0
                           ; （其实不应该会不对，否则 DISPLAY_… 又怎么能工作呢？）
ScreenAspectRatio = 0.5    ; 若像素看起来被拉伸，请调整
ScreenScale = 1024         ; 按目标分辨率调整，一般在这里填纹理尺寸可能是个好主意
```

另一种情况是屏幕与普通网格合在一起，这时可以使用带各种遮罩选项的 MultiMap 版本。我在 Vallelunga 上是这样设置的：在 `[DISPLAY_...]` 中使用 `OUTPUT_ALPHA = 0`，因为那里 `txDiffuse` 其余部分的 alpha 通道是白色的：

```ini
[Material_DigitalScreen]
Materials = tv_staff
UseMultiMap = 1
UseDiffuseMask = INVERT  ; 与 DISPLAY 中的 OUTPUT_ALPHA = 0 配合使用
ScreenScale = 1024
```

除 `UseDiffuseMask` 外，还有 `UseMapsMask` 和 `UseNormalMask`，两者都接受 `0`、`1` 或 `INVERT`。还有一个选项是显式定义区域：

```ini
[Material_DigitalScreen]
Materials = tv_staff
UseMultiMap = 1
UseAreaMask = 1
AreaMaskCenter = 264, 464
AreaMaskSize = 508, 288
AreaMaskTotalSize = 2048, 2048
ScreenScale = 1024
```

### 计划日后添加的功能

- 更多模式：可编程的内容、幻灯片轮播，最好还能播放视频；
- 更多摄像机模式与运动方式；
- 让 3D 摄像机跟随车辆？不过这更多属于赛道动画的范畴；
- 支持对缩放和旋转过的映射进行调整？

