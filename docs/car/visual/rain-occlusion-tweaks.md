---
title: 雨水遮挡调整
---


> 汉化标题：车辆 – 雨水遮挡调整  
> 原文页面：Cars-–-Rain-occlusion-tweaks  
> 原文锚点：03691b4  
> 汉化时间：2026-09-12T00:00:00+08:00  

为了估计车辆上的哪些网格应该被打湿、哪些应该保持干燥，CSP 会在加载时进行非常基础的逐顶点 AO 烘焙。如果某个顶点被照亮，就可以认为它从外部足够可见，因此可能被打湿。这需要一点时间，但每辆车只进行一次（大多数情况下），结果随后会缓存到 “cache/cars_data/…/rain_occlusion”。

实际烘焙时，CSP 会在车辆周围均匀布置 256 盏灯（来自所有方向，而不只是上半部分，这样翻覆车辆的车底也可能被打湿），为这些灯光生成阴影贴图，然后遍历所有顶点并与阴影贴图比较。

几点说明：
- 使用 `ksBrokenGlass`、`ksWindscreen` 着色器的网格，或名称以 `DAMAGE_GLASS` 开头的网格会被排除；
- 如果网格的任一父节点没有 “active” 标志，它就不会投射阴影（`COCKPIT_LR` 不参与就是这个原理）；
- 该过程同样作用于 LOD；
- CSP 会估算车辆尺寸来计算阴影贴图应该多大（毕竟需要覆盖整辆车）。如果有一小块几何体离车很远，CSP 会发现它，把阴影贴图拉大，结果就得不到可用的质量；
- 如果网格没有任何顶点的湿度超过 5%，该网格就不会被标记为在全面降雨时需要开销高昂的雨滴着色器；
- 可以在 CSP Debug 应用中查看烘焙好的雨水遮挡。注意 CSP 还有一张单独的动态车辆湿度图叠加其上，因此需要让车辆在雨中淋上一段时间才能看到确切的湿度；
- 默认情况下，任何带有专属 `MODEL_REPLACEMENT_…` 节的涂装都会获得自己的阴影贴图，这样如果涂装替换了车辆外部的一块几何体，它也能被正确打湿。但如果涂装只是替换了仪表台之类的东西，也会导致它进行单独的湿度计算而拖慢速度，因此您可能需要显式指定是否需要单独的雨水遮挡计算。

![CSP Debug](https://files.acstuff.club/8bPu/20251108-120720.png)
*未带雨滴着色器标志的网格显示为蓝色。红色为完全湿润，绿色为干燥。*

### 配置

实际计算可以通过以下设置调整：

```ini
[RAIN_FX]
CUSTOM_SKIN_OCCLUSION = 0 ; 设为 1 可让每种涂装拥有单独的雨水遮挡。唯一会用到该设置的情况是设为 0：当某涂装的 `MODEL_REPLACEMENT_…` 只更改了不影响雨水分布的内饰时。

; 要在特定位置遮挡雨水，可以添加这些节来描述投射阴影的额外球体：
[RAIN_FX_OCCLUSION_CASTING_SPHERE_…]
POSITION = X, Y, Z ; 相对车辆模型坐标
RADIUS = Rx, Ry, Rz ; 各轴分别指定，单位米
  ; 请注意，这些 Rx/Ry/Rz 也可以只设一个值，该值将同时用于三个轴

; 要调整特定材质或网格，请使用：
[RAIN_FX_OCCLUSION_ADJUSTMENT_…]
MESHES = ?
MATERIALS = ? ; 此项与 MESHES 均为常规过滤器。若都未设置，则应用于全部。

SAMPLE_OFFSET = 0 ; 沿法线移动阴影贴图采样点，单位米。如果上层网格在下层网格上投下阴影，可以增大下层网格的该值，使其在稍远处采样阴影贴图。若未设置，则使用有助于效果的默认值。

WETNESS_MULT = 1 
WETNESS_ADD = 0
WETNESS_MIN = 0
WETNESS_MAX = 1
WETNESS_EXP = 1 ; 基础后处理。如果想让某个网格完全湿透，将 WETNESS_MIN 设为 1。如果想让某个网格完全不受雨淋（例如薄车顶边缘渗水时），将 WETNESS_MAX 设为 0。

; 默认的采样偏移会略微降低内饰湿度、提高车外车窗湿度（对贴纸有帮助）：
[RAIN_FX_OCCLUSION_ADJUSTMENT]
INTERIOR_SAMPLE_OFFSET = -0.01
EXTERIOR_WINDOWS_SAMPLE_OFFSET = 0.01
EXTERIOR_MIRRORS_SAMPLE_OFFSET = 0.01
```

### 加热

还有一项独立的机制：车辆热起来后，发热区域周围的湿度会降低。默认只影响排气和车轮。可以调整的参数如下：

```ini
; 排气点的默认参数：
[RAIN_FX_OCCLUSION_HEATING_EXHAUST]
RADIUS = 0.3, 0.4, 0.5 ; 排气点周围加热球体的 Rx, Ry, Rz（使用火焰，或存在时的 `PARTICLES_FX_EXHAUST_…` 条目）
GRADIENT_OFFSET = 0.2 ; 相对半径的比例位置，强度从该处开始衰减
INTENSITY = 0.4 ; 将此项和 INTENSITY_FACING 设为 0 可禁用
INTENSITY_FACING = 5 ; 在 0.1 半径内强度更高（GRADIENT_OFFSET 为 0.8 时），几乎可以阻止排气点本身上的任何雨水

; 额外加热点：
[RAIN_FX_OCCLUSION_HEATING_…]
MESHES = ? ; 受影响网格的过滤器
POSITION = X, Y, Z
RADIUS = Rx, Ry, Rz
GRADIENT_OFFSET = 0
INTENSITY = 0.5
```

### 可选车顶的情况

综合以上，车顶可在设置菜单中切换的情况虽然棘手，但可以实现。单独一个 [`[WING_BASED_SWITCH_…]`](https://github.com/car/visual/optional-parts) 条目可以带有 `ALTER_SHAPE = RAIN_OCCLUSION` 参数，它会生成一套备用的雨水遮挡。或者，将您的动画命名为 “roof.ksanim”，如果您没有使用 `[WING_BASED_SWITCH_…]` 且动画设置正确，CSP（较新的版本，如 0.2.11）应该能识别它并自动生成备用的湿度计算。

