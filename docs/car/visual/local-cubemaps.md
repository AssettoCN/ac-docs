---
title: 局部立方体贴图
---


> 汉化标题：车辆 – 局部立方体贴图  
> 原文页面：Cars-–-Local-cubemaps  
> 原文锚点：dce83dd  
> 汉化时间：2026-09-12T00:00:00+08:00  

局部立方体贴图是一种改善球状物体反射的技巧：在物体周围对整辆车拍摄快照，并将其用作该物体反射的遮罩。以下是实际效果：

[![YouTube 视频](https://img.youtube.com/vi/9ez4cXidH6A/0.jpg)](https://www.youtube.com/watch?v=9ez4cXidH6A)

卡特汉姆（Caterham）的大灯就是一个很好的例子。即使 SSLR 也无法正确处理它们，若大灯中没有反射出车身，它们看起来就像远处漂浮的一团团东西。

### 重要说明

- 它仅适用于尺寸相对较小的类球状物体，例如上述大灯。由于它是在某个点周围拍摄球面快照并将其用作反射遮罩，对其他任何东西（如镀铬保险杠或引擎盖）都没有帮助。

- 使用局部立方体贴图反射的网格原本应使用 “ksPerPixelMultiMap” 着色器，否则着色会出问题。如果您需要其他着色器的某些特性，请告诉我。

- 得益于大量缓存、极少更新以及对该遮罩的高度简化渲染，整体对 FPS 的影响不大。如果在 Reflections FX 设置中禁用动态局部立方体贴图，则几乎不消耗任何 FPS。

### 语法

该功能有几种用法。如果是大灯的场景，可以使用模板文件 “oldschool_lights_reflections.ini” 来简化整个设置过程（为左右大灯各设置一个局部立方体贴图）：

```ini
[INCLUDE: common/oldschool_lights_reflections.ini]  ; 包含模板，它将完成大部分工作
MeshesLeft = headlightL   ; 左侧网格列表，可选
MeshesRight = headlightR  ; 右侧网格列表，可选
MeshesToCut = headlights  ; 要切分的网格列表（如果左右大灯共
                          ; 用一个网格）
SplitAxis = 1, 0, 0       ; 仅在使用 MeshesToCut 时需要，切分所沿的轴（以防网格
                          ; 被奇怪地旋转）
SplitThreshold = 0        ; 仅在使用 MeshesToCut 时需要，切分所围绕的轴上位置
Offset = 0, 0, 0          ; 立方体贴图枢轴的偏移，单位米（左侧贴图的 X 会被取反）
HigherResolution = 0      ; 在少数需要更高分辨率的情况下设为 1
DynamicReflections = 0    ; 设为 1 启用动态更新，例如需要在反射中显示前轮
                          ; 的移动和转向时
DebugMode = 0             ; 设为 1 启用调试模式以检查更新区域
Reflectivity = 0.5        ; 材质的反射程度（0.5 是镀铬材质的理想值）
ExcludeNodes = COCKPIT_HR, HUB_LR, HUB_RR  ; 要从反射中排除的节点列表，用于提速（通常没必要
                          ; 浪费时间渲染尾部零件、后轮和内饰）
```

对于更通用的情况，请使用更直接的语法（该模板展开后就是它），每节只设置一个立方体贴图：

```ini
[LOCAL_CUBEMAP_...]
MESHES = Spotlight_SUB0     ; 要更改材质并添加局部立方体贴图的网格列表
POSITION = 0, 0, 0          ; 可选，手动设置位置（否则使用网格中心）
OFFSET = 0.08, 0, 0.13      ; 立方体贴图枢轴的偏移，单位米
HIGH_RESOLUTION = 1         ; 在少数需要更高分辨率的情况下设为 1
IS_DYNAMIC = 1              ; 设为 1 启用动态更新
DEBUG = 0                   ; 设为 1 启用调试模式以检查更新区域
STATIC_FACES = TOP, BOTTOM, FRONT, LEFT  ; 停止动态更新的面列表（对性能帮助
                            ; 很大，建议开启调试模式并尽量多添加面）
EXCLUDE_NODES = COCKPIT_HR  ; 要从反射中排除的节点列表，用于提速
```

如果您想更手动地将网格一分为二，[这里也有相关文档](https://github.com/car/visual/meshes-splitting)。

### 稍后添加的功能

- 为赛道提供类似功能。

