---
title: 显示屏（Displays）
---

# 显示屏（Displays）

显示屏允许为赛道纹理制作动画。目前仅支持摄像机画面源，但以后会提供更多选项。

整个配置由两部分组成，第一部分用于一般显示设置（目标网格、纹理上的位置和大小、颜色调整），第二部分用于实际模式，目前只有一些摄像机。

提示：要在夜间点亮它，请在单独的 MATERIALS_ADJUSTMENT 部分使用该材质并添加一些自发光，在 DISPLAY 部分使用该网格。

## 语法（通用）

```ini
[DISPLAY_...]
; 通用设置：
MESHES = tvstaff_HI_?    ; 作为显示屏的赛道网格列表
REGION_START = 20, 320   ; 纹理上显示屏的位置（像素）
REGION_SIZE = 508, 290   ; 纹理上显示屏的大小（像素）

; 更新和渲染选项
HIGH_REFRESH_RATE = 1    ; 高刷新率（默认启用；开启时 30 FPS，关闭时 15 FPS）
FLIP_X = 0               ; 设为 1 翻转 X 轴输出（主要用于奇怪的 UV 映射）
FLIP_Y = 0               ; 设为 1 翻转 Y 轴输出（主要用于奇怪的 UV 映射）

; 颜色校正：
OUTPUT_ALPHA = 1         ; 显示区域的 alpha 通道值
OUTPUT_GAMMA = 0.55      ; 伽马校正，降低使暗区更暗
OUTPUT_SATURATION = 1.0  ; 饱和度校正
OUTPUT_BRIGHTNESS = 1.0  ; 亮度校正
OUTPUT_FISH_EYE = 0.0    ; 增加以添加镜头畸变效果
OUTPUT_VIGNETTE = 0.0    ; 增加以使角落变暗
OUTPUT_CHROMATIC_ABERRATION = 0.0 ; 增加以添加色差效果

; 模式设置：
…
```

然后，在同一部分添加模式设置以使整个系统工作。

## 语法（摄像机模式）

```ini
[DISPLAY_...]
; 通用设置：
… 

; 模式设置：
MODE = CAMERA

; 第一台摄像机
CAMERA_0 = 176.03, 211.67, -189.67         ; 摄像机位置
CAMERA_0_TARGET = 171.65, 209.59, -185.13  ; 摄像机看向的点
CAMERA_0_UP = 0, 1, 0                      ; 摄像机的向上方向，默认为 0, 1, 0
CAMERA_0_FOV = 50                          ; FOV 角度（度），默认为 50
CAMERA_0_ASPECT_RATIO = 1.752              ; 宽高比，默认为 REGION_SIZE.x/REGION_SIZE.y

; 第二台摄像机
CAMERA_1 = 451.95, 197.55, 103.46
CAMERA_1_TARGET = CLOSEST_CAR  ; 替代固定点，使用最近的车辆
CAMERA_1_TARGET_INERTIA = 0.9  ; 摄像机惯性，更平滑的移动
CAMERA_1_TARGET_TARGET_REFERENCE_POINT = 431, 197, 103
                               ; 取最近车辆的参考点，默认为摄像机位置

CAMERA_2 = -44.02, 195.05, 284.45
CAMERA_2_TARGET = FOCUSED_CAR  ; 另一种模式，聚焦车辆（通常是摄像机链接的车辆）
CAMERA_2_TARGET_INERTIA = 0.9
CAMERA_2_FOV = 35
```

当前，活动摄像机是最近的一台。其工作方式是，例如你在赛道各处有一堆电视屏。你可以用一个 `[DISPLAY_...]` 设置它们，然后在每台电视旁边添加一台摄像机。最近的摄像机处于活动状态确保驾驶员获得他们当前最近电视的正确视图，而且本质上它是单个实体、单个渲染通道、单个纹理组合，所以一切都很干净和优化。

## 关于处理距离

摄像机和显示屏只在距离摄像机不太远时才工作。你不能让摄像机从 10 公里外显示东西，这是一个非常重要的限制，完全是有意为之。即使现在，AC 有所有那些 LOD 等优化，而那些摄像机需要考虑这一点，不能让所有东西都可见，否则性能会很差。此外，CSP 最近获得了区块优化，简单地从场景树中移除远处的几何体以节省处理时间，我希望以后能添加更多内容，理想情况下从 VRAM 甚至 RAM 卸载资源。当然，让摄像机从 10 公里外显示东西会破坏所有这些。

## 数字屏幕着色器

数字屏幕着色器 `[Material_DigitalScreen]` 来自 `common/materials_track.ini`。

它可以以两种不同方式工作。如果你的屏幕是独立网格，很简单，直接用于整个对象：

```ini
[Material_DigitalScreen]
Materials = tv_staff
UseTextureCoordinates = 1  ; 如果映射看起来奇怪，改为 0
                           ; （虽然不应该，否则 DISPLAY_… 怎么工作？）
ScreenAspectRatio = 0.5    ; 如果像素看起来歪斜则调整
ScreenScale = 1024         ; 调整目标分辨率，通常使用纹理大小可能是好主意
```

另一种情况是屏幕与常规网格组合，可以使用 MultiMap 版本配合不同的遮罩选项。以下是 Vallelunga 的设置，在 `[DISPLAY_...]` 中使用 `OUTPUT_ALPHA = 0`，因为那里的 `txDiffuse` 其余部分有白色 alpha 通道：

```ini
[Material_DigitalScreen]
Materials = tv_staff
UseMultiMap = 1
UseDiffuseMask = INVERT  ; 配合 DISPLAY 中的 OUTPUT_ALPHA = 0 使用
ScreenScale = 1024
```

除了 `UseDiffuseMask`，还有 `UseMapsMask` 和 `UseNormalMask`，三者都可以取 `0`、`1` 或 `INVERT`。另一个选项是显式定义区域：

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

## 引用来源

- [CSP 官方 Wiki 原文](https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki/Tracks-–-Displays) — 内容来源
- [acc-extension-config 仓库](https://github.com/ac-custom-shaders-patch/acc-extension-config) — CSP 官方配置文件
- [INIpp 配置语法](https://github.com/ac-custom-shaders-patch/inipp) — 配置格式参考
